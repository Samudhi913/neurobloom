import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import '../styles/StudentDashboard.css'

const difficultyEmoji = { easy: '🌱', intermediate: '🌿', hard: '🌳' }
const difficultyColor = { easy: '#a8e6b0', intermediate: '#c4a8e8', hard: '#f0b8d0' }
const subjectEmoji    = { math: '🔢', science: '🔬', english: '📝', history: '🏛️', art: '🎨' }

export default function StudentDashboard() {
  const { user } = useAuth()
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/my-stats')
        setStats(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div className="dash-loading">Loading your dashboard... 🌸</div>

  return (
    <div className="student-dash">

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]} 🌸</h1>
          <p>Here's how you're doing on NeuroBloom</p>
        </div>
        <Link to="/courses" className="dash-start-btn">Start Learning →</Link>
      </div>

      {/* Stats Cards */}
      <div className="dash-stats">
        <div className="stat-card">
          <span className="stat-icon">📝</span>
          <div>
            <strong>{stats?.totalQuizzes || 0}</strong>
            <p>Quizzes Taken</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <div>
            <strong>{stats?.avgScore || 0}%</strong>
            <p>Average Score</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <div>
            <strong style={{ textTransform: 'capitalize' }}>
              {stats?.lastRecommendation || 'None yet'}
            </strong>
            <p>Last Recommendation</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <div>
            <strong>
              {stats?.lastActivity
                ? new Date(stats.lastActivity).toLocaleDateString()
                : 'No activity yet'}
            </strong>
            <p>Last Active</p>
          </div>
        </div>
      </div>

      {/* Learning Profile */}
      {user?.learningProfile && user.learningProfile !== 'None' && (
        <div className="dash-profile-banner">
          <span>🧠</span>
          <p>Your learning profile: <strong>{user.learningProfile}</strong> — all courses and tools are optimised for you.</p>
        </div>
      )}

      {/* Recent Quiz History */}
      <div className="dash-section">
        <h2>Recent Quiz Results</h2>
        {!stats?.recentResults?.length ? (
          <div className="dash-empty">
            <p>You haven't taken any quizzes yet.</p>
            <Link to="/courses" className="dash-empty-btn">Take your first quiz →</Link>
          </div>
        ) : (
          <div className="dash-quiz-list">
            {stats.recentResults.map((r) => (
              <div key={r._id} className="dash-quiz-card">
                <span className="dash-quiz-subject">{subjectEmoji[r.subject] || '📚'}</span>
                <div className="dash-quiz-info">
                  <h4 style={{ textTransform: 'capitalize' }}>{r.subject}</h4>
                  <p>Taken on {new Date(r.takenAt).toLocaleDateString()}</p>
                  <div className="dash-quiz-readiness">
                    <span>🎯 Focus: {r.readiness?.focus}/5</span>
                    <span>💪 Confidence: {r.readiness?.confidence}/5</span>
                    <span>⚡ Energy: {r.readiness?.energy}/5</span>
                  </div>
                </div>
                <div className="dash-quiz-right">
                  <span className="dash-quiz-score">{r.score}%</span>
                  <span
                    className="dash-quiz-badge"
                    style={{ background: difficultyColor[r.recommendedDifficulty] }}
                  >
                    {difficultyEmoji[r.recommendedDifficulty]} {r.recommendedDifficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="dash-section">
        <h2>Quick Actions</h2>
        <div className="dash-quick-links">
          <Link to="/courses"         className="dash-quick-card">📚<span>Browse Courses</span></Link>
          <Link to="/assistive-tools" className="dash-quick-card">♿<span>Accessibility Tools</span></Link>
          <Link to="/community"       className="dash-quick-card">💬<span>Community</span></Link>
        </div>
      </div>

    </div>
  )
}