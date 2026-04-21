const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'teacher', 'parent'], default: 'student' },
  gradeLevel: { type: String },
  learningProfile: { type: String },
  linkedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignedClasses: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);