import { WorkGrid } from '../components/WorkGrid'
import { credits, projects } from '../content/site'

export function WorkIndex() {
  return (
    <div className="page wrap">
      <header className="page-head">
        <p className="label">Selected work · {projects.length}</p>
        <h1 className="page-title">Work</h1>
      </header>
      <h2 className="sr-only">Projects</h2>
      <WorkGrid />
      <section className="credits" aria-labelledby="credits-title" data-reveal>
        <p className="label">On YouTube · {credits.length}</p>
        <h2 id="credits-title" className="section-title small">
          More credits
        </h2>
        <ul className="credit-list">
          {credits.map((c) => (
            <li key={c.href}>
              <a href={c.href} className="credit" target="_blank" rel="noopener noreferrer">
                <span className="credit-title">{c.title}</span>
                <span className="credit-artist">{c.artist}</span>
                <span className="credit-role">{c.role}</span>
                <span className="credit-year">{c.year}</span>
                <span className="credit-go" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
