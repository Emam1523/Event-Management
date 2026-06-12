const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  getStats, 
  getAllBookings, 
  getAllUsers, 
  getAnalytics,
  updateUserRole,
  deleteUser,
  getCategories,
  createCategory,
  deleteCategory,
  getLocations,
  createLocation,
  deleteLocation
} = require('../controllers/adminController');

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

// Category management
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

// Location management
router.get('/locations', getLocations);
router.post('/locations', createLocation);
router.delete('/locations/:id', deleteLocation);

module.exports = router;
