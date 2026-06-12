const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');


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


exports.getEvents = asyncHandler(async (req, res) => {
  const { category, location, search, page = 1, limit = 9 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {};
  if (category && category !== 'All') {
    where.category = category;
  }
  if (location && location !== 'All') {
    where.location = {
      contains: location,
      mode: 'insensitive'
    };
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

exports.getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate UUID if using UUID
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

// Helper to extract city from location string 
const extractCity = (locationStr) => {
  if (!locationStr) return null;
  const parts = locationStr.split(',').map(s => s.trim());
  return parts.length > 1 ? parts[parts.length - 1] : parts[0];
};

// Helper to upsert category and location for filter dropdowns
const upsertFilters = async (category, location) => {
  const operations = [];
  if (category) {
    operations.push(
      prisma.category.upsert({
        where: { name: category },
        update: {},
        create: { name: category }
      })
    );
  }
  const city = extractCity(location);
  if (city) {
    operations.push(
      prisma.location.upsert({
        where: { name: city },
        update: {},
        create: { name: city }
      })
    );
  }
  if (operations.length > 0) {
    await Promise.all(operations);
  }
};


exports.createEvent = asyncHandler(async (req, res) => {
  const { title, description, fullDescription, capacity, category, date, time, location, googleMapUrl, price, image, tickets } = req.body;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      fullDescription,
      capacity: Number(capacity),
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

  // Save category and location to filter tables for dynamic dropdowns
  await upsertFilters(category, location);

  res.status(201).json(event);
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, fullDescription, capacity, category, date, time, endTime, location, googleMapUrl, price, image, tickets } = req.body;

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
      fullDescription,
      capacity: Number(capacity),
      category,
      date,
      time,
      endTime,
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

  // Save category and location to filter tables for dynamic dropdowns
  await upsertFilters(category, location);

  res.json(event);
});


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


exports.getFilters = asyncHandler(async (req, res) => {
  const [categoriesFromDb, locationsFromDb, eventsForCategories] = await Promise.all([
    prisma.category.findMany({ select: { name: true }, orderBy: { name: 'asc' } }),
    prisma.location.findMany({ select: { name: true }, orderBy: { name: 'asc' } }),
    prisma.event.findMany({ select: { category: true }, distinct: ['category'] })
  ]);

  // Combine category names from Category table and unique categories from Event table
  const categoryNames = new Set([
    ...categoriesFromDb.map(c => c.name),
    ...eventsForCategories.map(e => e.category)
  ]);

  // Use locations from Location table (cities are upserted on event create/update)
  const locationNames = locationsFromDb.map(l => l.name);

  res.json({
    success: true,
    categories: Array.from(categoryNames),
    locations: locationNames
  });
});
