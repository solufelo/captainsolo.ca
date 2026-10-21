import { useEffect, useRef } from 'react'
import { site } from '../content/site'
import { Viewfinder } from './Viewfinder'

/** The name slides across the bottom of the reel; scrolling up reverses it. Still for reduced motion. */
function Marquee({ text }: { text: string }) {
  const track = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = track.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
          <span className="dot" /> Based in Brampton, ON
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
