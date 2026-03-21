import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { siteConfig } from '../siteConfig'

export default function MoversPackers() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleBookClick = (e) => {
    e.preventDefault()
    if (isAuthenticated) {
      navigate('/contact', { state: { carName: 'Movers & Packers' } })
    } else {
      navigate('/login', {
        state: { redirectTo: { path: '/contact', state: { carName: 'Movers & Packers' } } }
      })
    }
  }

  return (
    <div className="page">
      {/* Custom Movers Hero */}
      <section className="moversHero">
        <div className="container heroSplit">
          <div className="heroContent">
            <div className="badge">Relocation Service</div>
            <h1 className="heroTitle">
              Stress-Free Moving, <br />
              <span className="textPrimary">Delivered Safely.</span>
            </h1>
            <p className="heroSubtitle">
              Whether it's your home, office, or vehicle, we ensure a seamless shift with zero damage and on-time delivery.
            </p>
            <div className="heroCtas">
              <button className="btn btnLg" onClick={handleBookClick}>
                Get Free Quote
              </button>
            </div>

            <div className="moversStats">
              <div className="moverStat">
                <span className="statIcon">🏠</span>
                <div>
                  <strong>1200+</strong>
                  <span>Homes Moved</span>
                </div>
              </div>
              <div className="moverStat">
                <span className="statIcon">🏢</span>
                <div>
                  <strong>300+</strong>
                  <span>Offices Shifted</span>
                </div>
              </div>
            </div>
          </div>

          <div className="heroVisual">
            <div className="heroImageWrapper moversHeroImg">
              <img
                src="https://5.imimg.com/data5/SELLER/Default/2023/8/335727954/JI/QK/BV/32732628/packers-and-movers-in-mumbai.jpg"
                alt="Packers and Movers Team"
                className="heroImage"
              />
              <div className="floatingBadge">
                <span className="icon">📦</span> Expert Packing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <h2 className="sectionTitle">Comprehensive Shifting Solutions</h2>
            <p className="muted">Tailored services to meet every relocation requirement.</p>
          </div>

          <div className="grid3">
            <div className="serviceCardNew">
              <div className="serviceIconBox">🏠</div>
              <h3>Home Relocation</h3>
              <p>Complete household shifting including dismantling, packing, loading, transport, and re-assembly.</p>
              <ul className="checkListSmall">
                <li>Double-layer packing</li>
                <li>Furniture handling</li>
                <li>Appliance setup</li>
              </ul>
            </div>

            <div className="serviceCardNew">
              <div className="serviceIconBox">🏢</div>
              <h3>Office Moving</h3>
              <p>Efficient corporate relocation with minimal downtime. We handle IT assets, files, and furniture.</p>
              <ul className="checkListSmall">
                <li>Weekend shifting</li>
                <li>IT equipment care</li>
                <li>Confidentiality assured</li>
              </ul>
            </div>

            <div className="serviceCardNew">
              <div className="serviceIconBox">🚗</div>
              <h3>Car & Bike Transport</h3>
              <p>Safe vehicle transportation using specialized car carriers and bike containers.</p>
              <ul className="checkListSmall">
                <li>Scratch-free transit</li>
                <li>Door-to-door service</li>
                <li>Live tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section sectionAlt">
        <div className="container">
          <div className="sectionHead">
            <h2 className="sectionTitle">How It Works</h2>
            <p className="muted">Your move in 4 simple steps.</p>
          </div>

          <div className="processGrid">
            <div className="processStep">
              <div className="stepNumber">01</div>
              <h4>Survey & Quote</h4>
              <p>We assess your goods and provide a transparent, fixed-price quote.</p>
            </div>
            <div className="processStep">
              <div className="stepNumber">02</div>
              <h4>Packing</h4>
              <p>Our team arrives with high-quality materials to pack everything securely.</p>
            </div>
            <div className="processStep">
              <div className="stepNumber">03</div>
              <h4>Transport</h4>
              <p>Safe loading and transit in our GPS-enabled closed container trucks.</p>
            </div>
            <div className="processStep">
              <div className="stepNumber">04</div>
              <h4>Delivery</h4>
              <p>Unloading, unpacking, and setting up your home at the destination.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="ctaBand ctaBandSplit">
            <div className="ctaVisual">
              <div className="ctaImageWrapper">
                <img
                  src="https://thumbs.dreamstime.com/b/movers-packers-29012055.jpg"
                  alt="Warehouse storage"
                  className="ctaImage"
                />
              </div>
            </div>
            <div className="ctaContent">
              <h2 className="ctaTitle">Planned Your Move Yet?</h2>
              <p className="muted" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Don't wait until the last minute. Book your slot today and get an early-bird discount on long-distance moves.
              </p>
              <button className="btn" onClick={handleBookClick}>Get Instant Quote</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
