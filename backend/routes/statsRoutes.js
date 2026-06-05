const express = require('express');
const router = express.Router();
const { getGlobalStats, getSalesReport } = require('../controllers/statsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getGlobalStats);
router.get('/sales', protect, admin, getSalesReport);

module.exports = router;
