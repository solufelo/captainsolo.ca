import { Link } from 'react-router'
import { projects, site } from '../content/site'
import { CopyEmail } from './CopyEmail'
import { Viewfinder } from './Viewfinder'

// Work teased above the fold: a mix of sites and reels, in the order they appear in the grid.
const teased = ['barbershop-promo', 'suburbia', 'mens-basketball', 'velare', 'godways-ministry'].map((s) => projects.find((p) => p.slug === s)!)

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="pill">
            <span className="dot" /> Available for work · Brampton, ON
          </p>
          <h1 id="hero-title" className="hero-title">
            <span>Code it.</span>
            <span>Film it.</span>
            <span>Ship it.</span>
          </h1>
          <p className="hero-sub">
            {site.name}: websites, and the photos and video that fill them, for businesses in Brampton and the GTA. One person from first call to launch, so it all looks like you.
          </p>
          <div className="hero-ctas">
            <CopyEmail />
            <Link to="/#work" className="btn btn-ghost">
              See the work
            </Link>
          </div>
        </div>
        <Viewfinder />
      </div>

      <div className="wrap hero-tease" aria-label="Selected work">
        <ul>
          {teased.map((p) => (
            <li key={p.slug}>
              <Link to={`/work/${p.slug}`}>
                <img src={p.image} alt={p.title} width="320" height="200" loading="eager" />
                <span>{p.title}</span>
              </Link>
            </li>
          ))}
          <li className="tease-more">
            <Link to="/#work">
              All {projects.length} projects <span aria-hidden="true">↓</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
