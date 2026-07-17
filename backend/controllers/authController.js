const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const { sendVerificationCodeEmail } = require("../services/emailService");

const CODE_TTL_MINUTES = 15;

const hashCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

const createVerificationCode = async ({ email, purpose, metadata = {} }) => {
  const code = crypto.randomInt(100000, 1000000).toString();
  await prisma.verificationCode.create({
    data: {
      email,
      purpose,
      codeHash: hashCode(code),
      metadata,
      expiresAt: new Date(
        Date.now() + purpose === "password-change"
          ? 30 * 1000
          : CODE_TTL_MINUTES * 60 * 1000,
      ),
    },
  });
  return code;
};

const verifyStoredCode = async ({ email, purpose, code, consume = true }) => {
  const record = await prisma.verificationCode.findFirst({
    where: {
      email,
      purpose,
      consumedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.codeHash !== hashCode(code)) {
    return null;
  }

  if (consume) {
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });
  }

  return record;
};

const toUserPayload = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role,
  provider: user?.password
    ? "Email"
    : user?.googleId
      ? "Google"
      : user?.facebookId
        ? "Facebook"
        : "Unidentified",
  avatar: user.avatar || "", // Added to map the Google profile photo to the frontend
  emailVerified: user.emailVerified,
});

exports.googleLogin = asyncHandler(async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    res.status(400);
    throw new Error("Google ID token is required");
  }

  let payload;
  try {
    // ✅ Verify the Access Token by requesting the user profile directly from Google
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    payload = await response.json();
  } catch (error) {
    res.status(401);
    throw new Error("Invalid Google token: " + error.message);
  }
  console.log(payload);
  // Extract relevant fields from the verified Google token
  const { email, name, sub: googleId, picture: googleAvatar } = payload;

  if (!email) {
    res.status(400);
    throw new Error("Email address not provided by Google");
  }

  // 1. Try to find the user by their Google ID first
  let user = await prisma.user.findFirst({
    where: { googleId },
  });

  // 2. If not found by googleId, search by their email address
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // User exists from a traditional signup. Let's link their Google account
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          emailVerified: payload?.email_verified,
          emailVerifiedAt: payload.email_verified
            ? user.emailVerifiedAt || new Date()
            : null,
          // Use Google's avatar if they don't already have one set
          avatar: user.avatar || googleAvatar || null,
        },
      });
    }
  }

  // 3. If the user still does not exist, create a new record
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: name || "Google User",
        email,
        googleId,
        avatar: googleAvatar || null,
        emailVerified: payload.email_verified,
        emailVerifiedAt: new Date(),
        // Prisma will automatically apply the default role: "user"
      },
    });
  }

  // 4. Verify that the user is not blocked
  if (user.role === "blocked") {
    res.status(403);
    throw new Error("Your account has been blocked by an administrator.");
  }

  // 5. Send back the token and user payload
  res.status(200).json({
    user: toUserPayload(user),
    token: generateToken(user.id, user.role),
  });
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.role === "blocked") {
    res.status(403);
    throw new Error("Your account has been blocked by an administrator.");
  }
  const isPasswordEqual = await bcrypt.compare(password, user.password);
  if (!isPasswordEqual) {
    res.status(403);
    throw new Error("Invalid email or password");
  }

  if (!user.emailVerified) {
    const code = await createVerificationCode({
      email: user.email,
      purpose: "registration",
      metadata: { userId: user.id },
    });

    try {
      await sendVerificationCodeEmail({
        to: user.email,
        name: user.name,
        code,
        purpose: "registration",
      });
    } catch (emailErr) {
      console.warn("Failed to send verification email:", emailErr.message);
      throw new Error("Failed to send verification code. Try again");
    }
    res.status(201).json({
      user: toUserPayload(user),
      token: generateToken(user.id, user.role),
      verificationRequired: user.emailVerified === false,
      message: "Verification code sent to your email address",
    });
  } else {
    res.json({
      user: toUserPayload(user),
      token: generateToken(user.id, user.role),
    });
  }
});

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists. Do you wish to login?");
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
    },
  });

  const code = await createVerificationCode({
    email: user.email,
    purpose: "registration",
    metadata: { userId: user.id },
  });

  try {
    await sendVerificationCodeEmail({
      to: user.email,
      name: user.name,
      code,
      purpose: "registration",
    });
  } catch (emailErr) {
    console.warn("Failed to send verification email:", emailErr.message);
  }

  if (user) {
    res.status(201).json({
      user: toUserPayload(user),
      verificationRequired: true,
      message: "Verification code sent to your email address",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (user) {
    res.json({
      user: toUserPayload(user),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

exports.requestVerificationCode = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body;

  if (!email || !purpose) {
    res.status(400);
    throw new Error("Email and purpose are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
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

  res.json({ message: "Verification code sent" });
});

exports.verifyCode = asyncHandler(async (req, res) => {
  const { email, purpose, code } = req.body;

  if (!email || !purpose || !code) {
    res.status(400);
    throw new Error("Email, purpose, and code are required");
  }

  const consume = purpose !== "password-change";
  const record = await verifyStoredCode({ email, purpose, code, consume });
  if (!record) {
    res.status(400);
    throw new Error("Invalid or expired verification code");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (
    purpose === "registration" ||
    purpose === "checkout" ||
    purpose === "email-update"
  ) {
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
    message: "Verification successful",
  };

  if (purpose === "registration" && user) {
    response.token = generateToken(user.id, user.role);
    response.user = toUserPayload({ ...user, emailVerified: true });
  }

  res.json(response);
});

exports.confirmPasswordChange = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    res.status(400);
    throw new Error("Email, code, and new password are required");
  }

  const record = await verifyStoredCode({
    email,
    purpose: "password-change",
    code,
  });
  if (!record) {
    res.status(400);
    throw new Error("Invalid or expired verification code");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  res.json({
    message: "Password updated successfully",
    user: toUserPayload(updatedUser),
  });
});
