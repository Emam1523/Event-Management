const prisma = require('../config/prisma');

// POST /api/app-reviews — Submit or update a review
const submitAppReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({ message: 'Comment must be at least 5 characters.' });
    }

    // Upsert — one review per user
    const existing = await prisma.appReview.findFirst({ where: { userId } });

    let review;
    if (existing) {
      review = await prisma.appReview.update({
        where: { id: existing.id },
        data: { rating: Number(rating), comment: comment.trim() },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      });
    } else {
      review = await prisma.appReview.create({
        data: { userId, rating: Number(rating), comment: comment.trim() },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      });
    }

    res.status(200).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit review.' });
  }
};

// GET /api/app-reviews — Get all approved reviews (public, for home page)
const getAppReviews = async (req, res) => {
  try {
    const reviews = await prisma.appReview.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews.' });
  }
};

// GET /api/app-reviews/mine — Get current user's review
const getMyAppReview = async (req, res) => {
  try {
    const review = await prisma.appReview.findFirst({
      where: { userId: req.user.id },
    });
    res.json(review || null);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your review.' });
  }
};

// DELETE /api/app-reviews/:id — Admin can delete a review
const deleteAppReview = async (req, res) => {
  try {
    await prisma.appReview.delete({ where: { id: req.params.id } });
    res.json({ message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review.' });
  }
};

module.exports = { submitAppReview, getAppReviews, getMyAppReview, deleteAppReview };
