import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../styles/ReadinessCheck.css'

const questions = [
  { id: 'focus',      icon: '🎯', question: 'How focused do you feel right now?',              labels: ['Very distracted','A bit distracted','Okay','Pretty focused','Super focused']   },
  { id: 'confidence', icon: '💪', question: 'How confident do you feel about learning today?', labels: ['Not confident','A little unsure','Okay','Fairly confident','Very confident']   },
  { id: 'energy',     icon: '⚡', question: 'How energetic do you feel right now?',            labels: ['Very tired','A bit tired','Okay','Pretty energetic','Very energetic']           },
]

export default function ReadinessCheck() {
  const { subject } = useParams()
  const navigate    = useNavigate()
  const [scores,  setScores]  = useState({ focus: 0, confidence: 0, energy: 0 })
  const [current, setCurrent] = useState(0)
  const [error,   setError]   = useState('')

  const q = questions[current]

  const handleSelect = (score) => { setScores((p) => ({ ...p, [q.id]: score })); setError('') }

  const handleNext = () => {
    if (!scores[q.id]) { setError('Please select an answer before continuing.'); return }
    if (current < questions.length - 1) { setCurrent((p) => p + 1) }
    else { navigate(`/quiz/${subject}`, { state: { readiness: scores } }) }
  }

  const progress = ((current + 1) / questions.length) * 100

  return (
    <div className="readiness-page">
      <div className="readiness-card">
        <div className="readiness-header">
          <span className="readiness-tag">Before we start 🌸</span>
          <h2>How are you feeling?</h2>
          <p>Answer 3 quick questions so we can find the best learning experience for you today.</p>
        </div>
        <div className="readiness-progress-track">
          <div className="readiness-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="readiness-step">Question {current + 1} of {questions.length}</p>
        <div className="readiness-question">
          <span className="readiness-q-icon">{q.icon}</span>
          <p>{q.question}</p>
        </div>
        <div className="readiness-scale">
          {[1,2,3,4,5].map((val) => (
            <button key={val} className={`readiness-scale-btn ${scores[q.id] === val ? 'selected' : ''}`} onClick={() => handleSelect(val)}>
              <span className="scale-number">{val}</span>
              <span className="scale-label">{q.labels[val - 1]}</span>
            </button>
          ))}
        </div>
        {error && <p className="readiness-error">{error}</p>}
        <div className="readiness-nav">
          {current > 0 && <button className="readiness-nav-btn" onClick={() => setCurrent((p) => p - 1)}>← Back</button>}
          <button className="readiness-nav-btn primary" onClick={handleNext}>
            {current < questions.length - 1 ? 'Next →' : 'Start Quiz →'}
          </button>
        </div>
      </div>
    </div>
  )
}