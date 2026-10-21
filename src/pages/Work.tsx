import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { bookCall, getProject, projects } from '../content/site'
import { Orb } from '../components/Orb'
import { NotFound } from './NotFound'
import { reducedMotion } from '../motion'

const external = (href: string) => !href.startsWith('/')

/** The silent loop at the top of a video case study: plays on its own unless the visitor prefers reduced motion. */
function Loop({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (!reducedMotion()) ref.current?.play().catch(() => {})
  }, [src])
  return (
    <figure className="case-loop">
      <video ref={ref} key={src} src={src} poster={poster} muted loop playsInline controls preload="metadata" />
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
  return <video ref={ref} src={src} poster={src.replace(/\.mp4$/, '.webp')} muted loop playsInline preload="none" aria-label={label} data-reveal />
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
            <dd>{project.tags.join(' · ')}</dd>
          </div>
          {(demo || source) && (
            <div>
              <dt>Links</dt>
              <dd className="case-links">
                {demo && (
                  <a href={demo.href} {...(external(demo.href) && { target: '_blank', rel: 'noopener noreferrer' })}>
                    {demo.label} ↗
                  </a>
                )}
                {source && (
                  <a href={source} target="_blank" rel="noopener noreferrer">
                    Source ↗
                  </a>
                )}
              </dd>
            </div>
          )}
        </dl>
      </header>

      {project.loop && <Loop src={project.loop} poster={project.poster ?? project.image} />}
      {project.clips && (
        <section className="case-clips" aria-label="More clips">
          {project.clips.map((c) => (
            <figure key={c.src} className="case-clip">
              <video src={c.src} poster={c.poster} controls playsInline preload="none" />
              <figcaption>{c.title}</figcaption>
            </figure>
          ))}
        </section>
      )}
      <section className="case-media" data-layout={project.layout} aria-label="The work">
        {project.video ? (
          <figure className="case-video">
            <video src={project.video} poster={project.image} controls playsInline preload="metadata" />
          </figure>
        ) : (
          gallery.map((src, n) => {
            const alt = `${project.title}, ${project.layout ? 'piece' : 'screen'} ${n + 1}`
            return src.endsWith('.mp4') ? (
              <GalleryLoop key={src} src={src} label={alt} />
            ) : (
              <img
                key={src}
                src={src}
                alt={alt}
                loading={n === 0 ? 'eager' : 'lazy'}
                {...(!project.layout && { width: 1440, height: 900 })}
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
          <img src={next.image} alt="" width="800" height="500" loading="lazy" />
        </Link>
        <Orb to="/work">All work</Orb>
      </nav>
      <BookBar />
    </article>
  )
}
