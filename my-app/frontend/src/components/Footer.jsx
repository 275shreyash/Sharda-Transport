import { Link } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import { Logo } from './Logo'
import { Logo1 } from './Logo1'
import { Instagram, Facebook, Linkedin } from 'lucide-react'


export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer-wrapper">
      {/* Abstract Glowing Background Orbs */}
      <div className="footer-glow orb-1"></div>
      <div className="footer-glow orb-2"></div>

    
      

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footerInner">

            {/* Brand Column */}
            <div className="footerCol footerBrandCol">
              <Link to="/" className="footerBrand">
                <span><Logo1 /></span>
                <span className="brandName">{siteConfig.companyName}</span>
              </Link>
              <p className="footerTagline">
                Simplifying moves and journeys with professional care and a premium fleet. We don't just move boxes, we move lives.
              </p>
              <div className="socialLinks">
                <a href={siteConfig.socialLinks?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="socialLink" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href={siteConfig.socialLinks?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="socialLink" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
                <a href={siteConfig.socialLinks?.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="socialLink" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="footerCol">
              <h4 className="footerTitle">Company</h4>
              <div className="footerLinks">
                <Link to="/about" className="footerLink"><span>About Us</span></Link>
                <Link to="/movers-packers" className="footerLink"><span>Services</span></Link>
                <Link to="/car-rental" className="footerLink"><span>Our Fleet</span></Link>
              </div>
            </div>

            <div className="footerCol">
              <h4 className="footerTitle">Support</h4>
              <div className="footerLinks">
                <Link to="/contact" className="footerLink"><span>Help Center</span></Link>
                <Link to="/contact" className="footerLink"><span>Terms of Service</span></Link>
                <Link to="/contact" className="footerLink"><span>Privacy Policy</span></Link>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="footerCol newsletterCol">
              <h4 className="footerTitle">Stay in the Loop</h4>
              <p className="footerText">Exclusive offers, travel tips, and moving hacks straight to your inbox.</p>
              <form className="newsletterForm" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <input type="email" placeholder="Enter your email" className="newsletterInput" required />
                  <button type="submit" className="btn btn-newsletter">→</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footerBottom">
        <div className="container">
          <div className="bottom-inner">
            <div className="copyright">
              © {year} {siteConfig.companyName}. Crafted with care.
            </div>
            <div className="serviceAreas">
              <span className="area-label">Serving:</span>
              {(siteConfig.serviceAreas || ['Mumbai', 'Delhi', 'Bangalore']).slice(0, 3).map((area) => (
                <span key={area} className="areaTag">{area}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


