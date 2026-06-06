const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
exports.getFeaturedEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    take: 6,
    include: {
      tickets: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json(events);
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 9 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {};
  if (category && category !== 'All') {
    where.category = category;
  }
  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive'
        }
      },
      {
        description: {
          contains: search,
          mode: 'insensitive'
        }
      },
      {
        category: {
          contains: search,
          mode: 'insensitive'
        }
      },
      {
        location: {
          contains: search,
          mode: 'insensitive'
        }
      }
    ];
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take,
      include: {
        tickets: true
      },
      orderBy: {
        date: 'asc'
      }
    }),
    prisma.event.count({ where })
  ]);

  res.json({
    success: true,
    events,
    total,
    page: Number(page),
    pages: Math.ceil(total / take)
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate UUID if using UUIDs (to avoid 500 errors on invalid IDs like 'featured')
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    res.status(400);
    throw new Error('Invalid Event ID format');
  }

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      tickets: true,
      organizer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = asyncHandler(async (req, res) => {
  const { title, description, category, date, time, location, googleMapUrl, price, image, tickets } = req.body;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      category,
      date,
      time,
      location,
      googleMapUrl,
      price: Number(price),
      image,
      organizerId: req.user.id,
      tickets: {
        create: tickets || []
      }
    },
    include: {
      tickets: true
    }
  });

  res.status(201).json(event);
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, category, date, time, location, googleMapUrl, price, image, tickets } = req.body;

  let event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Update event and handle nested tickets
  event = await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      category,
      date,
      time,
      location,
      googleMapUrl,
      price: Number(price),
      image,
      tickets: {
        deleteMany: {}, // Simplest way is to replace tickets
        create: tickets || []
      }
    },
    include: {
      tickets: true
    }
  });

  res.json(event);
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  await prisma.event.delete({ where: { id } });

  res.json({ message: 'Event removed' });
});
