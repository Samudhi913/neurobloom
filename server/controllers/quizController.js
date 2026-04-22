const QuizResult    = require('../models/QuizResult');
const quizQuestions = require('../data/quizQuestions');
const { predict }   = require('../ml/recommend');
const User          = require('../models/User');

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

  // Grade the quiz
  let correct = 0;
  const gradedAnswers = answers.map(({ questionId, selected }) => {
    const question  = questions.find((q) => q.id === questionId);
    const isCorrect = question && question.answer === selected;
    if (isCorrect) correct++;
    return { questionId, selected, correct: isCorrect };
  });

  const score = Math.round((correct / questions.length) * 100);

  // Get student learning profile
  const student = await User.findById(studentId);
  const learningProfile = student?.learningProfile || 'None';

  // Use ML to predict difficulty
  const mlResult = predict(
    score,
    readiness || { focus: 3, confidence: 3, energy: 3 },
    learningProfile
  );

  const recommendedDifficulty = mlResult.difficulty;

  // Save result
  const result = await QuizResult.create({
    student: studentId,
    subject,
    score,
    answers: gradedAnswers,
    readiness: readiness || { focus: 3, confidence: 3, energy: 3 },
    recommendedDifficulty,
  });

  res.status(201).json({
    score,
    correct,
    total:                 questions.length,
    recommendedDifficulty,
    confidence:            mlResult.confidence,
    probabilities:         mlResult.probabilities,
    usedML:                mlResult.confidence !== null,
    resultId:              result._id,
  });
};

const getMyResults = async (req, res) => {
  const results = await QuizResult.find({ student: req.user._id }).sort({ takenAt: -1 });
  res.json(results);
};

module.exports = { getQuestions, submitQuiz, getMyResults };