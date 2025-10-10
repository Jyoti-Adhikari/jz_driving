const Joi = require('joi');

const paymentSchema = Joi.object({
  bookingId: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  method: Joi.string().valid('stripe', 'cash', 'esewa').required(),
  transactionId: Joi.string().required(),
});

module.exports = { paymentSchema };