const Payment = require('../models/paymentModel');
const Booking = require('../models/bookingModel');
const { paymentSchema } = require('../validators/paymentValidator');

// TODO: Integrate actual eSewa / Khalti / Stripe payment gateway API & webhook verification
const processPayment = async (req, res) => {
  try {
    const { error } = paymentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { bookingId, amount, method, transactionId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const payment = await Payment.create({
      userId: req.user._id,
      bookingId,
      amount,
      method,
      transactionId,
      status: 'paid',
    });

    // Update associated booking payment status
    booking.paymentStatus = 'paid';
    await booking.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('userId bookingId', 'name email');

    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { processPayment, getPaymentStatus };