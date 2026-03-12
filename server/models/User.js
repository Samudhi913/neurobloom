const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'parent'],
    default: 'student',
  },
  // Student-specific
  gradeLevel: { type: String },
  learningProfile: { type: String }, // e.g. ADHD, dyslexia, autism
  // Parent-specific
  linkedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Teacher-specific
  assignedClasses: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);