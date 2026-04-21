const Course = require('../models/Course');

const getCourses = async (req, res) => {
  const { subject, difficulty } = req.query;
  const filter = {};
  if (subject)    filter.subject    = subject;
  if (difficulty) filter.difficulty = difficulty;
  const courses = await Course.find(filter).sort({ createdAt: -1 });
  res.json(courses);
};

const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
};

const createCourse = async (req, res) => {
  const { title, description, subject, difficulty, duration, tags } = req.body;
  const course = await Course.create({
    title, description, subject, difficulty, duration, tags,
    createdBy: req.user._id,
  });
  res.status(201).json(course);
};

const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  await course.deleteOne();
  res.json({ message: 'Course deleted' });
};

module.exports = { getCourses, getCourseById, createCourse, deleteCourse };