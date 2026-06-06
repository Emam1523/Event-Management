const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  getFeaturedEvents,
  updateEvent,
  deleteEvent,
  getFilters
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedEvents);
router.get('/filters', getFilters);

router.route('/')
  .get(getEvents)
  .post(protect, admin, createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

module.exports = router;
