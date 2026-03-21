import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { siteConfig } from '../siteConfig'
import '../App.css'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.redirectTo

  useEffect(() => {
    if (isAuthenticated && user) {
      if (redirectTo && redirectTo.path) {
        navigate(redirectTo.path, { state: redirectTo.state })
      } else {
        if (user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      }
    }
  }, [isAuthenticated, user, navigate, redirectTo])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    const result = await login(formData.email, formData.password)

    if (result.success) {
      if (redirectTo && redirectTo.path) {
        navigate(redirectTo.path, { state: redirectTo.state })
      } else {
        const userRole = result.user?.role
        navigate(userRole === 'admin' ? '/admin' : '/dashboard')
      }
    } else {
      setError(result.error || 'Login failed')
    }

    setLoading(false)
  }

  return (
    <div className="page mesh-gradient" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '3rem 2.5rem',
        background: 'rgba(255, 255, 255, 0.85)', // Slightly more opaque for readability
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            background: 'white',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            🔐
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Welcome Back
          </h1>
          <p className="muted">Sign in to {siteConfig.companyName}</p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#991b1b',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="field">
            <label className="fieldLabel" htmlFor="email" style={{ marginLeft: '4px' }}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              style={{
                background: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '12px'
              }}
            />
          </div>

          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="fieldLabel" htmlFor="password" style={{ marginLeft: '4px', marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                background: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '12px'
              }}
            />
          </div>

          <button type="submit" className="btn" disabled={loading} style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            justifyContent: 'center',
            marginTop: '0.5rem',
            background: 'var(--primary)',
            color: 'white',
            boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)'
          }}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p className="muted" style={{ fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
