const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { processPayment, getPaymentStatus } = require('../controllers/paymentController');

const router = express.Router();

router.post('/', protect, processPayment);
router.get('/:id', protect, getPaymentStatus);

module.exports = router;