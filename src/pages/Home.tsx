import { useEffect, useRef, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { Hero } from '../components/Hero'
import { Orb } from '../components/Orb'
import { Clients, Strip, useCover, useLit } from '../components/Strip'
import { WorkList } from '../components/WorkList'
import { bookCall, clients, faqs, getProject, offers, pains, process, projects, type Project } from '../content/site'
import { reducedMotion } from '../motion'

// Business clients first (the people this page is for), then range: 3D, a shop, a music video.
const featured = ['barbershop-promo', 'koldhearted-lookbook', 'solvra', 'vair-drop', 'laurier-gameday', 'velare', 'suburbia', 'tec'].map(
  (s) => getProject(s) as Project,
)
// Vertical reels: the format barbershops, salons and promoters actually post.
const reels = ['barbershop-promo', 'barbershop-braids', 'sevynn-salon', 'club-event', 'laurier-basketball'].map((s) => getProject(s) as Project)
// Stills slide past between the work and the services: photos on top, design underneath (gallery loops stay on their case page).
const stills = (...slugs: string[]) => slugs.flatMap((s) => getProject(s)?.gallery ?? []).filter((s) => !s.endsWith('.mp4'))
const stripRows: [string[], string[]] = [
  stills('koldhearted-lookbook', 'photo-selects'),
  stills('cover-art', 'laurier-gameday').filter((s) => !/broadcast|crest/.test(s)),
]
const n = (i: number) => String(i + 1).padStart(2, '0')
const vars = (v: Record<string, number>) => v as CSSProperties

/** Each word lights up in turn as the heading rises up the screen (--p from useLit, --i per word). */
function LitWords({ text }: { text: string }) {
  const words = text.split(' ')
  return words.map((w, i) => (
    <span key={i} className="w" style={vars({ '--i': i })}>
      {w}{' '}
    </span>
  ))
}

/** A row of vertical promos that play only while on screen; reduced motion keeps their first frame. */
function Reels({ items }: { items: Project[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const quote = items.find((p) => p.quote)?.quote // one client's words under the reels; the rest live on their case pages
  useEffect(() => {
    const videos = ref.current?.querySelectorAll('video')
    if (!videos || reducedMotion()) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? (e.target as HTMLVideoElement).play().catch(() => {}) : (e.target as HTMLVideoElement).pause())),
      { threshold: 0.25 },
    )
    videos.forEach((v) => io.observe(v))
    return () => io.disconnect()
  }, [])
  return (
    <section className="reels" aria-labelledby="reels-title">
      <h2 id="reels-title" className="label wrap">
        Reels
      </h2>
      <div ref={ref} className="reels-row">
        {items.map((p) => (
          <Link key={p.slug} to={`/work/${p.slug}`} className="reel-card" aria-label={p.title} data-cursor="View">
            {/* iOS shows nothing before play without a poster: each preview has a first-frame .webp beside it */}
            <video src={p.preview} poster={p.preview?.replace(/\.mp4$/, '.webp')} muted loop playsInline preload="none" aria-hidden="true" />
          </Link>
        ))}
      </div>
      {quote && (
        <blockquote className="wrap reels-quote">
          <p>“{quote.text}”</p>
          <footer>{quote.by}</footer>
        </blockquote>
      )}
    </section>
  )
}

export function Home() {
  const stage = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  useCover(stage)
  useLit(title)
  const problemTitle = 'Your business is better than it looks online.'
  return (
    <>
      {/* The reel pins while the problem slides up over it on its own sheet. */}
      <div ref={stage} className="hero-stage">
        <Hero />
        <div className="hero-sheet">
          <section className="wrap problem" aria-labelledby="problem-title">
            <p className="label">Sound familiar?</p>
            <h2 ref={title} id="problem-title" className="problem-title" style={vars({ '--n': problemTitle.split(' ').length })}>
              <LitWords text={problemTitle} />
            </h2>
            <ul className="pains">
              {pains.map((p, i) => (
                <li key={p} data-reveal style={vars({ '--i': i })}>
                  {p}
                </li>
              ))}
            </ul>
            <div className="problem-answer" data-reveal>
              <p>I do all three: the shoot, the site and the upkeep, so it all looks like you.</p>
              <Orb to={bookCall}>Book a call</Orb>
            </div>
          </section>
        </div>
      </div>

      <Clients names={clients} />

      <section id="work" className="wrap home-work" aria-labelledby="work-title">
        <h2 id="work-title" className="label">
          Results
        </h2>
        <WorkList items={featured} />
        <div className="more-row">
          <Link to="/work" className="pill-link" data-magnetic="0.25">
            All work <sup>{projects.length}</sup>
          </Link>
        </div>
      </section>

      <Reels items={reels} />

      <Strip rows={stripRows} />

      <section className="wrap steps" aria-labelledby="offers-title">
        <h2 id="offers-title" className="label">
          Services
        </h2>
        <ol>
          {offers.map((o, i) => (
            <li key={o.title} data-reveal style={vars({ '--i': i })}>
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

      {/* Each step pins a little lower than the last, so they stack like file tabs. */}
      <section className="wrap steps deck" aria-labelledby="process-title">
        <h2 id="process-title" className="label">
          How it works
        </h2>
        <ol>
          {process.map((p, i) => (
            <li key={p.step} style={vars({ '--i': i })}>
              <span className="step-n">{n(i)}</span>
              <h3>{p.step}</h3>
              <p>{p.body}</p>
              <img src={p.image} alt={p.alt} loading="lazy" />
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
