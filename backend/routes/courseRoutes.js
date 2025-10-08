const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { createCourse, getCourses, updateCourse, deleteCourse } = require('../controllers/courseController');

const router = express.Router();

router.post('/', protect, admin, createCourse);
router.get('/', getCourses);
router.put('/:id', protect, admin, updateCourse);
router.delete('/:id', protect, admin, deleteCourse);

module.exports = router;