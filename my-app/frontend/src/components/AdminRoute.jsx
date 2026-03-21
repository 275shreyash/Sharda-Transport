import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8fafc',
        gap: '1rem'
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(59, 130, 246, 0.2)',
          borderTop: '4px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{ color: 'var(--muted)', fontWeight: 500 }}>Loading...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'admin') {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="container">
          <div style={{
            textAlign: 'center',
            padding: '40px',
            maxWidth: '500px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
            <h1 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--text)' }}>Access Denied</h1>
            <p className="muted">
              You do not have permission to view this page. Please log in with an administrator account.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn"
              style={{ marginTop: '1.5rem' }}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}

