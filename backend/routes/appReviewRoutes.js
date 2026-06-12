const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  submitAppReview,
  getAppReviews,
  getMyAppReview,
  deleteAppReview,
} = require('../controllers/appReviewController');

router.get('/', getAppReviews);                        
router.get('/mine', protect, getMyAppReview);          
router.post('/', protect, submitAppReview);            
router.delete('/:id', protect, admin, deleteAppReview);

module.exports = router;
