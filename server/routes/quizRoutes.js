const express = require('express');
const router  = express.Router();
const { getQuestions, submitQuiz, getMyResults } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.get('/results/me',       protect, getMyResults);
router.get('/:subject',         protect, getQuestions);
router.post('/:subject/submit', protect, submitQuiz);

module.exports = router;