import { Link, useParams } from 'react-router'
import { getProject, projects } from '../content/site'
import { CopyEmail } from '../components/CopyEmail'
import { WorkCard } from '../components/WorkGrid'
import { NotFound } from './NotFound'

export function Work() {
  const project = getProject(useParams().slug ?? '')
  if (!project) return <NotFound />
  const i = projects.indexOf(project)
  const next = projects[(i + 1) % projects.length]
  const gallery = project.gallery ?? [project.image]

  return (
    <article className="page case">
      <header className="page-head wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/#work">Work</Link>
          <span aria-hidden="true">/</span>
          <span>{project.client}</span>
        </nav>
        <h1 className="page-title">{project.title}</h1>
        <dl className="case-facts">
          <div>
            <dt>For</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt>My part</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{project.status === 'live' ? 'Live' : 'In progress'}</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>{project.tags.join(', ')}</dd>
          </div>
        </dl>
        <div className="hero-ctas">
          {project.demo &&
            (project.demo.href.startsWith('/') ? (
              <Link to={project.demo.href} className="btn">
                {project.demo.label}
              </Link>
            ) : (
              <a href={project.demo.href} className="btn" target="_blank" rel="noopener noreferrer">
                {project.demo.label}
              </a>
            ))}
          {project.source && (
            <a href={project.source} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
              Source on GitHub
            </a>
          )}
        </div>
      </header>

      <section className="wrap case-overview" aria-label="Overview">
        <div>
          <h2>What it is</h2>
          <p>{project.overview.what}</p>
        </div>
        <div>
          <h2>The problem</h2>
          <p>{project.overview.problem}</p>
        </div>
        <div>
          <h2>What changed</h2>
          <p>{project.overview.outcome}</p>
        </div>
      </section>

      <section className="wrap case-gallery" aria-label="The work">
        {project.video ? (
          <figure className="case-video">
            <video src={project.video} poster={project.image} controls playsInline preload="metadata" />
            <figcaption>Vertical cut, as delivered.</figcaption>
          </figure>
        ) : (
          gallery.map((src, n) => <img key={src} src={src} alt={`${project.title}, screen ${n + 1}`} loading={n === 0 ? 'eager' : 'lazy'} width="1440" height="900" data-reveal />)
        )}
      </section>

      <section className="wrap case-next" aria-labelledby="next-title">
        <div className="section-head row">
          <h2 id="next-title" className="section-title small">
            Next project
          </h2>
          <Link to="/#work" className="arrow-link">
            All work
          </Link>
        </div>
        <ul className="work-grid">
          <WorkCard p={next} featured />
        </ul>
      </section>

      <section className="wrap case-cta" aria-label="Get in touch">
        <h2 className="section-title small">Want something like this?</h2>
        <p className="lead">Tell me what you’re building. I reply within 1–2 business days.</p>
        <div className="hero-ctas">
          <CopyEmail />
          <Link to="/contact" className="btn btn-ghost">
            Use the form
          </Link>
        </div>
      </section>
    </article>
  )
}
