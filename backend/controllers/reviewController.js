const Review = require('../models/reviewModel');

const submitReview = async (req, res) => {
  const { instructorId, courseId, rating, comment } = req.body;

  const review = await Review.create({
    userId: req.user._id,
    instructorId,
    courseId,
    rating,
    comment,
  });

  if (review) {
    res.status(201).json(review);
  } else {
    res.status(400).json({ message: 'Invalid review data' });
  }
};

const getReviews = async (req, res) => {
  const reviews = await Review.find({ instructorId: req.params.id }).populate('userId', 'name');
  res.json(reviews);
};

module.exports = { submitReview, getReviews };