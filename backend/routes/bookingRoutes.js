const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createBooking, 
  getMyBookings, 
  getBookingById,
  cancelBooking 
} = require('../controllers/bookingController');

router.use(protect);

router.get('/my-bookings', getMyBookings);
router.post('/', createBooking);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
