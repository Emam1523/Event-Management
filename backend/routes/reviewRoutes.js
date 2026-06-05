const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  addReview, 
  getEventReviews,
  updateReview,
  deleteReview 
} = require('../controllers/reviewController');

router.post('/', protect, addReview);
router.get('/event/:id', getEventReviews);
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
