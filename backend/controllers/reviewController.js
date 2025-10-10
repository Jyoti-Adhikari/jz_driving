const Review = require('../models/reviewModel');
const { reviewSchema } = require('../validators/reviewValidator');

const submitReview = async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { instructorId, courseId, rating, comment } = req.body;

    const review = await Review.create({
      userId: req.user._id,
      instructorId,
      courseId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ instructorId: req.params.id }).populate('userId', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { submitReview, getReviews };