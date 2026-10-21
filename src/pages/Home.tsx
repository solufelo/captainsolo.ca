import { Link } from 'react-router'
import { Hero } from '../components/Hero'
import { Orb } from '../components/Orb'
import { Strip } from '../components/Strip'
import { WorkList } from '../components/WorkList'
import { getProject, offers, projects, type Project } from '../content/site'

// The home list mixes music video, design, sites, a local business and photography; the rest is on /work.
const featured = ['ten-fold', 'laurier-gameday', 'velare', 'tec', 'savyan-salon', 'suburbia', 'july-6', 'koldhearted-lookbook'].map(
  (s) => getProject(s) as Project,
)
// Stills slide past between the work and the services: photos on top, design underneath.
const stills = (...slugs: string[]) => slugs.flatMap((s) => getProject(s)?.gallery ?? [])
const stripRows: [string[], string[]] = [
  stills('koldhearted-lookbook', 'photo-selects'),
  stills('cover-art', 'laurier-gameday').filter((s) => !/scorebug|spotlight|touchdown|crest/.test(s)),
]

export function Home() {
  return (
    <>
      <Hero />

      <section className="wrap intro" aria-label="What I do">
        <p className="intro-line" data-reveal>
          Websites, photos and video for businesses across the GTA. Shot, built and launched by one person.
        </p>
        <div className="intro-side" data-reveal>
          <p>Code it. Film it. Ship it.</p>
          <Orb to="/contact">Get a quote</Orb>
        </div>
      </section>

      <section id="work" className="wrap home-work" aria-labelledby="work-title">
        <h2 id="work-title" className="label">
          Recent work
        </h2>
        <WorkList items={featured} />
        <div className="more-row">
          <Link to="/work" className="pill-link">
            All work <sup>{projects.length}</sup>
          </Link>
        </div>
      </section>

      <Strip rows={stripRows} />

      <section className="wrap offers" aria-labelledby="offers-title">
        <h2 id="offers-title" className="label">
          Services
        </h2>
        <ol>
          {offers.map((o, i) => (
            <li key={o.title} data-reveal>
              <span className="offer-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{o.title}</h3>
              <p>{o.line}</p>
            </li>
          ))}
        </ol>
        <Link to="/services" className="arrow-link">
          Packages
        </Link>
      </section>
    </>
  )
}
