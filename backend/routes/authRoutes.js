const express = require('express');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, updateProfile, approveInstructor } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many authentication attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.put('/profile', protect, updateProfile);
router.put('/approve-instructor/:id', protect, admin, approveInstructor);

module.exports = router;
