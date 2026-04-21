const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, enum: ['math', 'science', 'english', 'history', 'art'], required: true },
  score: { type: Number, required: true },
  answers: [{ questionId: String, selected: String, correct: Boolean }],
  readiness: {
    focus:      { type: Number, min: 1, max: 5, default: 3 },
    confidence: { type: Number, min: 1, max: 5, default: 3 },
    energy:     { type: Number, min: 1, max: 5, default: 3 },
  },
  recommendedDifficulty: { type: String, enum: ['easy', 'intermediate', 'hard'] },
  takenAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QuizResult', quizResultSchema);