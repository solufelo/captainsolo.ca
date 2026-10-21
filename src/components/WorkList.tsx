import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { Project } from '../content/site'

/**
 * Big-type work rows. With a mouse, hovering a row floats a preview next to the pointer: every project sits in one
 * vertical strip that slides to the hovered row, so moving (or scrolling) down the list rolls from one to the next.
 * The hovered project plays its silent loop on top of its card. On touch screens each row shows its thumbnail instead.
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
    let { x, y } = entry.current
    let tx = x
    let ty = y
    let raf = 0
    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const tick = () => {
      x += (tx - x) * 0.16
      y += (ty - y) * 0.16
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
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
              <img className="work-row-thumb" src={p.image} alt="" width="800" height="500" loading="lazy" />
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
                {active === p && p.preview && <video src={p.preview} muted loop autoPlay playsInline />}
              </div>
            ))}
          </div>
        )}
        <span className="work-float-view">View</span>
      </div>
    </div>
  )
}
