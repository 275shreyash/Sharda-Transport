import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../utils/api'
import { siteConfig } from '../siteConfig'
import '../App.css'

export default function ResetPassword() {
    const { token } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Redirect if no token (basic protection)
    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsSubmitting(true)

        try {
            await authAPI.resetPassword(token, password)
            setSuccess(true)
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (err) {
            setError(err.message || 'Failed to reset password. The link might be expired.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="authContainer">
                <div className="authCard">
                    <div className="authHeader">
                        <Link to="/" className="authLogo">
                            <span className="logoIcon">📦</span>
                            <span className="logoText">{siteConfig.name}</span>
                        </Link>
                        <h2 className="authTitle">Password Reset Successful!</h2>
                        <p className="authSubtitle">
                            Your password has been updated. Redirecting to login...
                        </p>
                    </div>
                    <div className="authFooter">
                        <p>
                            <Link to="/login" className="authLink">Click here if not redirected</Link>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="authContainer">
            <div className="authCard">
                <div className="authHeader">
                    <Link to="/" className="authLogo">
                        <span className="logoIcon">📦</span>
                        <span className="logoText">{siteConfig.name}</span>
                    </Link>
                    <h2 className="authTitle">Reset Password</h2>
                    <p className="authSubtitle">Enter your new password below</p>
                </div>

                {error && <div className="authError">{error}</div>}

                <form onSubmit={handleSubmit} className="authForm">
                    <div className="formGroup">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                            minLength={6}
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm new password"
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="authButton"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="authFooter">
                    <p>
                        Remember your password? <Link to="/login" className="authLink">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
