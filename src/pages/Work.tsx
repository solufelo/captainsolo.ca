import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { bookCall, getProject, phoneSrcSet, projects, sizeOf } from '../content/site'
import { Orb } from '../components/Orb'
import { YouTube } from '../components/YouTube'
import alts from '../content/alts.json'
import { NotFound } from './NotFound'
import { reducedMotion } from '../motion'

const external = (href: string) => !href.startsWith('/')
// Phones get the lighter cut scripts/phone_media.py writes beside every loop; <source media> picks before anything downloads.
const PHONE = '(max-width: 760px)'
const phoneCut = (src: string) => src.replace(/\.mp4$/, '-phone.mp4')
// How wide each gallery layout shows a still (.case-media in styles.css), so srcset can pick the phone copy.
const shownAt = { screens: '100vw', grid: '(max-width: 700px) 100vw, 50vw', dense: '(max-width: 760px) 50vw, 25vw' }

/** The silent loop at the top of a video case study: plays on its own unless the visitor prefers reduced motion. */
function Loop({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (!reducedMotion()) ref.current?.play().catch(() => {})
  }, [src])
  return (
    <figure className="case-loop">
      <video ref={ref} key={src} poster={poster} muted loop playsInline controls preload="metadata" aria-label={label}>
        <source media={PHONE} src={phoneCut(src)} type="video/mp4" />
        <source src={src} type="video/mp4" />
      </video>
    </figure>
  )
}

/** A silent loop that sits in the gallery like a still: plays while on screen, never for reduced motion. Its poster is the .webp beside it. */
function GalleryLoop({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v || reducedMotion()) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()))
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <video ref={ref} poster={src.replace(/\.mp4$/, '.webp')} muted loop playsInline preload="none" aria-label={label} data-reveal>
      <source media={PHONE} src={phoneCut(src)} type="video/mp4" />
      <source src={src} type="video/mp4" />
    </video>
  )
}

/** "Want this for your business?" pinned to the bottom once the case header scrolls away; gone again when the footer CTA shows. */
function BookBar() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    let footerIn = false
    const update = () => setShown(scrollY > 480 && !footerIn)
    const footer = document.querySelector('.site-footer')
    const io = new IntersectionObserver(([e]) => ((footerIn = e.isIntersecting), update()))
    if (footer) io.observe(footer)
    addEventListener('scroll', update, { passive: true })
    return () => {
      io.disconnect()
      removeEventListener('scroll', update)
    }
  }, [])
  return (
    <aside className="book-bar" data-shown={shown} inert={!shown} aria-label="Book a call">
      <p>Want this for your business?</p>
      <Link to={bookCall} className="btn btn-sm">
        Book a call
      </Link>
    </aside>
  )
}

export function Work() {
  const project = getProject(useParams().slug ?? '')
  if (!project) return <NotFound />
  const next = projects[(projects.indexOf(project) + 1) % projects.length]
  const gallery = project.gallery ?? [project.image]
  const { demo, source } = project
  // A YouTube watch link also gets the full video played here (the id is its ?v=).
  const youTube = demo?.href.match(/^https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})(?:&|$)/)?.[1]

  return (
    <article className="case">
      <header className="wrap case-head">
        <h1 className="case-title">{project.title}</h1>
        <p className="case-summary">{project.summary}</p>
        <dl className="case-meta">
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>For</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt>Built with</dt>
            {/* non-breaking spaces keep "Sony A6100" or "New York" on one line on a phone */}
            <dd>{project.tags.map((t) => t.replaceAll(' ', '\u00a0')).join(' · ')}</dd>
          </div>
          {(demo || source) && (
            <div>
              <dt>Links</dt>
              <dd className="case-links">
                {demo && (
                  <a href={demo.href} {...(external(demo.href) && { target: '_blank', rel: 'noopener noreferrer' })}>
                    {demo.label}&nbsp;↗
                  </a>
                )}
                {source && (
                  <a href={source} target="_blank" rel="noopener noreferrer">
                    Source&nbsp;↗
                  </a>
                )}
              </dd>
            </div>
          )}
        </dl>
      </header>

      {project.quote && (
        <blockquote className="wrap case-quote">
          <p>“{project.quote.text}”</p>
          <footer>{project.quote.by}</footer>
        </blockquote>
      )}
      {project.loop && <Loop src={project.loop} poster={project.poster ?? project.image} label={`${project.title}, silent loop`} />}
      {/* keyed, so "Next" to another video shows its poster again instead of autoplaying it */}
      {youTube && <YouTube key={youTube} id={youTube} title={project.title} poster={project.poster ?? project.image} />}
      {project.clips && (
        <section className="case-clips" aria-label="More clips">
          {project.clips.map((c) => (
            <figure key={c.src} className="case-clip">
              <video src={c.src} poster={c.poster} controls playsInline preload="none" aria-label={c.title} />
              <figcaption>
                {c.title} <span className="case-sound">· {c.sound}</span>
              </figcaption>
            </figure>
          ))}
        </section>
      )}
      <section className="case-media" data-layout={project.layout} aria-label="The work">
        {project.video ? (
          <figure className="case-video">
            <video src={project.video} poster={project.poster ?? project.image} controls playsInline preload="none" aria-label={`${project.title}, full video`} />
            {project.sound && <figcaption className="case-sound">{project.sound}</figcaption>}
          </figure>
        ) : (
          gallery.map((src, n) => {
            // alts.json describes each still; a new image without one falls back to its place in the gallery
            const alt = (alts as Record<string, string>)[src] ?? `${project.title}, ${project.layout ? 'piece' : 'screen'} ${n + 1}`
            if (src.endsWith('.mp4')) return <GalleryLoop key={src} src={src} label={alt} />
            // screens without a known size are 16:10
            const [w, h] = sizeOf(src) ?? (project.layout ? [] : [1440, 900])
            return (
              <img
                key={src}
                src={src}
                srcSet={phoneSrcSet(src)}
                sizes={shownAt[project.layout ?? 'screens']}
                width={w}
                height={h}
                alt={alt}
                loading={n === 0 ? 'eager' : 'lazy'}
                data-reveal
              />
            )
          })
        )}
      </section>

      <nav className="wrap case-next" aria-label="Next project">
        <Link to={`/work/${next.slug}`} data-cursor="Next">
          <span className="label">Next</span>
          <span className="case-next-title">{next.title}</span>
          <img src={next.image} srcSet={phoneSrcSet(next.image)} sizes="(max-width: 760px) 100vw, 260px" alt="" width="800" height="500" loading="lazy" />
        </Link>
        <Orb to="/work">All work</Orb>
      </nav>
      <BookBar />
    </article>
  )
}
