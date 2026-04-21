const QuizResult    = require('../models/QuizResult');
const quizQuestions = require('../data/quizQuestions');

const getQuestions = (req, res) => {
  const { subject } = req.params;
  const questions   = quizQuestions[subject];
  if (!questions) return res.status(404).json({ message: 'Subject not found' });
  const safeQuestions = questions.map(({ id, question, options }) => ({ id, question, options }));
  res.json({ subject, questions: safeQuestions });
};

const submitQuiz = async (req, res) => {
  const { subject }            = req.params;
  const { answers, readiness } = req.body;
  const studentId              = req.user._id;
  const questions              = quizQuestions[subject];
  if (!questions) return res.status(404).json({ message: 'Subject not found' });

  let correct = 0;
  const gradedAnswers = answers.map(({ questionId, selected }) => {
    const question = questions.find((q) => q.id === questionId);
    const isCorrect = question && question.answer === selected;
    if (isCorrect) correct++;
    return { questionId, selected, correct: isCorrect };
  });

  const score         = Math.round((correct / questions.length) * 100);
  const readinessAvg  = readiness ? ((readiness.focus + readiness.confidence + readiness.energy) / 3) : 3;
  const readinessScore = ((readinessAvg - 1) / 4) * 100;
  const combinedScore  = score * 0.7 + readinessScore * 0.3;

  let recommendedDifficulty;
  if (combinedScore >= 70)      recommendedDifficulty = 'hard';
  else if (combinedScore >= 40) recommendedDifficulty = 'intermediate';
  else                          recommendedDifficulty = 'easy';

  const result = await QuizResult.create({
    student: studentId, subject, score, answers: gradedAnswers,
    readiness: readiness || { focus: 3, confidence: 3, energy: 3 },
    recommendedDifficulty,
  });

  res.status(201).json({
    score, correct, total: questions.length,
    readinessScore: Math.round(readinessScore),
    combinedScore:  Math.round(combinedScore),
    recommendedDifficulty,
    resultId: result._id,
  });
};

const getMyResults = async (req, res) => {
  const results = await QuizResult.find({ student: req.user._id }).sort({ takenAt: -1 });
  res.json(results);
};

module.exports = { getQuestions, submitQuiz, getMyResults };