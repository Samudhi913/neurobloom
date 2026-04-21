import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import AccessibilityToolbar from './components/AccessibilityToolbar'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Courses from './pages/Courses'
import Community from './pages/Community'
import AssistiveTools from './pages/AssistiveTools'
import Login from './pages/Login'
import Register from './pages/Register'
import Quiz from './pages/Quiz'
import ReadinessCheck from './pages/ReadinessCheck'
import RecommendedCourses from './pages/RecommendedCourses'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import ParentDashboard  from './pages/ParentDashboard'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <AccessibilityToolbar />
      <Routes>
        <Route path="/"                  element={<Landing />} />
        <Route path="/courses"           element={<Courses />} />
        <Route path="/community"         element={<Community />} />
        <Route path="/assistive-tools"   element={<AssistiveTools />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/readiness/:subject" element={<ProtectedRoute allowedRoles={['student']}><ReadinessCheck /></ProtectedRoute>} />
        <Route path="/quiz/:subject"      element={<ProtectedRoute allowedRoles={['student']}><Quiz /></ProtectedRoute>} />
        <Route path="/courses/recommended" element={<ProtectedRoute allowedRoles={['student']}><RecommendedCourses /></ProtectedRoute>} />
        <Route path="/dashboard/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/parent"  element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', background: '#ffffff', width: '100%' }}>
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </AccessibilityProvider>
  )
}