import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import '../styles/RecommendedCourses.css'

const difficultyEmoji = { easy: '🌱', intermediate: '🌿', hard: '🌳' }
const difficultyColor = { easy: '#a8e6b0', intermediate: '#c4a8e8', hard: '#f0b8d0' }

export default function RecommendedCourses() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!state) { navigate('/courses'); return }
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses?subject=${state.subject}&difficulty=${state.recommendedDifficulty}`)
        setCourses(res.data)
      } catch { setCourses([]) }
      finally  { setLoading(false) }
    }
    fetchCourses()
  }, [state, navigate])

  if (!state) return null

  return (
    <div className="rec-page">
      <div className="rec-summary">
        <div className="rec-score-circle">
          <span className="rec-score-number">{state.score}%</span>
          <span className="rec-score-label">Your Score</span>
        </div>
        <div className="rec-summary-text">
          <h2>Great job! 🌸</h2>
          <p>You got <strong>{state.correct} out of {state.total}</strong> correct.</p>
          <p>Based on your results, we recommend:</p>
          <span className="rec-difficulty-badge" style={{ background: difficultyColor[state.recommendedDifficulty] }}>
            {difficultyEmoji[state.recommendedDifficulty]} {state.recommendedDifficulty.charAt(0).toUpperCase() + state.recommendedDifficulty.slice(1)} Level
          </span>
        </div>
      </div>
      <div className="rec-courses-section">
        <h3>Recommended {state.subject} courses for you</h3>
        {loading ? <p className="rec-loading">Finding your courses... 🌸</p>
          : courses.length === 0 ? (
            <div className="rec-empty">
              <p>No courses available for this level yet.</p>
              <p>Check back soon — we're always adding more! 🌱</p>
              <Link to="/courses" className="rec-back-btn">Browse All Courses</Link>
            </div>
          ) : (
            <div className="rec-courses-grid">
              {courses.map((course) => (
                <div key={course._id} className="rec-course-card">
                  <span className="rec-course-icon">{difficultyEmoji[course.difficulty]}</span>
                  <div className="rec-course-info">
                    <h4>{course.title}</h4>
                    <p>{course.description}</p>
                    <div className="rec-course-meta">
                      <span className="rec-tag">{course.difficulty}</span>
                      <span className="rec-tag">{course.duration} mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
      <div className="rec-actions">
        <button className="rec-retry-btn" onClick={() => navigate(`/quiz/${state.subject}`)}>Retake Quiz</button>
        <Link to="/courses" className="rec-back-btn">All Courses</Link>
      </div>
    </div>
  )
}