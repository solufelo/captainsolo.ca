import { Link } from 'react-router'
import { brandPackages, process, retainers } from '../content/site'

const contactFor = (service: string, pkg: string) =>
  `/contact?service=${encodeURIComponent(service)}&package=${encodeURIComponent(pkg)}`

export function Packages() {
  return (
    <section id="packages" className="section section-alt" aria-labelledby="packages-title">
      <div className="wrap">
        <header className="section-head">
          <p className="kicker">For businesses & creators</p>
          <h2 id="packages-title" className="section-title">
            Brand packages
          </h2>
          <p className="lead">Photos, video and a website from one person: shot, built and launched together, so it all looks like you.</p>
        </header>

        <ol className="process" aria-label="How it works">
          {process.map((p, i) => (
            <li key={p.step}>
              <span className="process-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.step}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>

        <ul className="package-grid">
          {brandPackages.map((p) => (
            <li key={p.id} className="package" data-featured={p.featured ?? false}>
              {p.featured && <p className="price-flag">Most complete</p>}
              <h3>{p.name}</h3>
              <p className="package-tagline">{p.tagline}</p>
              <ul>
                {p.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="package-quote">Quoted after a short call</p>
              <Link to={contactFor(p.id === 'Shoot' ? 'Photo / video shoot' : 'Brand package', p.name)} className={p.featured ? 'btn' : 'btn btn-ghost'}>
                Ask about {p.name}
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="group-label after-launch">After launch</h3>
        <div className="care-grid">
          {retainers.map((r) => (
            <div key={r.name} className="care">
              <div>
                <h3>{r.name}</h3>
                <p className="muted">{r.tagline}</p>
              </div>
              <ul>
                {r.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
