import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import '../styles/ParentDashboard.css'

const difficultyEmoji = { easy: '🌱', intermediate: '🌿', hard: '🌳' }
const difficultyColor = { easy: '#a8e6b0', intermediate: '#c4a8e8', hard: '#f0b8d0' }
const subjectEmoji    = { math: '🔢', science: '🔬', english: '📝', history: '🏛️', art: '🎨' }

export default function ParentDashboard() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [selected, setSelected] = useState(null)
  const [results,  setResults]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [loadingResults, setLoadingResults] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch all students for now — in production filter by linkedStudents
        const res = await axios.get('http://localhost:5000/api/users/students')
        setStudents(res.data)
        if (res.data.length > 0) handleSelectStudent(res.data[0]._id)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchStudents()
  }, [])

  const handleSelectStudent = async (studentId) => {
    setSelected(studentId)
    setLoadingResults(true)
    try {
      const res = await axios.get(`http://localhost:5000/api/users/student/${studentId}/results`)
      setResults(res.data.results)
    } catch (err) { console.error(err) }
    finally { setLoadingResults(false) }
  }

  const selectedStudent = students.find((s) => s._id === selected)
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
      </div>

      {students.length === 0 ? (
        <div className="dash-empty">
          <p>No students linked to your account yet.</p>
          <p>Please contact a teacher to link your child's account.</p>
        </div>
      ) : (
        <>
          {/* Student Selector */}
          {students.length > 1 && (
            <div className="parent-student-tabs">
              {students.map((s) => (
                <button
                  key={s._id}
                  className={`parent-tab ${selected === s._id ? 'active' : ''}`}
                  onClick={() => handleSelectStudent(s._id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {/* Student Summary */}
          {selectedStudent && (
            <div className="parent-student-summary">
              <div className="parent-avatar">{selectedStudent.learningProfile?.[0] || '🌸'}</div>
              <div className="parent-student-info">
                <h2>{selectedStudent.name}</h2>
                <p>{selectedStudent.learningProfile || 'No learning profile set'}</p>
              </div>
              <div className="parent-quick-stats">
                <div className="parent-stat">
                  <strong>{results.length}</strong>
                  <span>Quizzes Taken</span>
                </div>
                <div className="parent-stat">
                  <strong>{avgScore}%</strong>
                  <span>Average Score</span>
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
                <p>No quizzes taken yet.</p>
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
                        <span>🎯 {r.readiness?.focus}/5</span>
                        <span>💪 {r.readiness?.confidence}/5</span>
                        <span>⚡ {r.readiness?.energy}/5</span>
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