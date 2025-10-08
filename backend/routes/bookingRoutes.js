const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createBooking, getBookings, updateBookingStatus, cancelBooking } = require('../controllers/bookingController');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.put('/:id/status', protect, updateBookingStatus); // For admin/instructor confirmation
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;