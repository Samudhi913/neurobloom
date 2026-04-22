import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import '../styles/ParentDashboard.css'

const difficultyEmoji = { easy: '🌱', intermediate: '🌿', hard: '🌳' }
const difficultyColor = { easy: '#a8e6b0', intermediate: '#c4a8e8', hard: '#f0b8d0' }
const subjectEmoji    = { math: '🔢', science: '🔬', english: '📝', history: '🏛️', art: '🎨' }

export default function ParentDashboard() {
  const { user }    = useAuth()
  const [children,  setChildren]  = useState([])
  const [selected,  setSelected]  = useState(null)
  const [results,   setResults]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [loadingResults, setLoadingResults] = useState(false)

  // Link child form
  const [linkEmail, setLinkEmail] = useState('')
  const [linkMsg,   setLinkMsg]   = useState('')
  const [linking,   setLinking]   = useState(false)
  const [showLink,  setShowLink]  = useState(false)

  useEffect(() => { fetchChildren() }, [])

  const fetchChildren = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/my-children')
      setChildren(res.data)
      if (res.data.length > 0) handleSelectChild(res.data[0]._id)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSelectChild = async (childId) => {
    setSelected(childId)
    setLoadingResults(true)
    try {
      const res = await axios.get(`http://localhost:5000/api/users/student/${childId}/results`)
      setResults(res.data.results)
    } catch (err) { console.error(err) }
    finally { setLoadingResults(false) }
  }

  const handleLinkStudent = async (e) => {
    e.preventDefault()
    setLinking(true)
    setLinkMsg('')
    try {
      const res = await axios.post('http://localhost:5000/api/users/link-student', { email: linkEmail })
      setLinkMsg(`✅ ${res.data.student.name} linked successfully!`)
      setLinkEmail('')
      fetchChildren() // refresh list
      setTimeout(() => { setLinkMsg(''); setShowLink(false) }, 2500)
    } catch (err) {
      setLinkMsg(`❌ ${err.response?.data?.message || 'Failed to link student'}`)
    } finally { setLinking(false) }
  }

  const selectedChild = children.find((c) => c._id === selected)
  const avgScore = results.length
    ? Math.round(results.reduce((a, b) => a + b.score, 0) / results.length)
    : 0

  if (loading) return <div className="dash-loading">Loading dashboard... 🌸</div>

  return (
    <div className="parent-dash">

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1>Parent Dashboard 👨‍👩‍👧</h1>
          <p>Welcome, {user?.name} — track your child's learning progress</p>
        </div>
        <button className="dash-start-btn" onClick={() => setShowLink((p) => !p)}>
          {showLink ? 'Cancel' : '+ Link a Child'}
        </button>
      </div>

      {/* Link Child Form */}
      {showLink && (
        <div className="parent-link-form">
          <h3>🔗 Link your child's account</h3>
          <p>Enter your child's registered email address to link their account to yours.</p>
          <form className="link-form-row" onSubmit={handleLinkStudent}>
            <input
              className="link-input"
              type="email"
              placeholder="Child's email address"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              required
            />
            <button className="link-btn" type="submit" disabled={linking}>
              {linking ? 'Linking...' : 'Link Account'}
            </button>
          </form>
          {linkMsg && <p className="link-msg">{linkMsg}</p>}
        </div>
      )}

      {children.length === 0 ? (
        <div className="dash-empty">
          <span style={{ fontSize: '3em', display: 'block', marginBottom: '16px' }}>🌱</span>
          <p>No children linked yet.</p>
          <p>Click <strong>"+ Link a Child"</strong> above and enter your child's registered email to get started.</p>
        </div>
      ) : (
        <>
          {/* Child Selector tabs */}
          {children.length > 1 && (
            <div className="parent-student-tabs">
              {children.map((c) => (
                <button
                  key={c._id}
                  className={`parent-tab ${selected === c._id ? 'active' : ''}`}
                  onClick={() => handleSelectChild(c._id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Child Summary */}
          {selectedChild && (
            <div className="parent-student-summary">
              <div className="parent-avatar">
                {selectedChild.name?.charAt(0).toUpperCase()}
              </div>
              <div className="parent-student-info">
                <h2>{selectedChild.name}</h2>
                <p>{selectedChild.learningProfile && selectedChild.learningProfile !== 'None'
                  ? `Learning profile: ${selectedChild.learningProfile}`
                  : 'No learning profile set'}
                </p>
                <p style={{ fontSize: '0.85em', color: '#bbb' }}>{selectedChild.email}</p>
              </div>
              <div className="parent-quick-stats">
                <div className="parent-stat">
                  <strong>{results.length}</strong>
                  <span>Quizzes</span>
                </div>
                <div className="parent-stat">
                  <strong>{avgScore}%</strong>
                  <span>Avg Score</span>
                </div>
                <div className="parent-stat">
                  <strong style={{ textTransform: 'capitalize' }}>
                    {results[0]?.recommendedDifficulty || '—'}
                  </strong>
                  <span>Latest Level</span>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Results */}
          <div className="dash-section">
            <h2>Quiz History</h2>
            {loadingResults ? (
              <p className="dash-loading-small">Loading results...</p>
            ) : results.length === 0 ? (
              <div className="dash-empty">
                <p>No quizzes taken yet by {selectedChild?.name}.</p>
              </div>
            ) : (
              <div className="parent-results-list">
                {results.map((r) => (
                  <div key={r._id} className="parent-result-card">
                    <span className="parent-result-subject">{subjectEmoji[r.subject] || '📚'}</span>
                    <div className="parent-result-info">
                      <h4 style={{ textTransform: 'capitalize' }}>{r.subject}</h4>
                      <p>{new Date(r.takenAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <div className="parent-readiness-row">
                        <span>🎯 Focus: {r.readiness?.focus}/5</span>
                        <span>💪 Confidence: {r.readiness?.confidence}/5</span>
                        <span>⚡ Energy: {r.readiness?.energy}/5</span>
                      </div>
                    </div>
                    <div className="parent-result-right">
                      <span className="parent-result-score">{r.score}%</span>
                      <span
                        className="parent-result-badge"
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
        </>
      )}
    </div>
  )
}