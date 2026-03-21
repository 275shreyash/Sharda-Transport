import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookingsAPI, inquiriesAPI } from '../utils/api'
import { siteConfig } from '../siteConfig'
import { io } from 'socket.io-client'
import '../App.css'
import '../dashboard.css'

function SummaryCard({ label, value, highlight = false }) {
  return (
    <div className="card">
      <div className="cardTitle">{label}</div>
      <div
        style={{
          marginTop: 8,
          fontSize: 20,
          fontWeight: 800,
          color: highlight ? '#4ade80' : 'inherit',
        }}
      >
        {value}
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (user && user._id) {
      const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'
      const socket = io(backendUrl)

      socket.on('connect', () => {
        socket.emit('join', user._id)
      })

      socket.on('notification', (data) => {
        // Simple built-in alert could be replaced with a beautiful toast later
        alert(`🔔 New Notification: ${data.message}`)

        // Auto-refresh the dashboard data
        loadData()
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [user])

  const [reviewModal, setReviewModal] = useState({ isOpen: false, bookingId: null, rating: 0, comment: '' })

  const handleStarClick = (bookingId, rating) => {
    setReviewModal({ isOpen: true, bookingId, rating, comment: '' })
  }

  const submitReview = async () => {
    try {
      await bookingsAPI.updateRating(reviewModal.bookingId, reviewModal.rating, reviewModal.comment)
      setBookings(bookings.map(b =>
        b._id === reviewModal.bookingId ? { ...b, rating: reviewModal.rating, review: reviewModal.comment } : b
      ))
      setReviewModal({ isOpen: false, bookingId: null, rating: 0, comment: '' })
    } catch (err) {
      alert('Failed to submit rating: ' + err.message)
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [bookingsData, statsData, inquiriesData] = await Promise.all([
        bookingsAPI.getAll(),
        bookingsAPI.getStats(),
        inquiriesAPI.getAll()
      ])
      setBookings(bookingsData)
      setStats(statsData)
      setInquiries(inquiriesData)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Loading...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ padding: '60px 0', minHeight: '80vh', background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: 'rgba(239, 68, 68, 0.9)',
            marginBottom: '16px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div className="dashboardGrid animateSlideUp">

          {/* LEFT SIDEBAR: User Profile */}
          <aside className="dashboardSidebar">
            <div className="profileCard">
              <div className="profileAvatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="profileName">{user?.name || 'Customer'}</h2>
              <p className="profileEmail">{user?.email || 'No email provided'}</p>

              <div className="profileDivider"></div>

              <div className="profileQuickActions">
                <Link to="/contact" className="btnAction btnActionPrimary">
                  Request New Service
                </Link>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Data Modules */}
          <main className="dashboardContent">

            <div style={{ marginBottom: '8px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Welcome back, {user?.name?.split(' ')[0]}
              </h1>
              <p className="muted" style={{ fontSize: '1.05rem' }}>
                Here is your service overview and booking history.
              </p>
            </div>

            {/* Active Inquiries Module */}
            <div className="moduleCard">
              <div className="moduleHeader">
                <h3 className="moduleTitle">Active Inquiries</h3>
                {inquiries.filter(i => i.status === 'pending').length > 0 && (
                  <span style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 800 }}>
                    {inquiries.filter(i => i.status === 'pending').length} Pending
                  </span>
                )}
              </div>

              {inquiries.filter(i => i.status === 'pending').length === 0 ? (
                <div className="emptyState">
                  <p>You have no active inquiries at the moment.</p>
                  <Link to="/contact" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                    Need a service? Get a free quote &rarr;
                  </Link>
                </div>
              ) : (
                <div className="modernTableWrapper">
                  <table className="modernTable">
                    <thead>
                      <tr>
                        <th>Date Submitted</th>
                        <th>Requested Service</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.filter(i => i.status === 'pending').map((inq) => (
                        <tr key={inq._id}>
                          <td data-label="Date Submitted">{formatDate(inq.createdAt)}</td>
                          <td data-label="Requested Service" style={{ fontWeight: 600 }}>{inq.service}</td>
                          <td data-label="Status"><span className="statusPill status-pending">{inq.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* My Bookings Module */}
            <div className="moduleCard">
              <div className="moduleHeader">
                <h3 className="moduleTitle">Service Bookings</h3>
              </div>

              {bookings.length === 0 ? (
                <div className="emptyState">
                  <p>You don't have any confirmed bookings yet.</p>
                </div>
              ) : (
                <div className="modernTableWrapper">
                  <table className="modernTable">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Service Type</th>
                        <th>Status</th>
                        <th>My Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td data-label="Date">{formatDate(booking.date)}</td>
                          <td data-label="Service Type" style={{ fontWeight: 600 }}>
                            {booking.serviceType === 'movers-packers' ? 'Movers & Packers' : 'Car Rental'}
                          </td>
                          <td data-label="Status">
                            <span className={`statusPill status-${booking.status}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td data-label="My Rating">
                            <div style={{ display: 'flex', gap: '2px', fontSize: '1.2rem' }}>
                              {[1, 2, 3, 4, 5].map((star) => {
                                const isFilled = star <= (booking.rating || 0);
                                const isInteractive = booking.status === 'completed' && !booking.rating;

                                return (
                                  <span
                                    key={star}
                                    onClick={() => isInteractive && handleStarClick(booking._id, star)}
                                    style={{
                                      color: isFilled ? '#fbbf24' : 'rgba(0,0,0,0.1)',
                                      cursor: isInteractive ? 'pointer' : 'default',
                                      transition: 'transform 0.2s',
                                      display: 'inline-block'
                                    }}
                                    title={isInteractive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
                                    onMouseEnter={(e) => { if (isInteractive) e.target.style.transform = 'scale(1.2)' }}
                                    onMouseLeave={(e) => { if (isInteractive) e.target.style.transform = 'scale(1)' }}
                                  >
                                    ★
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </main>
        </div>
      </div>

      {reviewModal.isOpen && (
        <div className="modalOverlay" onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h2 className="cardTitle" style={{ marginBottom: '1rem' }}>Leave a Review</h2>
            <div style={{ display: 'flex', gap: '5px', fontSize: '2rem', marginBottom: '1rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                  style={{
                    color: star <= reviewModal.rating ? '#fbbf24' : 'rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                >★</span>
              ))}
            </div>
            <div className="field">
              <label className="fieldLabel">Your Comment</label>
              <textarea
                className="adminSearch"
                style={{ width: '100%', minHeight: '100px' }}
                placeholder="Tell us about your experience..."
                value={reviewModal.comment}
                onChange={(e) => setReviewModal({ ...reviewModal, comment: e.target.value })}
              />
            </div>
            <div className="formActions" style={{ gap: '1rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btnSoft"
                onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}
              >
                Cancel
              </button>
              <button className="btn" onClick={submitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
