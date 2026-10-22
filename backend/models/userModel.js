const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
});

const profileSchema = new mongoose.Schema({
  experience: { type: Number, min: 0, default: 0 }, // Align with Joi min: 0
  specialization: { type: String },
  availability: [{ type: String }],
  rating: { type: Number, default: 0 }, // Optional, for instructors
  totalReviews: { type: Number, default: 0 }, // Optional, for instructors
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'instructor', 'admin'], required: true },
  phone: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ }, // Align with Joi pattern
  address: { type: addressSchema, required: true },
  profile: { type: profileSchema, required: function() { return this.role === 'instructor'; } },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  isApproved: { type: Boolean, default: function() { return this.role !== 'instructor'; } },
}, {
  timestamps: true, // Handles createdAt and updatedAt automatically
});

// Automatically strip password from JSON responses
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

// Optional: Add pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);