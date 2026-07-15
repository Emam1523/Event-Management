const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  getMe,
  requestVerificationCode,
  verifyCode,
  confirmPasswordChange,
  googleLogin,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/login-with-google", googleLogin);
router.post("/request-code", requestVerificationCode);
router.post("/verify-code", verifyCode);
router.post("/confirm-password-change", confirmPasswordChange);
router.get("/me", protect, getMe);

module.exports = router;
