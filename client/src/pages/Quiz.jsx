import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import '../styles/Quiz.css'

export default function Quiz() {
  const { subject }  = useParams()
  const navigate     = useNavigate()
  const location     = useLocation()
  const readiness    = location.state?.readiness || { focus: 3, confidence: 3, energy: 3 }

  const [questions,  setQuestions]  = useState([])
  const [answers,    setAnswers]    = useState({})
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [current,    setCurrent]    = useState(0)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz/${subject}`)
        setQuestions(res.data.questions)
      } catch { setError('Could not load quiz. Please try again.') }
      finally  { setLoading(false) }
    }
    fetchQuestions()
  }, [subject])

  const handleSelect = (questionId, option) => setAnswers((p) => ({ ...p, [questionId]: option }))

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) { setError('Please answer all questions before submitting.'); return }
    setSubmitting(true)
    try {
      const formatted = questions.map((q) => ({ questionId: q.id, selected: answers[q.id] }))
      const res = await axios.post(`http://localhost:5000/api/quiz/${subject}/submit`, { answers: formatted, readiness })
      navigate('/courses/recommended', {
        state: { subject, score: res.data.score, recommendedDifficulty: res.data.recommendedDifficulty, correct: res.data.correct, total: res.data.total, readiness },
      })
    } catch { setError('Submission failed. Please try again.') }
    finally  { setSubmitting(false) }
  }

  if (loading) return <div className="quiz-loading">Loading quiz... 🌸</div>

  const q        = questions[current]
  const progress = ((current + 1) / questions.length) * 100

  return (
    <div className="quiz-page">
      <div className="quiz-card">
        <div className="quiz-header">
          <h2 className="quiz-title">{subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz 🌸</h2>
          <p className="quiz-subtitle">Question {current + 1} of {questions.length}</p>
        </div>
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="quiz-question"><p>{q.question}</p></div>
        <div className="quiz-options">
          {q.options.map((opt) => (
            <button key={opt} className={`quiz-option ${answers[q.id] === opt ? 'selected' : ''}`} onClick={() => handleSelect(q.id, opt)}>{opt}</button>
          ))}
        </div>
        <div className="quiz-nav">
          <button className="quiz-nav-btn" onClick={() => setCurrent((p) => p - 1)} disabled={current === 0}>← Back</button>
          {current < questions.length - 1
            ? <button className="quiz-nav-btn primary" onClick={() => setCurrent((p) => p + 1)} disabled={!answers[q.id]}>Next →</button>
            : <button className="quiz-nav-btn primary" onClick={handleSubmit} disabled={submitting || !answers[q.id]}>{submitting ? 'Submitting...' : 'Submit Quiz ✓'}</button>
          }
        </div>
        {error && <p className="quiz-error-inline">{error}</p>}
      </div>
    </div>
  )
}