const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true }
});

const profileSchema = new mongoose.Schema({
  experience: { type: Number }, // Only for instructors
  specialization: { type: String },
  availability: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'instructor', 'admin'], required: true },
  phone: { type: String, required: true, unique: true },
  address: addressSchema,
  profile: profileSchema,
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);