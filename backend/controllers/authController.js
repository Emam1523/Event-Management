const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { sendVerificationCodeEmail } = require('../services/emailService');

const CODE_TTL_MINUTES = 15;

const hashCode = (code) => crypto.createHash('sha256').update(code).digest('hex');

const createVerificationCode = async ({ email, purpose, metadata = {} }) => {
  const code = crypto.randomInt(100000, 1000000).toString();
  await prisma.verificationCode.create({
    data: {
      email,
      purpose,
      codeHash: hashCode(code),
      metadata,
      expiresAt: new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000),
    },
  });
  return code;
};

const verifyStoredCode = async ({ email, purpose, code }) => {
  const record = await prisma.verificationCode.findFirst({
    where: {
      email,
      purpose,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!record || record.codeHash !== hashCode(code)) {
    return null;
  }

  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  return record;
};

const toUserPayload = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  emailVerified: user.emailVerified,
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.password) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.emailVerified) {
    res.status(403);
    throw new Error('Please verify your email before signing in');
  }

  if (await bcrypt.compare(password, user.password)) {
    res.json({
      user: toUserPayload(user),
      token: generateToken(user.id, user.role)
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const userExists = await prisma.user.findUnique({
    where: { email }
  });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      password: hashedPassword,
      emailVerified: false,
    }
  });

  const code = await createVerificationCode({
    email: user.email,
    purpose: 'registration',
    metadata: { userId: user.id },
  });

  try {
    await sendVerificationCodeEmail({
      to: user.email,
      name: user.name,
      code,
      purpose: 'registration',
    });
  } catch (emailErr) {
    console.warn('Failed to send verification email:', emailErr.message);
  }

  if (user) {
    res.status(201).json({
      user: toUserPayload(user),
      verificationRequired: true,
      message: 'Verification code sent to your email address',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (user) {
    res.json({
      user: toUserPayload(user)
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Request a verification code
// @route   POST /api/auth/request-code
// @access  Public/Private
exports.requestVerificationCode = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body;

  if (!email || !purpose) {
    res.status(400);
    throw new Error('Email and purpose are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const code = await createVerificationCode({
    email,
    purpose,
    metadata: { userId: user.id },
  });

  await sendVerificationCodeEmail({
    to: email,
    name: user.name,
    code,
    purpose,
  });

  res.json({ message: 'Verification code sent' });
});

// @desc    Verify code for registration/checkout/email update
// @route   POST /api/auth/verify-code
// @access  Public/Private
exports.verifyCode = asyncHandler(async (req, res) => {
  const { email, purpose, code } = req.body;

  if (!email || !purpose || !code) {
    res.status(400);
    throw new Error('Email, purpose, and code are required');
  }

  const record = await verifyStoredCode({ email, purpose, code });
  if (!record) {
    res.status(400);
    throw new Error('Invalid or expired verification code');
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (purpose === 'registration' || purpose === 'checkout' || purpose === 'email-update') {
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });
    }
  }

  const response = {
    verified: true,
    message: 'Verification successful',
  };

  if (purpose === 'registration' && user) {
    response.token = generateToken(user.id, user.role);
    response.user = toUserPayload({ ...user, emailVerified: true });
  }

  res.json(response);
});

// @desc    Confirm password change after code verification
// @route   POST /api/auth/confirm-password-change
// @access  Private
exports.confirmPasswordChange = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    res.status(400);
    throw new Error('Email, code, and new password are required');
  }

  const record = await verifyStoredCode({ email, purpose: 'password-change', code });
  if (!record) {
    res.status(400);
    throw new Error('Invalid or expired verification code');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  res.json({
    message: 'Password updated successfully',
    user: toUserPayload(updatedUser),
  });
});
