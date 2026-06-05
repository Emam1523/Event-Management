const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getUsers, updateUserProfile } = require('../controllers/userController');

router.get('/', protect, admin, getUsers);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
