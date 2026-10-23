import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import reel from '../content/heroReel.json'
import { reducedMotion } from '../motion'

// Upright screens (phones, tablets held tall) get the 9:16 cut; <source media> picks before anything downloads.
// The same query swaps the poster in CSS (styles.css), since a video's poster attribute can't vary by screen.
const TALL = '(max-aspect-ratio: 3/4)'
const posters = { '--poster': `url(${reel.poster})`, '--poster-tall': `url(${reel.tall.poster})` } as CSSProperties
const pad = (n: number) => String(Math.floor(n)).padStart(2, '0')
// Which clip is on screen at second s (clips are in start order).
const clipIndex = (s: number) => reel.clips.reduce((at, c, i) => (s >= c.start ? i : at), 0)
// Camera-style timecode HH:MM:SS:FF at 24 fps.
const timecode = (s: number) => `${pad(s / 3600)}:${pad((s / 60) % 60)}:${pad(s % 60)}:${pad((s % 1) * 24)}`

/** The hero showreel inside the brand's viewfinder: REC light, running timecode, the project on screen, and a pause control. */
export function Viewfinder() {
  const video = useRef<HTMLVideoElement>(null)
  const tc = useRef<HTMLSpanElement>(null)
  const [clipAt, setClipAt] = useState(0)
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
    // Only while the reel plays. The timecode goes straight into its span when its 24 fps frame changes, so React
    // re-renders only when the clip label does, not 24 times a second (the phone's main thread and battery).
    let raf = 0
    let frame = -1
    const tick = () => {
      const f = Math.floor(v.currentTime * 24)
      if (f !== frame) {
        frame = f
        if (tc.current) tc.current.textContent = timecode(v.currentTime)
        setClipAt(clipIndex(v.currentTime))
      }
      raf = requestAnimationFrame(tick)
    }
    const run = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }
    const stop = () => cancelAnimationFrame(raf)
    v.addEventListener('playing', run)
    v.addEventListener('pause', stop)
    if (!v.paused) run()
    // Scrolled past, the reel pauses (decoding video nobody sees drains a phone) and picks up again on the way back.
    // It only resumes a pause of its own, so a visitor's pause stays put.
    let parked = false
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && !v.paused) {
        parked = true
        v.pause()
      } else if (e.isIntersecting && parked) {
        parked = false
        v.play().catch(() => {})
      }
    })
    io.observe(v)
    return () => {
      stop()
      io.disconnect()
      v.removeEventListener('playing', run)
      v.removeEventListener('pause', stop)
    }
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

  const clip = reel.clips[clipAt]

  return (
    <figure className="viewfinder" data-rolling={rolling} style={posters}>
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="auto"
        onPlaying={() => setRolling(true)}
        onPause={() => setRolling(false)}
        aria-label="Showreel: brand promos, music videos, 3D product work and Laurier sports, by Solomon Olufelo"
      >
        <source media={TALL} src={reel.tall.webm} type="video/webm" />
        <source media={TALL} src={reel.tall.mp4} type="video/mp4" />
        <source src={reel.webm} type="video/webm" />
        <source src={reel.mp4} type="video/mp4" />
      </video>
      <span className="vf-corner tl" aria-hidden="true" />
      <span className="vf-corner tr" aria-hidden="true" />
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
          <span className="vf-tc" ref={tc}>
            {timecode(0)}
          </span>
        </span>
        <Link to={`/work/${clip.slug}`} className="vf-clip">
          <span>{clip.label}</span>
          <span aria-hidden="true">&nbsp;↗</span>
        </Link>
      </figcaption>
      <button type="button" className="vf-toggle" onClick={toggle} aria-label={rolling ? 'Pause showreel' : 'Play showreel'}>
        <svg viewBox="0 0 24 24" aria-hidden="true">{rolling ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}</svg>
      </button>
    </figure>
  )
}
