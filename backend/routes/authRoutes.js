const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// Add more routes as needed (e.g., verifyEmail, approveInstructor)
router.put('/approve-instructor/:id', protect, admin, (req, res) => res.send('Approve instructor')); // Placeholder

module.exports = router;