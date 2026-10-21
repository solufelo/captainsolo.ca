import { useEffect, useRef } from 'react'
import { site } from '../content/site'
import { Viewfinder } from './Viewfinder'
import { reducedMotion } from '../motion'

/** The name slides across the bottom of the reel; scrolling up reverses it. Still for reduced motion. */
function Marquee({ text }: { text: string }) {
  const track = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = track.current
    if (!el || reducedMotion()) return
    let x = 0
    let dir = -1
    let last = scrollY
    let raf = 0
    const onScroll = () => {
      if (scrollY !== last) dir = scrollY > last ? -1 : 1
      last = scrollY
    }
    const tick = () => {
      // Two copies of the text: wrapping at -50% is seamless.
      x = (((x + dir * 0.045) % 50) - 50) % 50
      el.style.transform = `translate3d(${x}%, 0, 0)`
      raf = requestAnimationFrame(tick)
    }
    addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <span className="marquee" aria-hidden="true">
      <span ref={track}>
        <span>{text}</span>
        <span>{text}</span>
      </span>
    </span>
  )
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Viewfinder />
      <div className="hero-copy">
        <p className="hero-based">
          <span>
            Based in
            <br />
            Brampton, Canada
          </span>
          <span className="globe" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <ellipse className="globe-a" cx="12" cy="12" rx="4.5" ry="9" />
              <ellipse className="globe-b" cx="12" cy="12" rx="4.5" ry="9" />
              <path d="M3 12h18M4.6 7.5h14.8M4.6 16.5h14.8" />
            </svg>
          </span>
        </p>
        <p className="hero-role">
          Videographer &<br />
          web developer
        </p>
      </div>
      <h1 id="hero-title" className="hero-name">
        <span className="sr-only">{site.name}, videographer and web developer</span>
        <Marquee text={`${site.name} —`} />
      </h1>
    </section>
  )
}
