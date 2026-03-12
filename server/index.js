const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.json({ message: 'NeuroBloom API running' }));

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('DB connection error:', err));
