const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification } = require('./notificationController');
const amarPayService = require('../services/amarPayService');


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


exports.initiateAmarPay = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { event: true }
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.userId !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to pay for this booking');
  }

  if (booking.status === 'paid') {
    res.status(400);
    throw new Error('Booking is already paid');
  }

  const serviceCharge = booking.event.serviceCharge || 0;
  const serviceFee = Math.round(booking.totalPrice * (serviceCharge / 100));
  const totalAmount = booking.totalPrice + serviceFee;

  const result = await amarPayService.initiatePayment({
    amount: totalAmount,
    orderId: `BK-${booking.id}-${Date.now()}`,
    customerName: req.user.name,
    customerEmail: req.user.email,
    customerPhone: req.user.phone || '01XXXXXXXXX',
  });

  if (result.success) {
    // Save pending payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: totalAmount,
        method: 'amarPay',
        transactionId: result.transactionId,
        status: 'pending',
      }
    });

    res.json({
      success: true,
      paymentUrl: result.paymentUrl,
      transactionId: result.transactionId,
      totalAmount,
      serviceFee,
    });
  } else {
    res.status(400);
    throw new Error(result.message || 'Failed to initiate amarPay payment');
  }
});


exports.amarPayIPN = asyncHandler(async (req, res) => {
  const transactionId = req.body.tran_id;

  if (!transactionId) {
    return res.status(400).send('Invalid IPN request');
  }

  const payment = await prisma.payment.findFirst({
    where: { transactionId },
    include: { booking: true }
  });

  if (!payment) {
    return res.status(404).send('Payment not found');
  }

  if (payment.status === 'completed') {
    return res.status(200).send('Already processed');
  }

  const verification = await amarPayService.verifyPayment(transactionId);

  if (verification.verified) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        method: 'amarPay',
      },
    });

    const updatedBooking = await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'paid' },
      include: { event: true }
    });

    await createNotification(
      payment.booking.userId,
      `Payment of ৳${Number(payment.amount).toLocaleString()} was successful for event: ${updatedBooking.event?.title || 'Event'}!`
    );
  }

  res.status(200).send('IPN received');
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
