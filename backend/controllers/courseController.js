const Course = require('../models/courseModel');
const { courseSchema, updateCourseSchema } = require('../validators/courseValidator');

const createCourse = async (req, res) => {
  try {
    const { error } = courseSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, durationHours, price, instructorId } = req.body;

    const course = await Course.create({
      title,
      description,
      durationHours,
      price,
      instructorId,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructorId', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { error } = updateCourseSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.durationHours = req.body.durationHours || course.durationHours;
    course.price = req.body.price || course.price;
    course.instructorId = req.body.instructorId || course.instructorId;
    course.status = req.body.status || course.status;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.remove();
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createCourse, getCourses, updateCourse, deleteCourse };