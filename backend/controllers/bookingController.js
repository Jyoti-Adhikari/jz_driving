const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');
const sendNotification = require('../utils/sendNotification');
const { bookingSchema, updateBookingStatusSchema } = require('../validators/bookingValidator');

const createBooking = async (req, res) => {
  try {
    const { error } = bookingSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { courseId, instructorId, schedule } = req.body;

    const booking = await Booking.create({
      userId: req.user._id,
      courseId,
      instructorId,
      schedule,
    });

    // Send notification to the user
    await sendNotification(req.user._id, `Your booking for course ${courseId} on ${schedule.date} has been created.`, 'booking');

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? {} 
      : (req.user.role === 'instructor' ? { instructorId: req.user._id } : { userId: req.user._id });
    const bookings = await Booking.find(query)
      .populate('courseId', 'title')
      .populate('instructorId', 'name email')
      .populate('userId', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const { error } = updateBookingStatusSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isAssignedInstructor = booking.instructorId && booking.instructorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAssignedInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Only assigned instructor or admin can update booking status' });
    }

    booking.status = req.body.status || booking.status;
    const updatedBooking = await booking.save();

    // Send notification based on status change
    await sendNotification(booking.userId, `Your booking status has been updated to ${booking.status}.`, 'booking');

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isOwner = booking.userId && booking.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Only booking owner or admin can cancel booking' });
    }

    booking.status = 'cancelled';
    const updatedBooking = await booking.save();

    // Send cancellation notification
    await sendNotification(booking.userId, `Your booking for course ${booking.courseId} has been cancelled.`, 'booking');

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus, cancelBooking };