import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { Project } from '../content/site'

/**
 * Big-type work rows. With a mouse, hovering a row floats its preview (a silent loop for video work,
 * the screen for sites) next to the pointer; on touch screens each row shows its thumbnail instead.
 */
export function WorkList({ items }: { items: Project[] }) {
  const [active, setActive] = useState<Project | null>(null)
  // Vertical reels get a tall frame; known once the preview's metadata loads.
  const [tall, setTall] = useState(false)
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
        {items.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/work/${p.slug}`}
              className="work-row"
              onPointerEnter={(e) => {
                if (e.pointerType !== 'mouse') return
                entry.current = { x: e.clientX, y: e.clientY }
                if (!p.preview) setTall(false)
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
      <div ref={float} className="work-float" data-on={!!active} data-tall={tall} aria-hidden="true">
        {active &&
          (active.preview ? (
            <video
              key={active.slug}
              src={active.preview}
              muted
              loop
              autoPlay
              playsInline
              onLoadedMetadata={(e) => setTall(e.currentTarget.videoHeight > e.currentTarget.videoWidth)}
            />
          ) : (
            <img key={active.slug} src={active.image} alt="" />
          ))}
        <span className="work-float-view">View</span>
      </div>
    </div>
  )
}
