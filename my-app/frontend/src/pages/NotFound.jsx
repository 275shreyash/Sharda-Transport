import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <div className="pageHead">
          <h1 className="pageTitle">Page not found</h1>
          <p className="muted">The page you’re looking for doesn’t exist.</p>
          <div className="pageCtas">
            <Link className="btn" to="/">
              Go home
            </Link>
            <Link className="btn btnSoft" to="/contact">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


