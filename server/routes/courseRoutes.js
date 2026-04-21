const express = require('express');
const router  = express.Router();
const { getCourses, getCourseById, createCourse, deleteCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/',       getCourses);
router.get('/:id',    getCourseById);
router.post('/',      protect, authorize('teacher'), createCourse);
router.delete('/:id', protect, authorize('teacher'), deleteCourse);

module.exports = router;