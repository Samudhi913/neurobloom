const tf   = require('@tensorflow/tfjs');
const path = require('path');
const fs   = require('fs');

const labelToDifficulty = ['easy', 'intermediate', 'hard'];
const profileToNumber   = { None: 0, ADHD: 1, Dyslexia: 2, Autism: 3, Dyscalculia: 4, Other: 5 };

let model = null;

const loadModel = async () => {
  const modelPath = path.join(__dirname, 'model', 'model.json');
  if (!fs.existsSync(modelPath)) {
    console.warn('⚠️  No trained model found. Run: npm run train');
    return false;
  }

  try {
    const modelData = JSON.parse(fs.readFileSync(modelPath, 'utf8'));

    // Rebuild model architecture
    model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [5], units: 16, activation: 'relu', kernelInitializer: 'glorotUniform' }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    // Restore weights
    const weightTensors = modelData.weights.map((w) =>
      tf.tensor(w.data, w.shape)
    );
    model.setWeights(weightTensors);
    weightTensors.forEach((t) => t.dispose());

    console.log(`🧠 ML model loaded (trained on ${modelData.samples} samples at ${new Date(modelData.trainedAt).toLocaleString()})`);
    return true;
  } catch (err) {
    console.error('❌ Failed to load model:', err.message);
    return false;
  }
};

const predict = (knowledgeScore, readiness, learningProfile = 'None') => {
  // Fallback to rule-based if model not loaded
  if (!model) {
    const readinessAvg   = (readiness.focus + readiness.confidence + readiness.energy) / 3;
    const readinessScore = ((readinessAvg - 1) / 4) * 100;
    const combined       = knowledgeScore * 0.7 + readinessScore * 0.3;
    if (combined >= 70)      return { difficulty: 'hard',         confidence: null }
    if (combined >= 40)      return { difficulty: 'intermediate', confidence: null }
    return                          { difficulty: 'easy',         confidence: null }
  }

  const input = tf.tensor2d([[
    knowledgeScore / 100,
    ((readiness.focus      || 3) - 1) / 4,
    ((readiness.confidence || 3) - 1) / 4,
    ((readiness.energy     || 3) - 1) / 4,
    (profileToNumber[learningProfile] || 0) / 5,
  ]]);

  const prediction = model.predict(input);
  const probs      = Array.from(prediction.dataSync());
  const maxIndex   = probs.indexOf(Math.max(...probs));
  const confidence = Math.round(probs[maxIndex] * 100);

  input.dispose();
  prediction.dispose();

  return {
    difficulty: labelToDifficulty[maxIndex],
    confidence,
    probabilities: {
      easy:         Math.round(probs[0] * 100),
      intermediate: Math.round(probs[1] * 100),
      hard:         Math.round(probs[2] * 100),
    },
  };
};

module.exports = { loadModel, predict };