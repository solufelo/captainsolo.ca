import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import reel from '../content/heroReel.json'
import { reducedMotion } from '../motion'

const pad = (n: number) => String(Math.floor(n)).padStart(2, '0')
// Camera-style timecode HH:MM:SS:FF at 24 fps.
const timecode = (s: number) => `${pad(s / 3600)}:${pad((s / 60) % 60)}:${pad(s % 60)}:${pad((s % 1) * 24)}`

/** The hero showreel inside the brand's viewfinder: REC light, running timecode, the project on screen, and a pause control. */
export function Viewfinder() {
  const video = useRef<HTMLVideoElement>(null)
  const [t, setT] = useState(0)
  const [rolling, setRolling] = useState(false)
  // Reduced motion: don't autoplay, offer a play button instead of a frozen frame.
  const [held, setHeld] = useState(false)

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (reducedMotion()) {
      v.pause()
      setHeld(true)
    } else {
      v.play().catch(() => setHeld(true))
    }
    let raf = 0
    let frame = -1
    const tick = () => {
      // Re-render when the 24 fps timecode changes, not on every refresh of a high-Hz screen.
      const f = Math.floor(v.currentTime * 24)
      if (f !== frame) {
        frame = f
        setT(v.currentTime)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
      setHeld(false)
    } else {
      v.pause()
    }
  }

  const clip = [...reel.clips].reverse().find((c) => t >= c.start) ?? reel.clips[0]

  return (
    <figure className="viewfinder" data-rolling={rolling}>
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="auto"
        poster={reel.poster}
        onPlaying={() => setRolling(true)}
        onPause={() => setRolling(false)}
        aria-label="Showreel: barbershop promo, club night and university basketball, shot and edited by Solomon"
      >
        <source src={reel.webm} type="video/webm" />
        <source src={reel.mp4} type="video/mp4" />
      </video>
      <span className="vf-corner tl" aria-hidden="true" />
      <span className="vf-corner tr" aria-hidden="true" />
      <span className="vf-corner br" aria-hidden="true" />
      <span className="vf-corner bl" aria-hidden="true" />
      {!held && <span className="vf-cross" aria-hidden="true" />}
      {held && !rolling && (
        <button type="button" className="vf-play" onClick={toggle}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
          Play reel
        </button>
      )}
      <figcaption className="vf-hud">
        <span className="vf-rec">
          <i aria-hidden="true" />
          {rolling ? 'REC' : 'STBY'}
          <span className="vf-tc">{timecode(t)}</span>
        </span>
        <Link to={`/work/${clip.slug}`} className="vf-clip">
          {clip.label} <span aria-hidden="true">↗</span>
        </Link>
      </figcaption>
      <button type="button" className="vf-toggle" onClick={toggle} aria-label={rolling ? 'Pause showreel' : 'Play showreel'}>
        <svg viewBox="0 0 24 24" aria-hidden="true">{rolling ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}</svg>
      </button>
    </figure>
  )
}
