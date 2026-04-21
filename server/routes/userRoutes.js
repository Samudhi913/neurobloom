const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const User       = require('../models/User');
const QuizResult = require('../models/QuizResult');

// @GET /api/users/students — teacher sees all students
router.get('/students', protect, authorize('teacher'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    const studentsWithStats = await Promise.all(
      students.map(async (s) => {
        const results = await QuizResult.find({ student: s._id });
        const avgScore = results.length
          ? Math.round(results.reduce((a, b) => a + b.score, 0) / results.length)
          : null;
        const lastQuiz = results.length
          ? results.sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt))[0]
          : null;
        return { ...s.toObject(), totalQuizzes: results.length, avgScore, lastQuiz };
      })
    );
    res.json(studentsWithStats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @GET /api/users/student/:id/results — parent or teacher sees a student's results
router.get('/student/:id/results', protect, authorize('parent', 'teacher'), async (req, res) => {
  try {
    const results = await QuizResult.find({ student: req.params.id }).sort({ takenAt: -1 });
    const student = await User.findById(req.params.id).select('-password');
    res.json({ student, results });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @GET /api/users/my-stats — student sees their own stats
router.get('/my-stats', protect, authorize('student'), async (req, res) => {
  try {
    const results = await QuizResult.find({ student: req.user._id }).sort({ takenAt: -1 });
    const totalQuizzes = results.length;
    const avgScore     = totalQuizzes
      ? Math.round(results.reduce((a, b) => a + b.score, 0) / totalQuizzes)
      : 0;
    const lastActivity = totalQuizzes ? results[0].takenAt : null;
    const lastRecommendation = totalQuizzes ? results[0].recommendedDifficulty : null;
    res.json({ totalQuizzes, avgScore, lastActivity, lastRecommendation, recentResults: results.slice(0, 5) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;