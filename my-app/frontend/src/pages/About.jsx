import { siteConfig } from '../siteConfig'
import { Link } from 'react-router-dom'
import '../App.css'

export default function About() {
  return (
    <div className="page">
      {/* Custom About Hero */}
      <section className="aboutHero">
        <div className="container heroSplit">
          <div className="heroContent">
            <div className="badge badgeLight">Our Story</div>
            <h1 className="heroTitle" style={{ color: 'white' }}>
              Moving Emotions, <br />
              <span style={{ color: '#93c5fd' }}>Not Just Goods.</span>
            </h1>
            <p className="heroSubtitle" style={{ color: '#e2e8f0' }}>
              Since 2010, {siteConfig.companyName} has been the trusted partner for over 10,000 families and businesses, ensuring every journey is seamless and stress-free.
            </p>
            <div className="aboutStatsRow">
              <div className="aboutStat">
                <strong>12+</strong>
                <span>Years Exp.</span>
              </div>
              <div className="aboutStat">
                <strong>10k+</strong>
                <span>Happy Clients</span>
              </div>
              <div className="aboutStat">
                <strong>50+</strong>
                <span>Cities</span>
              </div>
            </div>
          </div>

          <div className="heroVisual">
            <div className="heroImageWrapper aboutHeroImg">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
                alt="Our Team"
                className="heroImage"
              />
              <div className="floatingBadge badgeLeft">
                <span className="icon"></span>Always For You
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className="grid2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <h2 className="sectionTitle" style={{ textAlign: 'left' }}>Driven by Purpose</h2>
              <p className="muted" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                We started with a single truck and a simple mission: to bring transparency and reliability to the logistics industry. Today, we are a full-stack mobility solutions provider.
              </p>
              <p className="muted" style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.7 }}>
                Whether it's shifting your home or renting a luxury car for a special occasion, we believe in delivering excellence in every mile.
              </p>

              <div className="founderQuote">
                "Our goal isn't just to transport items, but to deliver peace of mind."
                <span>— Founder, {siteConfig.companyName}</span>
              </div>
            </div>
            <div className="card glass-card" style={{ background: 'white', border: '1px solid var(--border)', padding: '0', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1632&ixlib=rb-4.0.3"
                alt="Team work"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section sectionAlt">
        <div className="container">
          <div className="sectionHead">
            <h2 className="sectionTitle">Our Core Values</h2>
            <p className="muted">The principles that drive every decision we make.</p>
          </div>

          <div className="valuesGrid">
            <div className="valueCard">
              <div className="valueIcon">🛡️</div>
              <h3>Safety First</h3>
              <p>We treat your belongings like our own. Zero compromise on safety protocols.</p>
            </div>
            <div className="valueCard">
              <div className="valueIcon">🤝</div>
              <h3>Transparency</h3>
              <p>No hidden charges. What you see in the quote is what you pay.</p>
            </div>
            <div className="valueCard">
              <div className="valueIcon">⏰</div>
              <h3>Punctuality</h3>
              <p>We value your time. On-time pickups and deliveries, guaranteed.</p>
            </div>
            <div className="valueCard">
              <div className="valueIcon">💡</div>
              <h3>Innovation</h3>
              <p>Using technology to track shipments and simplify bookings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="ctaBandCustom">
            <div className="ctaInnerSplit">
              <div className="ctaContentCustom" style={{ textAlign: 'left', margin: 0 }}>
                <div className="badge badgeLight" style={{ marginBottom: '1rem', display: 'inline-block' }}>Start Today</div>
                <h2 className="ctaTitleCustom">Ready to start your journey?</h2>
                <p className="ctaTextCustom">
                  Experience the difference of working with a partner who cares. Contact us today for your next move or travel plan.
                </p>
                <Link className="btn btnCustom" to="/contact">
                  Get in Touch <span className="arrowIcon">→</span>
                </Link>
              </div>

              <div className="ctaImagesComposition">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600"
                  alt="Happy Home"
                  className="ctaImgPrimary"
                />
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600"
                  alt="Journey"
                  className="ctaImgSecondary"
                />
              </div>
            </div>

            <div className="ctaDecor">
              <div className="circleDecor"></div>
              <div className="circleDecor small"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


