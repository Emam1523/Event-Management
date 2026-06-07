const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  submitAppReview,
  getAppReviews,
  getMyAppReview,
  deleteAppReview,
} = require('../controllers/appReviewController');

router.get('/', getAppReviews);                        // public — home page
router.get('/mine', protect, getMyAppReview);          // user's own review
router.post('/', protect, submitAppReview);            // submit / update
router.delete('/:id', protect, admin, deleteAppReview); // admin delete

module.exports = router;
