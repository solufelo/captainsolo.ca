import { Link } from 'react-router'
import { Packages } from '../components/Packages'

export function ServicesPage() {
  return (
    <div className="page">
      <header className="page-head wrap">
        <p className="label">For businesses & creators</p>
        <h1 className="page-title">Services</h1>
        {/* the same area the search data (src/meta.ts areaServed) and the Business Profile list */}
        <p className="lead">Based in Brampton, shooting across Peel, the GTA and Kitchener-Waterloo.</p>
        <nav className="service-links" aria-label="Services">
          <Link to="/services/video" className="pill-link">
            Video
          </Link>
          <Link to="/services/music-videos" className="pill-link">
            Music videos
          </Link>
          <Link to="/services/websites" className="pill-link">
            Websites
          </Link>
        </nav>
      </header>
      <Packages />
    </div>
  )
}
