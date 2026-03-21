import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { siteConfig } from '../siteConfig'
import { Logo } from './Logo'
import { Logo1 } from './Logo1'
import { useAuth } from '../context/AuthContext'

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `navLink ${isActive ? 'navLinkActive' : ''}`.trim()
      }
    >
      {children}
    </NavLink>
  )
}

function MobileNavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `mobile-nav-link ${isActive ? 'active' : ''}`.trim()
      }
    >
      {children}
    </NavLink>
  )
}

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileOpen(false)
  }

  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      setIsDarkMode(true)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)
  const closeMobile = () => setIsMobileOpen(false)

  return (
    <header className="header">
      <div className="container headerInner">
        <Link to="/" className="brand" aria-label={`${siteConfig.companyName} Home`}>
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="nav" aria-label="Primary navigation">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/movers-packers">Movers & Packers</NavItem>
          <NavItem to="/car-rental">Car Rental</NavItem>
          <NavItem to="/about">About</NavItem>
          <NavItem to="/contact">Contact</NavItem>
          {isAuthenticated && user?.role === 'admin' && (
            <NavItem to="/admin">Admin</NavItem>
          )}
          {isAuthenticated && user?.role === 'customer' && (
            <NavItem to="/dashboard">Dashboard</NavItem>
          )}
        </nav>

        <div className="headerCta">
          <div className="nav" style={{ alignItems: 'center' }}>
           
            {/* Desktop CTA uses .nav to hide on mobile via CSS */}
            {isAuthenticated ? (
              <>
                <span className="muted" style={{ fontSize: '13px' }}>
                  {user?.name}
                </span>
                <button className="btn btnSoft" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link className="btn btnSoft" to="/login">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-menu-btn ${isMobileOpen ? 'open' : ''}`}
            onClick={toggleMobile}
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${isMobileOpen ? 'mobile-nav-open' : ''}`}>
       

        <MobileNavItem to="/" onClick={closeMobile}>Home</MobileNavItem>
        <MobileNavItem to="/movers-packers" onClick={closeMobile}>Movers</MobileNavItem>
        <MobileNavItem to="/car-rental" onClick={closeMobile}>Car Rental</MobileNavItem>
        <MobileNavItem to="/about" onClick={closeMobile}>About</MobileNavItem>
        <MobileNavItem to="/contact" onClick={closeMobile}>Contact</MobileNavItem>

        {isAuthenticated ? (
          <>
            {user?.role === 'admin' && (
              <MobileNavItem to="/admin" onClick={closeMobile}>Admin Panel</MobileNavItem>
            )}
            {user?.role === 'customer' && (
              <MobileNavItem to="/dashboard" onClick={closeMobile}>Dashboard</MobileNavItem>
            )}
            <button className="btn" style={{ width: '100%', marginTop: '1rem' }} onClick={handleLogout}>
              Logout ({user?.name.split(' ')[0]})
            </button>
          </>
        ) : (
          <Link className="btn" style={{ width: '100%', marginTop: '1rem' }} to="/login" onClick={closeMobile}>
            Login / Signup
          </Link>
        )}
      </div>
    </header>
  )
}


