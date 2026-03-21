import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { siteConfig } from '../siteConfig'
import { inquiriesAPI } from '../utils/api'
import '../App.css'

export default function Contact() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const carName = location.state?.carName

  const [service, setService] = useState('Movers & Packers')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [pickup, setPickup] = useState('')
  const [drop, setDrop] = useState('')
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const [submitMsg, setSubmitMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form based on navigation state
  useEffect(() => {
    if (carName) {
      setService('Car Rental')
      setMessage(`Interested in booking: ${carName}`)
    }
  }, [carName])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          redirectTo: {
            path: '/contact',
            state: { carName }
          }
        }
      })
      return
    }

    setSubmitMsg('')
    setIsSubmitting(true)
    try {
      if (!name || !phone) throw new Error('Name and Phone are required.')

      const payload = {
        service,
        name,
        email: user?.email, // Attach the user's email for notifications
        phone,
        pickup,
        drop,
        date,
        message
      }

      await inquiriesAPI.create(payload)
      setSubmitMsg('Thanks — we received your inquiry!')
      setName(''); setPhone(''); setPickup(''); setDrop(''); setDate(''); setMessage('')
    } catch (err) {
      setSubmitMsg(err.message || 'Failed to submit.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page">
      {/* Contact Hero */}
      <section className="contactHeroNew">
        <div className="container heroSplit">
          <div className="heroContent">
            <div className="badge badgeLight">24/7 Support</div>
            <h1 className="heroTitle" style={{ color: 'white' }}>
              Let's Start <br />
              <span style={{ color: '#bef264' }}>Something Great.</span>
            </h1>
            <p className="heroSubtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Whether you're moving across the country or need a ride for the weekend, we're here to help you every step of the way.
            </p>

            <div className="contactStats">
              <div className="cStat">
                <span className="cIcon">📞</span>
                <div>
                  <strong>Call Us</strong>
                  <span>{siteConfig.phoneDisplay}</span>
                </div>
              </div>
              <div className="cStat">
                <span className="cIcon">📧</span>
                <div>
                  <strong>Email Us</strong>
                  <span>{siteConfig.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="heroVisual">
            <div className="heroImageWrapper contactHeroImg">
              <img
                src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=1000"
                alt="Customer Support"
                className="heroImage"
              />
              <div className="floatingBadge badgeLeft">
                <span className="icon">💬</span> Always Online
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Body */}
      <section className="section contactSection">
        <div className="container contactLayoutNew">

          {/* Contact Info Column */}
          <div className="contactInfoCol">
            <div className="infoCard">
              <h3>Visit Our Office</h3>
              <p>{siteConfig.addressLine}</p>
              <div className="mapPlaceholder">
                <span>📍 View on Google Maps</span>
              </div>
            </div>

            <div className="infoCardAlt">
              <h3>Business Hours</h3>
              <ul className="hoursList">
                <li><span>Mon - Fri</span> <span>9:00 AM - 9:00 PM</span></li>
                <li><span>Sat - Sun</span> <span>10:00 AM - 8:00 PM</span></li>
              </ul>
            </div>
          </div>

          {/* Form Column */}
          <div className="contactFormCol">
            <div className="formCard">
              <div className="formHeader">
                <h2>Send us a Message</h2>
                <p>Get a free quote within 30 minutes.</p>
              </div>

              <form onSubmit={handleSubmit} className="premiumForm">
                <div className="formGroup">
                  <label>I am interested in</label>
                  <div className="serviceToggles">
                    {['Movers & Packers', 'Car Rental'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setService(opt)}
                        className={`serviceToggleBtn ${service === opt ? 'active' : ''}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="formGroup">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Pickup Location</label>
                    <input
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="Enter city or area"
                    />
                  </div>
                  <div className="formGroup">
                    <label>Drop Location</label>
                    <input
                      value={drop}
                      onChange={(e) => setDrop(e.target.value)}
                      placeholder="Enter city or area"
                    />
                  </div>
                </div>

                <div className="formGroup">
                  <label>Preferred Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="formGroup">
                  <label>Additional Details</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={service === 'Movers & Packers' ? 'Items list, floor number, etc.' : 'Car type, trip duration, etc.'}
                  />
                </div>

                <button type="submit" className="btn btnBlock btnPrimary" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending Request...' : 'Get Free Quote'}
                </button>

                {submitMsg && (
                  <div className={`formStatus ${submitMsg.includes('Failed') ? 'error' : 'success'}`}>
                    {submitMsg}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


