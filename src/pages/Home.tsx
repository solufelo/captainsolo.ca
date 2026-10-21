import { Link } from 'react-router'
import { Hero } from '../components/Hero'
import { Orb } from '../components/Orb'
import { Strip } from '../components/Strip'
import { WorkList } from '../components/WorkList'
import { bookCall, faqs, getProject, offers, pains, process, projects, type Project } from '../content/site'

// Business clients first (the people this page is for), then range: 3D, a shop, a music video.
const featured = ['savyan-salon', 'barbershop-promo', 'koldhearted-lookbook', 'solvra', 'laurier-gameday', 'velare', 'suburbia', 'tec'].map(
  (s) => getProject(s) as Project,
)
// Stills slide past between the work and the services: photos on top, design underneath.
const stills = (...slugs: string[]) => slugs.flatMap((s) => getProject(s)?.gallery ?? [])
const stripRows: [string[], string[]] = [
  stills('koldhearted-lookbook', 'photo-selects'),
  stills('cover-art', 'laurier-gameday').filter((s) => !/scorebug|spotlight|touchdown|crest/.test(s)),
]
const n = (i: number) => String(i + 1).padStart(2, '0')

export function Home() {
  return (
    <>
      <Hero />

      <section className="wrap problem" aria-labelledby="problem-title">
        <p className="label">Sound familiar?</p>
        <h2 id="problem-title" className="problem-title" data-reveal>
          Your business is better than it looks online.
        </h2>
        <ul className="pains">
          {pains.map((p) => (
            <li key={p} data-reveal>
              {p}
            </li>
          ))}
        </ul>
        <div className="problem-answer" data-reveal>
          <p>I do all three: the shoot, the site and the upkeep, so it all looks like you.</p>
          <Orb to={bookCall}>Book a call</Orb>
        </div>
      </section>

      <section id="work" className="wrap home-work" aria-labelledby="work-title">
        <h2 id="work-title" className="label">
          Results
        </h2>
        <WorkList items={featured} />
        <div className="more-row">
          <Link to="/work" className="pill-link">
            All work <sup>{projects.length}</sup>
          </Link>
        </div>
      </section>

      <Strip rows={stripRows} />

      <section className="wrap steps" aria-labelledby="offers-title">
        <h2 id="offers-title" className="label">
          Services
        </h2>
        <ol>
          {offers.map((o, i) => (
            <li key={o.title} data-reveal>
              <span className="step-n">{n(i)}</span>
              <h3>{o.title}</h3>
              <p>{o.line}</p>
            </li>
          ))}
        </ol>
        <Link to="/services" className="arrow-link">
          Packages
        </Link>
      </section>

      <section className="wrap steps" aria-labelledby="process-title">
        <h2 id="process-title" className="label">
          How it works
        </h2>
        <ol>
          {process.map((p, i) => (
            <li key={p.step} data-reveal>
              <span className="step-n">{n(i)}</span>
              <h3>{p.step}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="label">
          Questions
        </h2>
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
    </>
  )
}
