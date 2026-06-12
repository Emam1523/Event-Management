const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification } = require('./notificationController');


exports.processPayment = asyncHandler(async (req, res) => {
  const { bookingId, amount, method, transactionId } = req.body;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.userId !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to pay for this booking');
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

  // Update booking status and fetch event details
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'paid' },
    include: { event: true }
  });

  // Create notification for payment success
  await createNotification(req.user.id, `Payment of ৳${Number(amount).toLocaleString()} was successful for event: ${updatedBooking.event?.title || 'Event'}!`);

  res.status(201).json(payment);
});


exports.getPaymentByBookingId = asyncHandler(async (req, res) => {
  const payment = await prisma.payment.findUnique({
    where: { bookingId: req.params.id },
    include: {
      booking: true
    }
  });

  if (payment) {
    if (payment.booking.userId !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to view this payment');
    }
    res.json(payment);
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});
