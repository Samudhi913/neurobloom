import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          🌸 <span>NeuroBloom</span>
        </Link>
        <button className="navbar-hamburger" onClick={() => setMenuOpen((p) => !p)} aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/"                className={`navbar-link ${isActive('/')                ? 'active' : ''}`}>Home</Link>
          <Link to="/courses"         className={`navbar-link ${isActive('/courses')         ? 'active' : ''}`}>Courses</Link>
          <Link to="/community"       className={`navbar-link ${isActive('/community')       ? 'active' : ''}`}>Community</Link>
          <Link to="/assistive-tools" className={`navbar-link ${isActive('/assistive-tools') ? 'active' : ''}`}>Assistive Tools</Link>
        </div>
        <div className={`navbar-auth ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to={`/dashboard/${user.role}`} className="navbar-btn outline">My Dashboard</Link>
              <button className="navbar-btn filled" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="navbar-btn outline">Sign In</Link>
              <Link to="/register" className="navbar-btn filled">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}