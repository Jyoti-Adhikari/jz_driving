const express = require('express');
const { registerUser, loginUser, updateProfile } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateProfile); // New route for updating user profile
router.put('/approve-instructor/:id', protect, admin, (req, res) => res.send('Approve instructor')); // Placeholder

module.exports = router;
