const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Process payment
// @route   POST /api/payments
// @access  Private
exports.processPayment = asyncHandler(async (req, res) => {
  const { bookingId, amount, method, transactionId } = req.body;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const payment = await prisma.payment.create({
    data: {
      bookingId,
      amount: Number(amount),
      method,
      transactionId,
      status: 'completed'
    }
  });

  // Update booking status
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'paid' }
  });

  res.status(201).json(payment);
});

// @desc    Get payment by booking ID
// @route   GET /api/payments/booking/:id
// @access  Private
exports.getPaymentByBookingId = asyncHandler(async (req, res) => {
  const payment = await prisma.payment.findUnique({
    where: { bookingId: req.params.id }
  });

  if (payment) {
    res.json(payment);
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});
