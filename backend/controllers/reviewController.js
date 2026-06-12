const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');


exports.addReview = asyncHandler(async (req, res) => {
  const { eventId, rating, comment } = req.body;

  const review = await prisma.review.create({
    data: {
      userId: req.user.id,
      eventId,
      rating: Number(rating),
      comment
    }
  });

  res.status(201).json(review);
});


exports.getEventReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { eventId: req.params.id },
    include: {
      user: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json(reviews);
});


exports.updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.userId !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedReview = await prisma.review.update({
    where: { id: req.params.id },
    data: { rating: Number(rating), comment }
  });

  res.json(updatedReview);
});


exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.userId !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
  }

  await prisma.review.delete({ where: { id: req.params.id } });

  res.json({ message: 'Review removed' });
});
