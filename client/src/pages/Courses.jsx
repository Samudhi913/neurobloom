import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Courses.css'

const subjects = [
  { key: 'math',    label: 'Mathematics', icon: '🔢', desc: 'Numbers, algebra, geometry and more' },
  { key: 'science', label: 'Science',     icon: '🔬', desc: 'Biology, chemistry, physics and space' },
  { key: 'english', label: 'English',     icon: '📝', desc: 'Reading, writing, grammar and vocabulary' },
  { key: 'history', label: 'History',     icon: '🏛️', desc: 'World events, civilisations and timelines' },
  { key: 'art',     label: 'Art',         icon: '🎨', desc: 'Colour, creativity, artists and techniques' },
]

export default function Courses() {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const handleSubject = (key) => {
    if (!user) { navigate('/login'); return }
    navigate(`/readiness/${key}`)
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Explore Courses 📚</h1>
        <p>Choose a subject below. You'll answer a quick readiness check and a short quiz so we can recommend the right difficulty level just for you.</p>
      </div>
      <div className="subjects-grid">
        {subjects.map((s) => (
          <button key={s.key} className="subject-card" onClick={() => handleSubject(s.key)}>
            <span className="subject-icon">{s.icon}</span>
            <h3>{s.label}</h3>
            <p>{s.desc}</p>
            <span className="subject-cta">{user ? 'Get Started →' : 'Sign in to start →'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}