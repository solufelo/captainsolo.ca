import { Packages } from '../components/Packages'

export function ServicesPage() {
  return (
    <div className="page">
      <header className="page-head wrap">
        <p className="label">For businesses & creators</p>
        <h1 className="page-title">Services</h1>
        {/* the same area the search data (src/meta.ts areaServed) and the Business Profile list */}
        <p className="lead">Based in Brampton, shooting across Peel, the GTA and Kitchener-Waterloo.</p>
      </header>
      <Packages />
    </div>
  )
}
