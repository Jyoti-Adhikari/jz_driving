const Joi = require('joi');

const bookingSchema = Joi.object({
  courseId: Joi.string().required(),
  instructorId: Joi.string().required(),
  schedule: Joi.object({
    date: Joi.date().required(),
    timeSlot: Joi.string().required(),
  }).required(),
});

const updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').required(),
});

module.exports = { bookingSchema, updateBookingStatusSchema };