import { useEffect, useRef, type RefObject } from 'react'

/** Sets --slide on the element: -1 as it enters the bottom of the screen, +1 as it leaves the top. */
export function useSlide<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
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
  }, [ref])
}

/** Two rows of stills that slide in opposite directions as the section scrolls past. Decorative. */
export function Strip({ rows }: { rows: [string[], string[]] }) {
  const ref = useRef<HTMLDivElement>(null)
  useSlide(ref)
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

/** Client names in two big rows that slide against each other on scroll: who I've worked for, at a glance. */
export function Clients({ names }: { names: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useSlide(ref)
  const half = Math.ceil(names.length / 2)
  const rows = [names.slice(0, half), names.slice(half)]
  return (
    <section ref={ref} className="clients" aria-labelledby="clients-title">
      <h2 id="clients-title" className="label wrap">
        Worked with
      </h2>
      <p className="sr-only">{names.join(', ')}</p>
      {rows.map((row, i) => (
        <div key={i} className="clients-row" aria-hidden="true">
          {[...row, ...row].map((n, k) => (
            <span key={k}>
              {n}
              <i>◆</i>
            </span>
          ))}
        </div>
      ))}
    </section>
  )
}
