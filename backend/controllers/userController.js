const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendVerificationCodeEmail } = require('../services/emailService');

const hashCode = (code) => crypto.createHash('sha256').update(code).digest('hex');

const createVerificationCode = async (email, purpose, metadata = {}) => {
  const code = crypto.randomInt(100000, 1000000).toString();
  await prisma.verificationCode.create({
    data: {
      email,
      purpose,
      codeHash: hashCode(code),
      metadata,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });
  return code;
};


exports.getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
  res.json(users);
});


exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, password, passwordVerificationCode } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (email && email !== existingUser.email) {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400);
      throw new Error('Email is already in use');
    }
  }

  const data = {
    ...(name !== undefined ? { name } : {}),
    ...(email !== undefined ? { email } : {}),
    ...(phone !== undefined ? { phone } : {}),
  };

  if (password) {
    if (!passwordVerificationCode) {
      const code = await createVerificationCode(existingUser.email, 'password-change', { userId: existingUser.id });
      await sendVerificationCodeEmail({
        to: existingUser.email,
        name: existingUser.name,
        code,
        purpose: 'password-change',
      });

      res.status(202).json({
        requiresVerification: true,
        message: 'Verification code sent to your email. Re-submit with the code to update your password.',
      });
      return;
    }

    const codeRecord = await prisma.verificationCode.findFirst({
      where: {
        email: existingUser.email,
        purpose: 'password-change',
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!codeRecord || codeRecord.codeHash !== hashCode(passwordVerificationCode)) {
      res.status(400);
      throw new Error('Invalid or expired verification code');
    }

    await prisma.verificationCode.update({
      where: { id: codeRecord.id },
      data: { consumedAt: new Date() },
    });

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data
  });

  res.json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone || '',
    role: updatedUser.role
  });
});
