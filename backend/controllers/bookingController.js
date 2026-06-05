const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res) => {
  const { eventId, ticketType, quantity, totalPrice } = req.body;

  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Update ticket count
  await prisma.ticketType.updateMany({
    where: {
      eventId,
      name: ticketType
    },
    data: {
      sold: {
        increment: Number(quantity)
      }
    }
  });

  const booking = await prisma.booking.create({
    data: {
      userId: req.user.id,
      eventId,
      ticketType,
      quantity: Number(quantity),
      totalPrice: Number(totalPrice),
      status: 'confirmed'
    },
    include: {
      event: true
    }
  });

  res.status(201).json(booking);
});

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id },
    include: {
      event: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json(bookings);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: {
      event: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (booking && (booking.userId === req.user.id || req.user.role === 'admin')) {
    res.json(booking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id }
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.userId !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to cancel this booking');
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: 'cancelled' }
  });

  res.json(updatedBooking);
});
