const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification } = require('./notificationController');


exports.createBooking = asyncHandler(async (req, res) => {
  if (req.user.role === 'admin') {
    res.status(403);
    throw new Error('Admins are not allowed to buy tickets');
  }

  const { eventId, ticketType, quantity, totalPrice } = req.body;

  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Find the ticket type and check capacity
  const ticket = await prisma.ticketType.findFirst({
    where: {
      eventId,
      name: ticketType
    }
  });

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket type not found for this event');
  }

  if (ticket.sold + Number(quantity) > ticket.capacity) {
    res.status(400);
    throw new Error(`Not enough tickets available. Only ${ticket.capacity - ticket.sold} remaining.`);
  }

  // Update ticket count
  await prisma.ticketType.update({
    where: { id: ticket.id },
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

  await createNotification(req.user.id, `Ticket booking confirmed for event: ${event.title}! Enjoy the experience!`);

  res.status(201).json(booking);
});


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

  if (booking.status === 'cancelled') {
    res.status(400);
    throw new Error('Booking is already cancelled');
  }

  // Release tickets by decrementing sold count on the TicketType
  const ticket = await prisma.ticketType.findFirst({
    where: {
      eventId: booking.eventId,
      name: booking.ticketType
    }
  });

  if (ticket) {
    await prisma.ticketType.update({
      where: { id: ticket.id },
      data: {
        sold: {
          decrement: Math.min(booking.quantity, ticket.sold)
        }
      }
    });
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: 'cancelled' },
    include: { event: true }
  });

  await createNotification(booking.userId, `Your booking for event: ${updatedBooking.event?.title || 'Event'} has been successfully cancelled.`);

  res.json(updatedBooking);
});
