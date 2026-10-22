import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { phoneSrcSet, type Project } from '../content/site'
import { reducedMotion } from '../motion'

/**
 * Big-type work rows. With a mouse, hovering a row floats a preview next to the pointer: every project sits in one
 * vertical strip that slides to the hovered row, so moving (or scrolling) down the list rolls from one to the next.
 * The hovered project plays its silent loop on top of its card. On touch screens each row shows its thumbnail instead.
 * Reduced motion: the still card sits under the pointer, with no trailing, tilt or video.
 */
export function WorkList({ items }: { items: Project[] }) {
  const [active, setActive] = useState<Project | null>(null)
  // The strip mounts on first hover, so the home page doesn't load every card up front.
  const [armed, setArmed] = useState(false)
  // Stays on the last row after the pointer leaves, so the preview shrinks away on the project it was showing.
  const [index, setIndex] = useState(0)
  const float = useRef<HTMLDivElement>(null)
  // Where the pointer entered the row, so the preview opens under it instead of at the corner.
  const entry = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = float.current
    if (!el || !active) return
    const still = reducedMotion()
    let { x, y } = entry.current
    let tx = x
    let ty = y
    let raf = 0
    let prev = 0
    let tilt = 0
    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const tick = (now: number) => {
      const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 1 / 60
      prev = now
      // Per second, so it trails the same on any refresh rate (~16 % of the gap per frame at 60 Hz).
      const k = still ? 1 : 1 - Math.exp(-10.5 * dt)
      const vx = ((tx - x) * k) / dt
      x += (tx - x) * k
      y += (ty - y) * k
      // Leans into sideways movement and rights itself when the pointer settles.
      if (!still) tilt += (Math.max(-7, Math.min(7, vx / 140)) - tilt) * (1 - Math.exp(-9 * dt))
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`
      raf = requestAnimationFrame(tick)
    }
    addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [active])

  return (
    <div className="work-list" onPointerLeave={() => setActive(null)}>
      <ul>
        {items.map((p, i) => (
          <li key={p.slug}>
            <Link
              to={`/work/${p.slug}`}
              className="work-row"
              data-cursor="hide"
              onPointerEnter={(e) => {
                if (e.pointerType !== 'mouse') return
                entry.current = { x: e.clientX, y: e.clientY }
                setArmed(true)
                setIndex(i)
                setActive(p)
              }}
            >
              <img className="work-row-thumb" src={p.image} srcSet={phoneSrcSet(p.image)} sizes="100vw" alt="" width="800" height="500" loading="lazy" />
              <h3>{p.title}</h3>
              <span className="work-row-kind">{p.kind}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={float} className="work-float" data-on={!!active} aria-hidden="true">
        {armed && (
          <div className="work-float-strip" style={{ translate: `0 ${-index * 100}%` }}>
            {items.map((p) => (
              <div key={p.slug} className="work-float-slide">
                <img src={p.image} alt="" />
                {active === p && p.preview && !reducedMotion() && <video src={p.preview} muted loop autoPlay playsInline />}
              </div>
            ))}
          </div>
        )}
        <span className="work-float-view">View</span>
      </div>
    </div>
  )
}
