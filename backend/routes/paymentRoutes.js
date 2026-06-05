const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { processPayment, getPaymentByBookingId } = require('../controllers/paymentController');

router.post('/', protect, processPayment);
router.get('/booking/:id', protect, getPaymentByBookingId);

module.exports = router;
