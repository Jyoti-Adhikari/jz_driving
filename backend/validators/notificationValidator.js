const Joi = require('joi');

const notificationSchema = Joi.object({
  userId: Joi.string().required(),
  message: Joi.string().required(),
  type: Joi.string().valid('booking', 'payment', 'review').required(),
  isRead: Joi.boolean().optional(),
});

module.exports = { notificationSchema };