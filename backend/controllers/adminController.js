const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

exports.getStats = asyncHandler(async (req, res) => {
  const [userCount, eventCount, bookingCount, totalRevenue, recentBookings] =
    await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: {
          totalPrice: true,
        },
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
          event: { select: { title: true } },
        },
      }),
    ]);

  res.json({
    users: userCount,
    events: eventCount,
    bookings: bookingCount,
    revenue: totalRevenue._sum.totalPrice || 0,
    recentBookings: recentBookings.map((b) => ({
      id: b.id,
      user: b.user?.name || "Guest",
      event: b.event?.title || "Unknown Event",
      totalPrice: b.totalPrice,
      status: b.status,
    })),
  });
});

exports.getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    include: {
      event: { select: { title: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = bookings.map((b) => ({
    id: b.id,
    userName: b.user?.name || "Unknown",
    userEmail: b.user?.email || "Unknown",
    eventTitle: b.event?.title || "Unknown",
    totalAmount: b.totalPrice,
    status: b.status,
    createdAt: b.createdAt,
  }));

  res.json({ data: formatted });
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      googleId: true,
      facebookId: true,
    },
  });
  const mappedUsers = users.map((u) => ({
    ...u,
    provider:
      !u.googleId && !u.facebookId
        ? "Email"
        : u?.googleId
          ? "Google"
          : u?.facebookId
            ? "Facebook"
            : "Unidentified",
  }));

  res.json({ data: mappedUsers });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (role === "admin") {
    res.status(400);
    throw new Error("Cannot promote user to admin role");
  }
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
  });
  res.json(user);
});

exports.deleteUser = asyncHandler(async (req, res) => {
  await prisma.user.delete({
    where: { id: req.params.id },
  });
  res.json({ message: "User removed" });
});

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  res.json({ success: true, data: categories });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await prisma.category.upsert({
    where: { name },
    update: { description },
    create: { name, description },
  });
  res.status(201).json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: "Category deleted" });
});

exports.getLocations = asyncHandler(async (req, res) => {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });
  res.json({ success: true, data: locations });
});

exports.createLocation = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const location = await prisma.location.upsert({
    where: { name },
    update: {},
    create: { name },
  });
  res.status(201).json({ success: true, data: location });
});

exports.deleteLocation = asyncHandler(async (req, res) => {
  await prisma.location.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: "Location deleted" });
});

exports.getAnalytics = asyncHandler(async (req, res) => {
  try {
    const { timeframe = "month" } = req.query;

    const bookings = await prisma.booking.findMany({
      where: { status: { in: ["confirmed", "paid"] } },
      select: {
        createdAt: true,
        totalPrice: true,
        quantity: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const daily = {};
    const monthly = {};

    bookings.forEach((b) => {
      if (!b.createdAt) return;
      const d = new Date(b.createdAt);

      // Daily format
      const dateKey = d.toISOString().split("T")[0];
      if (!daily[dateKey]) daily[dateKey] = { revenue: 0, tickets: 0 };
      daily[dateKey].revenue += Number(b.totalPrice || 0);
      daily[dateKey].tickets += b.quantity || 0;

      // Monthly format
      const monthKey = d.toLocaleString("en-US", {
        month: "short",
        year: "2-digit",
      });
      if (!monthly[monthKey]) monthly[monthKey] = { revenue: 0, tickets: 0 };
      monthly[monthKey].revenue += Number(b.totalPrice || 0);
      monthly[monthKey].tickets += b.quantity || 0;
    });

    let revenueData = [];
    if (timeframe === "month") {
      revenueData = Object.keys(monthly).map((key) => ({
        name: key,
        revenue: monthly[key].revenue,
        tickets: monthly[key].tickets,
      }));
    } else {
      revenueData = Object.keys(daily)
        .map((key) => ({
          name: key.split("-").slice(1).join("/"),
          revenue: daily[key].revenue,
          tickets: daily[key].tickets,
        }))
        .slice(-14);
    }

    const topEvents = await prisma.event.findMany({
      take: 5,
      include: {
        _count: { select: { bookings: true } },
        bookings: {
          where: { status: { in: ["confirmed", "paid"] } },
          select: { totalPrice: true, quantity: true },
        },
      },
    });

    const processedTopEvents = topEvents
      .map((e, index) => {
        const eventRevenue = (e.bookings || []).reduce(
          (sum, b) => sum + Number(b.totalPrice || 0),
          0,
        );
        const eventTickets = (e.bookings || []).reduce(
          (sum, b) => sum + (b.quantity || 0),
          0,
        );
        const colors = [
          "bg-brand-orange",
          "bg-blue-500",
          "bg-purple-500",
          "bg-emerald-500",
          "bg-rose-500",
        ];

        return {
          name: e.title,
          bookings: eventTickets,
          category: e.category,
          revenue: eventRevenue,
          color: colors[index % colors.length],
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    const userCount = await prisma.user.count();
    const eventCount = await prisma.event.count();
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + Number(b.totalPrice || 0),
      0,
    );
    const totalTickets = bookings.reduce(
      (sum, b) => sum + (b.quantity || 0),
      0,
    );

    res.json({
      stats: {
        revenue: { current: totalRevenue, growth: 0 },
        bookings: { current: totalTickets, growth: 0 },
        customers: { current: userCount, growth: 0 },
        events: { current: eventCount, growth: 0 },
      },
      revenueData,
      topEvents: processedTopEvents,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
