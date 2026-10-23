import { Link } from 'react-router'
import { Credits } from '../components/Credits'
import { WorkList } from '../components/WorkList'
import { bookCall, credits, projects } from '../content/site'

const videos = projects.filter((p) => p.kind === 'Music video')

const steps = [
  { title: 'Call', body: 'The song, the look you have in mind, the dates and the budget.' },
  { title: 'Shoot', body: 'I direct and shoot on location: streets, studios, rooftops, wherever the song lives.' },
  { title: 'Edit and finish', body: 'Cut, colour, titles and VFX, finished for YouTube and your socials.' },
]

/** The music-video service page: the work first, then how a video gets made and how to start. */
export function MusicVideos() {
  return (
    <div className="page">
      <header className="page-head wrap">
        <p className="label">Music videos · {videos.length}</p>
        <h1 className="page-title">Music videos for Brampton and GTA artists</h1>
        <p className="lead">
          I direct, shoot and edit music videos: night shoots lit by headlights, camcorder tape, golden-hour handheld and film-gate finishes.
          {` ${videos.length} videos below, ${credits.length} more credits on YouTube.`}
        </p>
      </header>
      <section className="wrap" aria-labelledby="videos-title">
        <h2 id="videos-title" className="sr-only">
          Videos
        </h2>
        <WorkList items={videos} byClient />
      </section>
      <section className="wrap steps" aria-labelledby="how-title">
        <h2 id="how-title" className="label">
          How a video gets made
        </h2>
        <ol>
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="muted">
          Every video is quoted after a short call. Rated by FACTOR? Its{' '}
          <a href="https://www.factor.ca/programs/artist-programs/video/" target="_blank" rel="noopener noreferrer">
            Video program
          </a>{' '}
          can cover half the budget.
        </p>
        <div className="about-ctas">
          <Link to={bookCall} className="btn">
            Book a call
          </Link>
          <Link to="/contact?service=Music%20video" className="btn btn-ghost">
            Ask about a music video
          </Link>
        </div>
      </section>
      <div className="wrap">
        <Credits />
      </div>
    </div>
  )
}
