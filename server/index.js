const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes   = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes   = require('./routes/quizRoutes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',    authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quiz',    quizRoutes);

app.get('/', (req, res) => res.json({ message: '🌸 NeuroBloom API running' }));

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ DB connection error:', err));