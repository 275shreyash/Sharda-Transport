import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import { useAuth } from '../context/AuthContext'
import { reviewsAPI } from '../utils/api'
import { Star } from 'lucide-react'

function Feature({ title, desc }) {
  return (
    <div className="card">
      <div className="cardTitle">{title}</div>
      <div className="muted">{desc}</div>
    </div>
  )
}

function ServiceCard({ title, bullets, to, image }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault()
    if (isAuthenticated) {
      navigate(to)
    } else {
      navigate('/login', {
        state: { redirectTo: { path: to } }
      })
    }
  }

  return (
    <div className="card cardService">
      {image && <img src={image} alt={title} className="serviceCardImage" />}
      <div className="serviceCardContent">
        <div className="cardTitle">{title}</div>
        <ul className="list">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div style={{ marginTop: 14 }}>
          <button className="btn btnSoft" onClick={handleClick}>
            Learn more
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    reviewsAPI.getTopReviews().then(setReviews).catch(console.error)
  }, [])

  const handleContactClick = (e) => {
    e.preventDefault()
    if (isAuthenticated) {
      navigate('/contact')
    } else {
      navigate('/login', {
        state: { redirectTo: { path: '/contact' } }
      })
    }
  }

  return (
    <>
      <section className="heroNew">
        <div className="container heroSplit">
          <div className="heroContent">
            <div className="badge">Trusted Transport & Rentals</div>
            <h1 className="heroTitle">
              Move with Ease, <br />
              Travel in Comfort.
            </h1>
            <p className="heroSubtitle">
              One platform for all your shifting needs and premium car rentals. Professional packing, safe handling, and reliable journeys.
            </p>
            <div className="heroCtas">
              <Link className="btn btnLg" to="/movers-packers">
                Book Movers & Packers
              </Link>
              <Link className="btn btnSoft btnLg" to="/car-rental">
                Rent a Car
              </Link>
            </div>

            <div className="heroStatsRow">
              <div className="statItem">
                <strong>500+</strong> <span>Moves</span>
              </div>
              <div className="statDivider"></div>
              <div className="statItem">
                <strong>100%</strong> <span>Safe</span>
              </div>
              <div className="statDivider"></div>
              <div className="statItem">
                <strong>24/7</strong> <span>Support</span>
              </div>
            </div>
          </div>

          <div className="heroVisual">
            <div className="heroImageWrapper">
              <img
                src="https://cdn.pixabay.com/photo/2024/07/25/14/54/truck-8921536_640.jpg"
                alt="Moving and Transport"
                className="heroImage"
              />
              <div className="floatingBadge">
                <span className="icon">🛡️</span> Fully Insured
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <h2 className="sectionTitle">Our Services</h2>
            <p className="muted">
              End-to-end help for shifting and travel — from planning to execution.
            </p>
          </div>

          <div className="serviceGrid">
            <ServiceCard
              title="Home Shifting"
              to="/movers-packers"
              image="https://images.unsplash.com/photo-1505691723518-36a5ac3be353?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvbWV8ZW58MHx8MHx8fDA%3D"
              bullets={[
                'Household goods packing',
                'Safe loading & unloading',
                'Furniture dismantling',
                'Door-to-door delivery',
              ]}
            />
            <ServiceCard
              title="Office Relocation"
              to="/movers-packers"
              image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
              bullets={[
                'Office furniture moving',
                'IT equipment handling',
                'File & document packing',
                'Weekend shifting available',
              ]}
            />
            <ServiceCard
              title="Car Rental"
              to="/car-rental"
              image="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
              bullets={[
                'Luxury & budget cars',
                'Outstation packages',
                'Airport transfers',
                'Professional chauffeurs',
              ]}
            />
            <ServiceCard
              title="Warehousing"
              to="/contact"
              image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
              bullets={[
                'Secure storage space',
                'Short & long term options',
                'CCTV surveillance',
                'Inventory management',
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section sectionAlt">
        <div className="container">
          <div className="sectionHead">
            <h2 className="sectionTitle">Why Choose Us</h2>
            <p className="muted">
              We combine experience, technology, and care to give you a seamless moving experience.
            </p>
          </div>

          <div className="grid3">
            <div className="featureCard">
              <div className="featureImgWrapper">
                <img
                  src="https://i0.wp.com/varunapackersandmovers24.com/wp-content/uploads/2022/04/PACKERS-MOVERS.jpg?fit=2048%2C1536&ssl=1"
                  alt="Careful packing service"
                  className="featureImg"
                />
              </div>
              <div className="featureContent">
                <div className="featureIcon">📦</div>
                <h3 className="featureTitle">Careful Packing</h3>
                <p className="featureDesc">
                  We use multi-layer packaging materials to ensure your fragile items remain scratch-free.
                </p>
              </div>
            </div>

            <div className="featureCard">
              <div className="featureImgWrapper">
                <img
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=600"
                  alt="Trained staff team"
                  className="featureImg"
                />
              </div>
              <div className="featureContent">
                <div className="featureIcon">👷‍♂️</div>
                <h3 className="featureTitle">Expert Staff</h3>
                <p className="featureDesc">
                  Our team is verified, trained, and experienced in handling furniture disassembly and reassembly.
                </p>
              </div>
            </div>

            <div className="featureCard">
              <div className="featureImgWrapper">
                <img
                  src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=600"
                  alt="Customer support"
                  className="featureImg"
                />
              </div>
              <div className="featureContent">
                <div className="featureIcon">🎧</div>
                <h3 className="featureTitle">24/7 Support</h3>
                <p className="featureDesc">
                  Dedicated move coordinator to keep you updated from pickup until final delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="section sectionAlt">
          <div className="container">
            <div className="sectionHead">
              <h2 className="sectionTitle">Customer Reviews</h2>
              <p className="muted">Don't just take our word for it—see what our customers have to say.</p>
            </div>
            <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {reviews.map(review => (
                <div key={review._id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '1rem' }}>
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', flexGrow: 1 }}>"{review.comment}"</p>
                  <div>
                    <strong style={{ display: 'block' }}>{review.name}</strong>
                    <span className="muted" style={{ fontSize: '0.875rem' }}>{review.serviceType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <h2 className="sectionTitle">Our Work</h2>
            <p className="muted">
              A glimpse of how we handle shifting, transport, and storage for our customers.
            </p>
          </div>

          <div className="workGrid">
            <div className="workCard">
              <div className="workImageWrapper">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=900"
                  alt="Home shifting with packed boxes and truck"
                  className="workImage"
                />
                <div className="workTag">Home Shifting</div>
              </div>
              <div className="workContent">
                <h3>2 BHK Household Move</h3>
                <p className="muted">
                  Complete packing, loading, transport, and unloading with careful handling of
                  furniture and appliances.
                </p>
              </div>
            </div>

            <div className="workCard">
              <div className="workImageWrapper">
                <img
                  src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=900"
                  alt="Office relocation with desks and computers"
                  className="workImage"
                />
                <div className="workTag">Office Relocation</div>
              </div>
              <div className="workContent">
                <h3>Small Office Shift</h3>
                <p className="muted">
                  Weekend relocation of workstations, chairs, and IT equipment to reduce downtime.
                </p>
              </div>
            </div>

            <div className="workCard">
              <div className="workImageWrapper">
                <img
                  src="https://images.pexels.com/photos/20254173/pexels-photo-20254173/free-photo-of-car-on-road-in-forest.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Car rental service with driver and clean car"
                  className="workImage"
                />
                <div className="workTag">Car Rental</div>
              </div>
              <div className="workContent">
                <h3>Airport & Outstation Trips</h3>
                <p className="muted">
                  Clean cars with professional drivers for airport transfers and outstation travel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section >

      <section className="section">
        <div className="container">
          <div className="ctaBand ctaBandSplit">
            <div className="ctaVisual">
              <div className="ctaImageWrapper">
                <img
                  src="https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&q=80&w=900"
                  alt="Shifting and transport service"
                  className="ctaImage"
                />
                <div className="ctaOverlayTag">Sharda Transport</div>
              </div>
            </div>
            <div className="ctaContent">
              <div className="ctaTitle">Need a quick quote?</div>
              <div className="muted">
                Share your pickup, drop, and date — we’ll get back with the best option for your
                move or trip.
              </div>
              <button className="btn" onClick={handleContactClick}>
                Contact now
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


