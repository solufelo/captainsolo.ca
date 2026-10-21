import { useEffect, useRef } from 'react'

/** Two rows of stills that slide in opposite directions as the section scrolls past. Decorative. */
export function Strip({ rows }: { rows: [string[], string[]] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        // -1 as the section enters the bottom of the screen, +1 as it leaves the top.
        const t = Math.max(-1, Math.min(1, (innerHeight / 2 - (r.top + r.height / 2)) / innerHeight))
        el.style.setProperty('--slide', String(t))
      })
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div ref={ref} className="strip" aria-hidden="true">
      {rows.map((row, i) => (
        <div key={i} className="strip-row">
          {row.map((src) => (
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </div>
      ))}
    </div>
  )
}
