const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

exports.getGlobalStats = asyncHandler(async (req, res) => {
  const totalUsers = await prisma.user.count();

  const bookings = await prisma.booking.aggregate({
    where: { status: { in: ['confirmed', 'paid'] } },
    _sum: { quantity: true }
  });
  const ticketsSold = bookings._sum.quantity || 0;

  const totalCities = await prisma.location.count();

  const reviewStats = await prisma.review.aggregate({
    _avg: { rating: true },
    _count: true
  });

  const averageRating = reviewStats._avg.rating ? parseFloat(reviewStats._avg.rating.toFixed(1)) : 0;
  const totalReviews = reviewStats._count;

  res.json({
    success: true,
    data: {
      totalUsers,
      ticketsSold,
      totalCities,
      rating: averageRating,
      totalReviews
    }
  });
});

exports.getSalesReport = asyncHandler(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { status: { in: ['confirmed', 'paid'] } },
    select: {
      createdAt: true,
      totalPrice: true,
      quantity: true
    },
    orderBy: { createdAt: 'asc' }
  });

  const daily = {};
  const weekly = {};
  const monthly = {};

  bookings.forEach(b => {
    const d = new Date(b.createdAt);
    
    // Daily: YYYY-MM-DD
    const dateKey = d.toISOString().split('T')[0];
    daily[dateKey] = (daily[dateKey] || 0) + Number(b.totalPrice);

    // Monthly: YYYY-MM
    const monthKey = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    monthly[monthKey] = (monthly[monthKey] || 0) + Number(b.totalPrice);

    // Weekly (Simple week check)
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    const weekKey = `W${weekNumber} '${d.getFullYear().toString().slice(-2)}`;
    weekly[weekKey] = (weekly[weekKey] || 0) + Number(b.totalPrice);
  });

  const formatData = (obj) => Object.keys(obj).map(key => ({ name: key, sales: obj[key] }));

  res.json({
    success: true,
    data: {
      daily: formatData(daily).slice(-14), 
      weekly: formatData(weekly).slice(-8), 
      monthly: formatData(monthly).slice(-12) 
    }
  });
});
