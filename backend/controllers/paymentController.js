const Payment = require('../models/paymentModel');

const processPayment = async (req, res) => {
  const { bookingId, amount, method, transactionId } = req.body;

  const payment = await Payment.create({
    userId: req.user._id,
    bookingId,
    amount,
    method,
    transactionId,
    status: 'paid',
  });

  if (payment) {
    res.status(201).json(payment);
  } else {
    res.status(400).json({ message: 'Invalid payment data' });
  }
};

const getPaymentStatus = async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('userId bookingId', 'name email');

  if (payment) {
    res.json(payment);
  } else {
    res.status(404).json({ message: 'Payment not found' });
  }
};

module.exports = { processPayment, getPaymentStatus };