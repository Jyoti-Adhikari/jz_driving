const Joi = require('joi');

const reviewSchema = Joi.object({
  instructorId: Joi.string().required(),
  courseId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(500).optional(),
});

module.exports = { reviewSchema };