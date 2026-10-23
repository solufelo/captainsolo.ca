import { Link } from 'react-router'

export function NotFound() {
  return (
    <div className="page wrap not-found">
      <p className="kicker">404</p>
      <h1 className="page-title">Lost in orbit</h1>
      <p className="lead">That page doesn’t exist, or it moved in the rebuild.</p>
      <div className="hero-ctas">
        <Link to="/" className="btn">
          Back home
        </Link>
        <Link to="/work" className="btn btn-ghost">
          See the work
        </Link>
      </div>
    </div>
  )
}
