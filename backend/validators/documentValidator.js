const Joi = require('joi');

const documentSchema = Joi.object({
  type: Joi.string().valid('citizenship', 'license', 'passport').required(),
  fileUrl: Joi.string().uri().required(), // Placeholder until multer integration
});

const reviewDocumentSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected').required(),
});

module.exports = { documentSchema, reviewDocumentSchema };