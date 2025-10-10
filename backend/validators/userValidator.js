const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be 10 digits',
  }),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('customer', 'instructor', 'admin').required(),
  address: Joi.object({
    city: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  profile: Joi.object({
    experience: Joi.number().optional().min(0),
    specialization: Joi.string().optional(),
    availability: Joi.array().items(Joi.string()).optional(),
  }).when('role', { is: 'instructor', then: Joi.required() }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
    'string.pattern.base': 'Phone number must be 10 digits',
  }),
  address: Joi.object({
    city: Joi.string().optional(),
    country: Joi.string().optional(),
  }).optional(),
  profile: Joi.object({
    experience: Joi.number().min(0).optional(),
    specialization: Joi.string().optional(),
    availability: Joi.array().items(Joi.string()).optional(),
  }).when(Joi.ref('role'), { is: 'instructor', then: Joi.required() }).optional(),
}).min(1); // Ensure at least one field is provided

module.exports = { registerSchema, loginSchema, updateProfileSchema };