import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import { inquiriesAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import tvedio from "../assets/vedios/tvedio.mp4"

function ContactInfo({ icon, title, content, link }) {
  return (
    <div className="contactInfoItem">
      <div className="contactIcon">{icon}</div>
      <div>
        <div className="contactInfoTitle">{title}</div>
        <div className="contactInfoContent">
          {link ? <a href={link}>{content}</a> : content}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="field">
      <div className="fieldLabel">{label}</div>
      {children}
    </label>
  )
}

export default function Contact() {
  const { user } = useAuth()
  const location = useLocation()
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
    setSubmitMsg('')
    setIsSubmitting(true)

    try {
      if (!name || !phone) {
        throw new Error('Name and Phone are required.')
      }

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
      setSubmitMsg('Thanks — your inquiry has been submitted. We will contact you soon.')

      // Reset form
      setName('')
      setPhone('')
      setPickup('')
      setDrop('')
      setDate('')
      setMessage('')
      if (carName) setMessage('')

    } catch (err) {
      setSubmitMsg(err.message || 'Failed to submit inquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page">
      <section className="hero" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
        <div className="container">
          <div className="sectionHead" style={{ marginBottom: '0' }}>
            <h1 className="sectionTitle" style={{ fontSize: '3rem' }}>Get in Touch</h1>
            <p className="muted" style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
              Have questions? We're here to help. Reach out and let's discuss your needs.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contactGrid">
            {/* Contact Form */}
            <div className="card" style={{ gridColumn: '1 / 2' }}>
              <h2 className="cardTitle">Send us a Message</h2>
              <p className="muted" style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Fill in the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="formGrid">
                  <Field label="Service Type">
                    <select value={service} onChange={(e) => setService(e.target.value)}>
                      <option value="Movers & Packers">Movers & Packers</option>
                      <option value="Car Rental">Car Rental</option>
                    </select>
                  </Field>

                  <Field label="Your Name">
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </Field>

                  <Field label="Phone Number">
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </Field>

                  <Field label="Preferred Date">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Field>

                  <Field label="Pickup Location">
                    <input
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="Area, City"
                    />
                  </Field>

                  <Field label="Drop Location">
                    <input
                      value={drop}
                      onChange={(e) => setDrop(e.target.value)}
                      placeholder="Area, City"
                    />
                  </Field>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Message / Details">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Any specific items, car type preference, or other details..."
                        rows={4}
                      />
                    </Field>
                  </div>
                </div>

                <div className="formActions" style={{ marginTop: '20px' }}>
                  <button
                    type="submit"
                    className="btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </div>

                {submitMsg && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '12px',
                      borderRadius: '8px',
                      background: submitMsg.includes('Failed') ? '#fee2e2' : '#dcfce7',
                      color: submitMsg.includes('Failed') ? '#991b1b' : '#166534',
                      fontSize: '0.9rem'
                    }}
                  >
                    {submitMsg}
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info & Video */}
            <div className="contactSideBar" style={{ gridColumn: '2 / 3' }}>
              {/* Contact Information */}
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 className="cardTitle">Contact Information</h2>

                <ContactInfo
                  icon="📞"
                  title="Phone"
                  content={siteConfig.phoneDisplay}
                  link={`tel:${siteConfig.phoneE164}`}
                />

                <ContactInfo
                  icon="💬"
                  title="WhatsApp"
                  content={siteConfig.phoneDisplay}
                  link={`https://wa.me/${siteConfig.whatsappE164.replace('+', '')}`}
                />

                <ContactInfo
                  icon="✉️"
                  title="Email"
                  content={siteConfig.email}
                  link={`mailto:${siteConfig.email}`}
                />

                <ContactInfo
                  icon="📍"
                  title="Address"
                  content={siteConfig.addressLine}
                />

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                  <div className="contactInfoTitle" style={{ marginBottom: '1rem' }}>Service Areas</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {siteConfig.serviceAreas.map(area => (
                      <span key={area} className="badge" style={{ background: '#eff6ff', color: 'var(--primary)' }}>
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Section */}
              <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', background: '#000' }}>
                <div className="videoWrapper">
                  <video
                    src={tvedio}
                    controls
                    autoPlay
                    muted
                    loop
                    className="cardVideo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section sectionAlt">
        <div className="container">
          <div className="sectionHead">
            <h2 className="sectionTitle">Frequently Asked Questions</h2>
            <p className="muted">Quick answers to common questions</p>
          </div>

          <div className="faqGrid">
            <div className="faqItem">
              <h3 className="faqTitle">How long does a shipment take?</h3>
              <p className="muted">Delivery times vary based on distance. Local deliveries typically happen within 2-3 days, while outstation shipments depend on the route.</p>
            </div>

            <div className="faqItem">
              <h3 className="faqTitle">Do you provide insurance?</h3>
              <p className="muted">Yes, we offer optional insurance coverage on all shipments. We can discuss this during quotation.</p>
            </div>

            <div className="faqItem">
              <h3 className="faqTitle">What is your car rental process?</h3>
              <p className="muted">Simply select a car, provide your license and document, and book. We handle the rest with professional drivers.</p>
            </div>

            <div className="faqItem">
              <h3 className="faqTitle">Can I cancel my booking?</h3>
              <p className="muted">Yes, cancellations can be made with notice. Refer to our cancellation policy for details.</p>
            </div>

            <div className="faqItem">
              <h3 className="faqTitle">Do you offer night shifts?</h3>
              <p className="muted">We can arrange night shifts for additional charges. Please mention this in your inquiry.</p>
            </div>

            <div className="faqItem">
              <h3 className="faqTitle">How do I track my shipment?</h3>
              <p className="muted">We provide live tracking updates via phone and WhatsApp for all bookings.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
