const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { processPayment, getPaymentByBookingId, initiateAmarPay, amarPayIPN } = require('../controllers/paymentController');

router.post('/', protect, processPayment);
router.post('/amar-pay/initiate', protect, initiateAmarPay);
router.post('/amar-pay/ipn', amarPayIPN);
router.get('/booking/:id', protect, getPaymentByBookingId);

module.exports = router;
