const Course = require('../models/courseModel').default;

const createCourse = async (req, res) => {
  const { title, description, durationHours, price, instructorId } = req.body;

  const course = await Course.create({
    title,
    description,
    durationHours,
    price,
    instructorId,
  });

  if (course) {
    res.status(201).json(course);
  } else {
    res.status(400).json({ message: 'Invalid course data' });
  }
};

const getCourses = async (req, res) => {
  const courses = await Course.find().populate('instructorId', 'name email');
  res.json(courses);
};

const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.durationHours = req.body.durationHours || course.durationHours;
    course.price = req.body.price || course.price;
    course.instructorId = req.body.instructorId || course.instructorId;
    course.status = req.body.status || course.status;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
};

const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    await course.remove();
    res.json({ message: 'Course removed' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
};

module.exports = { createCourse, getCourses, updateCourse, deleteCourse };