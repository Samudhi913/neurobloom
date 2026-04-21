import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import '../styles/TeacherDashboard.css'

const difficultyColor = { easy: '#a8e6b0', intermediate: '#c4a8e8', hard: '#f0b8d0' }
const profileEmoji    = { ADHD: '⚡', Dyslexia: '📖', Autism: '🧩', Dyscalculia: '🔢', Other: '🌸', None: '🌱' }

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [courseForm, setCourseForm] = useState({ title: '', description: '', subject: 'math', difficulty: 'easy', duration: 30, tags: '' })
  const [courseMsg, setCourseMsg] = useState('')

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/students')
        setStudents(res.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchStudents()
  }, [])

  const handleCourseSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/courses', {
        ...courseForm,
        tags: courseForm.tags.split(',').map((t) => t.trim()),
        duration: Number(courseForm.duration),
      })
      setCourseMsg('✅ Course added successfully!')
      setCourseForm({ title: '', description: '', subject: 'math', difficulty: 'easy', duration: 30, tags: '' })
      setTimeout(() => { setCourseMsg(''); setShowCourseForm(false) }, 2000)
    } catch (err) {
      setCourseMsg('❌ Failed to add course. Try again.')
    }
  }

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="dash-loading">Loading dashboard... 🌸</div>

  return (
    <div className="teacher-dash">

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1>Teacher Dashboard 📚</h1>
          <p>Welcome, {user?.name} — manage your students and courses</p>
        </div>
        <button className="dash-start-btn" onClick={() => setShowCourseForm((p) => !p)}>
          {showCourseForm ? 'Cancel' : '+ Add Course'}
        </button>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="stat-card">
          <span className="stat-icon">👨‍🎓</span>
          <div><strong>{students.length}</strong><p>Total Students</p></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📝</span>
          <div>
            <strong>{students.reduce((a, s) => a + (s.totalQuizzes || 0), 0)}</strong>
            <p>Total Quizzes Taken</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <div>
            <strong>
              {students.filter((s) => s.avgScore !== null).length
                ? Math.round(students.filter((s) => s.avgScore !== null).reduce((a, s) => a + s.avgScore, 0) / students.filter((s) => s.avgScore !== null).length)
                : 0}%
            </strong>
            <p>Class Average Score</p>
          </div>
        </div>
      </div>

      {/* Add Course Form */}
      {showCourseForm && (
        <div className="teacher-form-section">
          <h2>Add New Course</h2>
          <form className="teacher-course-form" onSubmit={handleCourseSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input className="form-input" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required placeholder="Course title" />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select className="form-input" value={courseForm.subject} onChange={(e) => setCourseForm({ ...courseForm, subject: e.target.value })}>
                  {['math','science','english','history','art'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Difficulty</label>
                <select className="form-input" value={courseForm.difficulty} onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}>
                  {['easy','intermediate','hard'].map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input className="form-input" type="number" value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input form-textarea" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} required placeholder="Brief course description" />
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input className="form-input" value={courseForm.tags} onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })} placeholder="e.g. algebra, basics, fractions" />
            </div>
            {courseMsg && <p className="form-msg">{courseMsg}</p>}
            <button className="form-submit-btn" type="submit">Add Course</button>
          </form>
        </div>
      )}

      {/* Student List */}
      <div className="dash-section">
        <div className="teacher-students-header">
          <h2>Students ({filtered.length})</h2>
          <input
            className="teacher-search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="dash-empty"><p>No students found.</p></div>
        ) : (
          <div className="teacher-student-list">
            {filtered.map((s) => (
              <div key={s._id} className="teacher-student-card">
                <div className="student-card-avatar">
                  {profileEmoji[s.learningProfile] || '🌸'}
                </div>
                <div className="student-card-info">
                  <h4>{s.name}</h4>
                  <p>{s.email}</p>
                  <span className="student-profile-tag">{s.learningProfile || 'None'}</span>
                </div>
                <div className="student-card-stats">
                  <div className="student-stat">
                    <strong>{s.totalQuizzes || 0}</strong>
                    <span>Quizzes</span>
                  </div>
                  <div className="student-stat">
                    <strong>{s.avgScore !== null ? `${s.avgScore}%` : '—'}</strong>
                    <span>Avg Score</span>
                  </div>
                  <div className="student-stat">
                    <strong
                      style={{
                        background: s.lastQuiz ? difficultyColor[s.lastQuiz.recommendedDifficulty] : '#f0e9ff',
                        padding: '2px 10px', borderRadius: '20px', fontSize: '0.8em',
                        textTransform: 'capitalize',
                      }}
                    >
                      {s.lastQuiz ? s.lastQuiz.recommendedDifficulty : '—'}
                    </strong>
                    <span>Last Level</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}