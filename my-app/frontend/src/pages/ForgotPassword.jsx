import { useState } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import '../App.css'

import { authAPI } from '../utils/api'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMsg, setSubmitMsg] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitMsg('')
        setError('')

        try {
            await authAPI.forgotPassword(email)
            setSubmitMsg(`Password reset link has been sent to ${email}. Check your inbox (and spam folder).`)
            setEmail('')
        } catch (err) {
            setError(err.message || 'Failed to send reset email. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
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
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
                        🔑
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
                        Forgot Password?
                    </h1>
                    <p className="muted">Enter your email to reset your password</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="field">
                        <label className="fieldLabel" htmlFor="email" style={{ marginLeft: '4px' }}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    <button type="submit" className="btn" disabled={isSubmitting} style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        justifyContent: 'center',
                        marginTop: '0.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)'
                    }}>
                        {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                {error && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '12px',
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        color: '#991b1b',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {submitMsg && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '12px',
                        background: '#dcfce7',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        color: '#166534',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {submitMsg}
                    </div>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'var(--muted)', fontWeight: 500, fontSize: '0.95rem' }}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
