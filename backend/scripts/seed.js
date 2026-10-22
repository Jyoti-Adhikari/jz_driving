const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/userModel');
const Course = require('../models/courseModel');
const Booking = require('../models/bookingModel');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // Specific seed identifiers to ensure safe reruns without wiping other data
    const seedEmails = [
      'admin@jzdriving.com',
      'john.instructor@jzdriving.com',
      'sarah.instructor@jzdriving.com',
      'alex.learner@gmail.com',
      'maya.student@gmail.com',
    ];

    const seedCourseTitles = [
      'Beginner Driver Training (Manual)',
      'Beginner Driver Training (Automatic)',
      'Defensive Highway Driving',
      'Refresher & Parking Mastery',
    ];

    console.log('Cleaning up existing seed records if present...');

    // 1. Find existing seed users to delete associated seed bookings
    const existingSeedUsers = await User.find({ email: { $in: seedEmails } });
    const seedUserIds = existingSeedUsers.map((u) => u._id);

    if (seedUserIds.length > 0) {
      await Booking.deleteMany({
        $or: [{ userId: { $in: seedUserIds } }, { instructorId: { $in: seedUserIds } }],
      });
    }

    // 2. Delete existing seed courses
    await Course.deleteMany({ title: { $in: seedCourseTitles } });

    // 3. Delete existing seed users
    await User.deleteMany({ email: { $in: seedEmails } });

    console.log('Previous seed records removed cleanly.');

    // Generate password hashes
    const salt = await bcrypt.genSalt(10);
    const adminPassword = 'Admin@1234';
    const instructorPassword = 'Instructor@1234';
    const customerPassword = 'Customer@1234';

    const adminHash = await bcrypt.hash(adminPassword, salt);
    const instructorHash = await bcrypt.hash(instructorPassword, salt);
    const customerHash = await bcrypt.hash(customerPassword, salt);

    console.log('Creating seed users...');

    // 1 Admin
    const admin = await User.create({
      name: 'JZ Admin',
      email: 'admin@jzdriving.com',
      phone: '9800000001',
      password: adminHash,
      role: 'admin',
      address: { city: 'Kathmandu', country: 'Nepal' },
      isApproved: true,
    });

    // 2 Approved Instructors
    const instructor1 = await User.create({
      name: 'John Shrestha',
      email: 'john.instructor@jzdriving.com',
      phone: '9800000002',
      password: instructorHash,
      role: 'instructor',
      address: { city: 'Kathmandu', country: 'Nepal' },
      profile: {
        experience: 7,
        specialization: 'Manual Transmission & Defensive Driving',
        availability: ['Morning', 'Afternoon'],
        rating: 4.8,
        totalReviews: 12,
      },
      isApproved: true,
    });

    const instructor2 = await User.create({
      name: 'Sarah Thapa',
      email: 'sarah.instructor@jzdriving.com',
      phone: '9800000003',
      password: instructorHash,
      role: 'instructor',
      address: { city: 'Lalitpur', country: 'Nepal' },
      profile: {
        experience: 5,
        specialization: 'Automatic Transmission & City Driving',
        availability: ['Afternoon', 'Evening'],
        rating: 4.9,
        totalReviews: 18,
      },
      isApproved: true,
    });

    // 2 Customers
    const customer1 = await User.create({
      name: 'Alex Sharma',
      email: 'alex.learner@gmail.com',
      phone: '9800000004',
      password: customerHash,
      role: 'customer',
      address: { city: 'Kathmandu', country: 'Nepal' },
      isApproved: true,
    });

    const customer2 = await User.create({
      name: 'Maya Gurung',
      email: 'maya.student@gmail.com',
      phone: '9800000005',
      password: customerHash,
      role: 'customer',
      address: { city: 'Bhaktapur', country: 'Nepal' },
      isApproved: true,
    });

    console.log('Creating 4 driving courses...');

    // 4 Courses
    const course1 = await Course.create({
      title: 'Beginner Driver Training (Manual)',
      description: 'Comprehensive 15-day course covering clutch control, maneuvers, traffic laws, and uphill starts.',
      durationHours: 20,
      price: 12000,
      instructorId: instructor1._id,
      status: 'active',
    });

    const course2 = await Course.create({
      title: 'Beginner Driver Training (Automatic)',
      description: 'Smooth automatic vehicle training focusing on steering control, city driving, and parking precision.',
      durationHours: 18,
      price: 14000,
      instructorId: instructor2._id,
      status: 'active',
    });

    const course3 = await Course.create({
      title: 'Defensive Highway Driving',
      description: 'Advanced highway safety, lane discipline, overtaking techniques, and adverse weather driving.',
      durationHours: 10,
      price: 8000,
      instructorId: instructor1._id,
      status: 'active',
    });

    const course4 = await Course.create({
      title: 'Refresher & Parking Mastery',
      description: 'Specialized parking module including parallel, reverse 90-degree, and tight-space maneuvering.',
      durationHours: 8,
      price: 6500,
      instructorId: instructor2._id,
      status: 'active',
    });

    console.log('Creating 3 sample bookings...');

    // 3 Bookings
    const booking1 = await Booking.create({
      userId: customer1._id,
      courseId: course1._id,
      instructorId: instructor1._id,
      schedule: {
        date: new Date('2026-11-01'),
        timeSlot: '07:00 AM - 08:30 AM',
      },
      status: 'confirmed',
      paymentStatus: 'paid',
    });

    const booking2 = await Booking.create({
      userId: customer2._id,
      courseId: course2._id,
      instructorId: instructor2._id,
      schedule: {
        date: new Date('2026-11-02'),
        timeSlot: '02:00 PM - 03:30 PM',
      },
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    const booking3 = await Booking.create({
      userId: customer1._id,
      courseId: course3._id,
      instructorId: instructor1._id,
      schedule: {
        date: new Date('2026-11-05'),
        timeSlot: '10:00 AM - 11:30 AM',
      },
      status: 'completed',
      paymentStatus: 'paid',
    });

    console.log('\n======================================================');
    console.log('JZ Driving - Seed Data Created Successfully!');
    console.log('======================================================');
    console.log('Role        | Email                          | Password');
    console.log('------------------------------------------------------');
    console.log(`Admin       | ${admin.email.padEnd(30)} | ${adminPassword}`);
    console.log(`Instructor  | ${instructor1.email.padEnd(30)} | ${instructorPassword}`);
    console.log(`Instructor  | ${instructor2.email.padEnd(30)} | ${instructorPassword}`);
    console.log(`Customer    | ${customer1.email.padEnd(30)} | ${customerPassword}`);
    console.log(`Customer    | ${customer2.email.padEnd(30)} | ${customerPassword}`);
    console.log('======================================================');
    console.log(`Summary: 5 Users (1 Admin, 2 Instructors, 2 Customers), 4 Courses, 3 Bookings.`);
    console.log('======================================================\n');

    await mongoose.connection.close();
    console.log('Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Error running seed script:', error.message);
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedDatabase();
