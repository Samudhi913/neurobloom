const tf       = require('@tensorflow/tfjs');
const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const QuizResult = require('../models/QuizResult');
const User       = require('../models/User');

const difficultyToLabel = { easy: 0, intermediate: 1, hard: 2 };
const profileToNumber   = { None: 0, ADHD: 1, Dyslexia: 2, Autism: 3, Dyscalculia: 4, Other: 5 };

async function train() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const results = await QuizResult.find({}).populate('student', 'learningProfile');
  console.log(`📊 Found ${results.length} quiz results`);

  let features = [];
  let labels   = [];

  if (results.length >= 5) {
    for (const r of results) {
      const profile = r.student?.learningProfile || 'None';
      features.push([
        r.score / 100,
        ((r.readiness?.focus      || 3) - 1) / 4,
        ((r.readiness?.confidence || 3) - 1) / 4,
        ((r.readiness?.energy     || 3) - 1) / 4,
        (profileToNumber[profile] || 0) / 5,
      ]);
      labels.push(difficultyToLabel[r.recommendedDifficulty]);
    }
  } else {
    console.log('⚠️  Not enough real data — using synthetic training data...');
    for (let i = 0; i < 300; i++) {
      const knowledge  = Math.random();
      const focus      = Math.random();
      const confidence = Math.random();
      const energy     = Math.random();
      const profile    = Math.floor(Math.random() * 6) / 5;
      const combined   = knowledge * 0.7 + ((focus + confidence + energy) / 3) * 0.3;
      let label;
      if (combined >= 0.70)      label = 2;
      else if (combined >= 0.40) label = 1;
      else                       label = 0;
      features.push([knowledge, focus, confidence, energy, profile]);
      labels.push(label);
    }
  }

  await buildAndSaveModel(features, labels);
  await mongoose.disconnect();
  console.log('✅ Done!');
  process.exit(0);
}

async function buildAndSaveModel(features, labels) {
  console.log('🧠 Building neural network...');

  const xs = tf.tensor2d(features);
  const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), 3);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [5], units: 16, activation: 'relu', kernelInitializer: 'glorotUniform' }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  console.log('🏋️  Training...');

  await model.fit(xs, ys, {
    epochs: 100,
    batchSize: 16,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if ((epoch + 1) % 20 === 0) {
          console.log(`  Epoch ${epoch + 1}/100 — loss: ${logs.loss.toFixed(4)}, accuracy: ${(logs.acc || logs.accuracy || 0).toFixed(4)}`);
        }
      },
    },
  });

  // Save weights manually as JSON
  const dir = path.join(__dirname, 'model');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  // Extract weights
  const weights = model.getWeights().map((w) => ({
    shape: w.shape,
    data:  Array.from(w.dataSync()),
  }));

  // Save weights + model config
  const modelData = {
    config: {
      layers: [
        { type: 'dense', units: 16, activation: 'relu', inputShape: [5] },
        { type: 'dropout', rate: 0.2 },
        { type: 'dense', units: 8,  activation: 'relu' },
        { type: 'dense', units: 3,  activation: 'softmax' },
      ],
    },
    weights,
    trainedAt: new Date().toISOString(),
    samples:   features.length,
  };

  fs.writeFileSync(
    path.join(dir, 'model.json'),
    JSON.stringify(modelData, null, 2)
  );

  console.log('💾 Model saved to server/ml/model/model.json');

  xs.dispose();
  ys.dispose();
}

train().catch(console.error);