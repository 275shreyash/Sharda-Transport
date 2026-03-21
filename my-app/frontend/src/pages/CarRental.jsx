import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { cars as localCars } from '../data/cars'
import { carsAPI } from '../utils/api'
import { siteConfig } from '../siteConfig'
import '../App.css'

function Package({ title, desc, bullets, price }) {
  return (
    <div className="card packageCard">
      <div className="packageHeader">
        <div className="cardTitle packageTitle">{title}</div>
        <div className="packagePrice">{price}</div>
      </div>
      <div className="muted packageDesc">{desc}</div>
      <ul className="list check-list packageList">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <Link to="/contact" className="btn btnOutline btnFull">Enquire Now</Link>
    </div>
  )
}

function CarCard({ car }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleBook = () => {
    if (isAuthenticated) {
      navigate('/contact', { state: { carName: car.name } })
    } else {
      navigate('/login', {
        state: {
          redirectTo: { path: '/contact', state: { carName: car.name } }
        }
      })
    }
  }

  return (
    <div className="card carCardNew">
      <div className="carCardImageWrapper">
        <img src={car.image} alt={car.name} className="carImage" />
        <div className="carCategoryBadge">
          {car.category}
        </div>
      </div>
      <div className="carCardBody">
        <div className="carHeader">
          <h3 className="carName">{car.name}</h3>
          <div className="carPriceTag">{car.price}</div>
        </div>
        <p className="carDesc">
          {car.description}
        </p>

        <div className="carFeaturesGrid">
          <span className="carFeatureItem">
            👥 {car.capacity} Seater
          </span>
          {car.features.slice(0, 2).map((feature, idx) => (
            <span key={idx} className="carFeatureItem">
              ✨ {feature}
            </span>
          ))}
        </div>

        <button onClick={handleBook} className="btn carBookBtn">
          Book This Car
        </button>
      </div>
    </div>
  )
}

export default function CarRental() {
  const [cars, setCars] = useState(localCars)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const remote = await carsAPI.getAll()
        if (!cancelled && Array.isArray(remote) && remote.length > 0) {
          setCars(remote)
        }
      } catch (err) {
        // fallback silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="page">
      {/* Custom Rental Hero */}
      <section className="rentalHero">
        <div className="container heroSplit">
          <div className="heroContent">
            <div className="badge badgeDark">Premium Fleet</div>
            <h1 className="heroTitle">
              Drive in <span className="textAccent">Luxury</span> <br />
              & Comfort.
            </h1>
            <p className="heroSubtitle">
              From executive sedans to spacious SUVs, find the perfect ride for your business trips, family vacations, or daily commute.
            </p>
            <div className="heroCtas">
              <Link className="btn btnLg" to="/contact" state={{ carName: 'General Inquiry' }}>
                Book a Ride
              </Link>
              <a href="#fleet" className="btn btnSoft btnLg">
                View Fleet
              </a>
            </div>

            <div className="rentalStats">
              <div className="rentalStatItem">
                <strong>50+</strong>
                <span>Premium Cars</span>
              </div>
              <div className="statDivider"></div>
              <div className="rentalStatItem">
                <strong>24/7</strong>
                <span>Chauffeur Service</span>
              </div>
              <div className="statDivider"></div>
              <div className="rentalStatItem">
                <strong>0%</strong>
                <span>Cancellation Fee*</span>
              </div>
            </div>
          </div>

          <div className="heroVisual">
            <div className="heroImageWrapper rentalHeroImg">
              <img
                src="https://media.istockphoto.com/id/1411240552/photo/flyover-view-image-evening-view-of-city-highway-flyover.jpg?s=612x612&w=0&k=20&c=BuWTh2koZP_XEzetBrLsIUUANncaUJspMbKKNrxla2c="
                alt="Luxury Car Fleet"
                className="heroImage"
              />
              <div className="floatingBadge badgeRight">
                <span className="icon">🔑</span> Sanitized & Clean
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="section" id="fleet">
        <div className="container">
          <div className="sectionHead">
            <h2 className="sectionTitle">Choose Your Ride</h2>
            <p className="muted"> meticulously maintained vehicles for every occasion.</p>
          </div>

          <div className="carGrid">
            {loading ? (
              <div className="muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>Loading our premium fleet...</div>
            ) : (
              cars.map((car) => (
                <CarCard key={car._id || car.id} car={car} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="section sectionAlt">
        <div className="container">
          <div className="sectionHead">
            <h2 className="sectionTitle">Flexible Rental Packages</h2>
            <p className="muted">Transparent pricing tailored to your needs.</p>
          </div>
          <div className="grid3 packagesGrid">
            <Package
              title="Local Hourly"
              price="From ₹ 1200"
              desc="Perfect for shopping, meetings, or city tours."
              bullets={['4hr / 40km Package', '8hr / 80km Package', 'Fuel included', 'Professional chauffeur']}
            />
            <Package
              title="Outstation"
              price="per km rates"
              desc="Weekend getaways or long family vacations."
              bullets={['Competitive per-km pricing', 'Driver allowance included', 'State taxes extra', 'Well-maintained cars']}
            />
            <Package
              title="Airport Transfer"
              price="Fixed Price"
              desc="Stress-free pickup and drops to the airport."
              bullets={['Flight tracking', '60 mins wait time', 'Meet & Greet', 'No surge pricing']}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="ctaBand ctaBandSplit">
            <div className="ctaVisual">
              <div className="ctaImageWrapper" style={{ height: '250px' }}>
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800"
                  alt="Chauffeur driving"
                  className="ctaImage"
                />
              </div>
            </div>
            <div className="ctaContent">
              <h2 className="ctaTitle">Corporate Fleet Solutions?</h2>
              <p className="muted" style={{ color: 'rgba(255,255,255,0.9)' }}>
                We offer tailored monthly rental plans and employee transportation services for businesses.
              </p>
              <Link className="btn" style={{ background: 'white', color: 'var(--primary)' }} to="/contact">
                Contact Corporate Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
