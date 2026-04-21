import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/auth.css'

const LEARNING_PROFILES = ['None', 'ADHD', 'Dyslexia', 'Autism', 'Dyscalculia', 'Other']

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form,    setForm]    = useState({ name: '', email: '', password: '', role: 'student', learningProfile: 'None' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const data = await register(form)
      if (data.user.role === 'student')      navigate('/dashboard/student')
      else if (data.user.role === 'teacher') navigate('/dashboard/teacher')
      else                                   navigate('/dashboard/parent')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">🌸 Join NeuroBloom</h2>
        <p className="auth-subtitle">Create your account</p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input className="auth-input" type="text"     name="name"     placeholder="Full Name"           value={form.name}     onChange={handleChange} required />
          <input className="auth-input" type="email"    name="email"    placeholder="Email"               value={form.email}    onChange={handleChange} required />
          <input className="auth-input" type="password" name="password" placeholder="Password (min 6)"   value={form.password} onChange={handleChange} required />
          <label className="auth-label">I am a...</label>
          <select className="auth-input" name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>
          {form.role === 'student' && (
            <>
              <label className="auth-label">Learning Profile</label>
              <select className="auth-input" name="learningProfile" value={form.learningProfile} onChange={handleChange}>
                {LEARNING_PROFILES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </>
          )}
          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  )
}