const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  getStats, 
  getAllBookings, 
  getAllUsers, 
  getAnalytics,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

module.exports = router;
