const express   = require('express');
const router    = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { predict } = require('../ml/recommend');
const User        = require('../models/User');
const QuizResult  = require('../models/QuizResult');

// @POST /api/recommend
router.post('/', protect, async (req, res) => {
  const { knowledgeScore, readiness, subject } = req.body;

  try {
    // Get student's learning profile
    const student = await User.findById(req.user._id);
    const learningProfile = student?.learningProfile || 'None';

    // Get past performance for this subject
    const pastResults = await QuizResult.find({
      student: req.user._id,
      subject,
    }).sort({ takenAt: -1 }).limit(5);

    const pastAvg = pastResults.length
      ? Math.round(pastResults.reduce((a, b) => a + b.score, 0) / pastResults.length)
      : knowledgeScore;

    // Blend current score with past performance (80% current, 20% past)
    const blendedScore = knowledgeScore * 0.8 + pastAvg * 0.2;

    // Run ML prediction
    const result = predict(blendedScore, readiness, learningProfile);

    res.json({
      recommendedDifficulty: result.difficulty,
      confidence:            result.confidence,
      probabilities:         result.probabilities,
      usedML:                result.confidence !== null,
      inputs: {
        knowledgeScore,
        blendedScore: Math.round(blendedScore),
        readiness,
        learningProfile,
        pastAvg,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;