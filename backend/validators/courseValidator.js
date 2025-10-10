const Joi = require('joi');

const courseSchema = Joi.object({
  title: Joi.string().required().min(2).max(100),
  description: Joi.string().required().max(500),
  durationHours: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  instructorId: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive', 'draft').optional(),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional(),
  durationHours: Joi.number().integer().min(1).optional(),
  price: Joi.number().min(0).optional(),
  instructorId: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'draft').optional(),
}).min(1); // Ensure at least one field is provided

module.exports = { courseSchema, updateCourseSchema };