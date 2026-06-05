const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getMe, requestVerificationCode, verifyCode, confirmPasswordChange } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/request-code', requestVerificationCode);
router.post('/verify-code', verifyCode);
router.post('/confirm-password-change', protect, confirmPasswordChange);
router.get('/me', protect, getMe);

module.exports = router;
