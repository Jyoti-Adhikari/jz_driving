const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { submitReview, getReviews } = require('../controllers/reviewController');

const router = express.Router();

router.post('/', protect, submitReview);
router.get('/instructor/:id', protect, getReviews); // Get reviews for an instructor

module.exports = router;