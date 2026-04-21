const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  subject: { type: String, enum: ['math', 'science', 'english', 'history', 'art'], required: true },
  difficulty: { type: String, enum: ['easy', 'intermediate', 'hard'], required: true },
  duration: { type: Number, required: true },
  thumbnail: { type: String, default: '' },
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);