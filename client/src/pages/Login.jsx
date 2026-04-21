import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const data = await login(form)
      if (data.user.role === 'student')      navigate('/dashboard/student')
      else if (data.user.role === 'teacher') navigate('/dashboard/teacher')
      else                                   navigate('/dashboard/parent')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">🌸 Welcome Back</h2>
        <p className="auth-subtitle">Sign in to NeuroBloom</p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input className="auth-input" type="email"    name="email"    placeholder="Email"    value={form.email}    onChange={handleChange} required />
          <input className="auth-input" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}