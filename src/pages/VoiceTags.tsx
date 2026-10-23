import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { site } from '../content/site'
import { faq, packages, perks, samples, styles } from '../content/voicetags'
import { posts } from '../content/posts'
import { PostCard } from '../components/PostCard'
import { ContactSection } from '../components/ContactForm'

function SamplePlayer() {
  // One shared <audio>: starting a sample stops whichever one was playing.
  const audio = useRef<HTMLAudioElement>(null)
  const [current, setCurrent] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const a = audio.current
    if (!a) return
    const tick = () => setProgress(a.duration ? a.currentTime / a.duration : 0)
    const end = () => {
      setCurrent(null)
      setProgress(0)
    }
    a.addEventListener('timeupdate', tick)
    a.addEventListener('ended', end)
    return () => {
      a.removeEventListener('timeupdate', tick)
      a.removeEventListener('ended', end)
    }
  }, [])

  const toggle = (src: string) => {
    const a = audio.current
    if (!a) return
    if (current === src) {
      a.pause()
      setCurrent(null)
      return
    }
    a.src = src
    setProgress(0)
    setCurrent(src)
    a.play().catch(() => setCurrent(null))
  }

  return (
    <>
      <audio ref={audio} preload="none" />
      <ul className="sample-grid">
        {samples.map((s) => {
          const on = current === s.src
          return (
            <li key={s.name} className="sample" data-playing={on}>
              <button type="button" className="sample-play" onClick={() => toggle(s.src)} aria-label={`${on ? 'Pause' : 'Play'} ${s.name} tag`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {on ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
                </svg>
              </button>
              <div className="sample-text">
                <p className="sample-name">{s.name}</p>
                <p className="sample-phrase">“{s.phrase}”</p>
                <p className="sample-note">
                  {s.style} · {s.type}
                </p>
              </div>
              <span className="sample-bar" style={{ transform: `scaleX(${on ? progress : 0})` }} aria-hidden="true" />
            </li>
          )
        })}
      </ul>
    </>
  )
}

export function VoiceTags() {
  const guides = posts.filter((p) => p.category === 'Music Production')
  return (
    <div className="page">
      <header className="page-head wrap vt-hero">
        <p className="kicker">Voice tags · producer tags · DJ drops</p>
        <h1 className="page-title">Make your beats instantly recognizable</h1>
        <p className="lead">Single tags recorded, mixed and mastered in 24 hours; the Brand Pack in 48. Wet and dry versions, full commercial rights.</p>
        <div className="hero-ctas">
          <a className="btn" href={site.airgigs.tag} target="_blank" rel="noopener noreferrer">
            Order on AirGigs
          </a>
          <a className="btn btn-ghost" href="#samples">
            Listen to samples
          </a>
        </div>
      </header>

      <section id="samples" className="section-tight wrap" aria-labelledby="samples-title">
        <h2 id="samples-title" className="section-title small">
          Real tags delivered to clients
        </h2>
        <SamplePlayer />
      </section>

      <section className="section wrap" aria-labelledby="perks-title">
        <h2 id="perks-title" className="section-title small">
          What you get
        </h2>
        <ul className="perk-grid">
          {perks.map((p) => (
            <li key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section section-alt" aria-labelledby="styles-title">
        <div className="wrap">
          <h2 id="styles-title" className="section-title small">
            Styles
          </h2>
          <ul className="style-grid">
            {styles.map((s) => (
              <li key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.body}</p>
                <dl>
                  <div>
                    <dt>Best for</dt>
                    <dd>{s.bestFor}</dd>
                  </div>
                  <div>
                    <dt>Energy</dt>
                    <dd>{s.energy} / 10</dd>
                  </div>
                </dl>
                <p className="style-example">{s.example}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="pricing-title">
        <h2 id="pricing-title" className="section-title small">
          Packages
        </h2>
        <ul className="price-grid">
          {packages.map((p) => (
            <li key={p.name} className="price" data-popular={p.popular ?? false}>
              {p.popular && <p className="price-flag">Most complete</p>}
              <h3>{p.name}</h3>
              <p className="price-amount">
                ${p.price}
                <span>USD</span>
              </p>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className={p.popular ? 'btn' : 'btn btn-ghost'} href={site.airgigs[p.order]} target="_blank" rel="noopener noreferrer">
                Order on AirGigs
              </a>
            </li>
          ))}
        </ul>
        <p className="muted small also-on">
          Both are sold through AirGigs, which handles payment and delivery. Need something custom? <a href="#contact">Ask me directly</a>.
        </p>
      </section>

      <section className="section section-alt" aria-labelledby="faq-title">
        <div className="wrap narrow">
          <h2 id="faq-title" className="section-title small">
            Questions
          </h2>
          <div className="faq">
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="guides-title">
        <header className="section-head row">
          <h2 id="guides-title" className="section-title small">
            Voice-tag guides
          </h2>
          <Link to="/blog" className="arrow-link">
            All articles
          </Link>
        </header>
        <ul className="post-grid">
          {guides.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </section>

      <ContactSection defaultService="Voice tag" />
    </div>
  )
}
