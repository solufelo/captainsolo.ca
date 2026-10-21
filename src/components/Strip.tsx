import { useEffect, useRef, type RefObject } from 'react'
import { reducedMotion } from '../motion'

const clamp = (lo: number, hi: number, v: number) => Math.max(lo, Math.min(hi, v))

/** Keeps a CSS variable on the element in step with scrolling: `value` gets its box and the viewport height. Off for reduced motion. */
export function useScrollVar<T extends HTMLElement>(ref: RefObject<T | null>, name: string, value: (r: DOMRect, vh: number) => number) {
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => el.style.setProperty(name, value(el.getBoundingClientRect(), innerHeight).toFixed(4)))
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
    // `value` is a fixed formula per caller; re-subscribing on each render would only churn listeners.
  }, [ref, name])
}

/** Sets --slide on the element: -1 as it enters the bottom of the screen, +1 as it leaves the top. */
export const useSlide = <T extends HTMLElement>(ref: RefObject<T | null>) =>
  useScrollVar(ref, '--slide', (r, vh) => clamp(-1, 1, (vh / 2 - (r.top + r.height / 2)) / vh))

/** --cover on a pinned hero's stage: 0 at the top of the page, 1 once the next section has slid fully over it. */
export const useCover = <T extends HTMLElement>(ref: RefObject<T | null>) =>
  useScrollVar(ref, '--cover', (r, vh) => clamp(0, 1, -r.top / Math.min(vh, 1100)))

/** --p for scroll-lit text: 0 while the element's top is low on screen, 1 once it has risen to 30% of the screen. */
export const useLit = <T extends HTMLElement>(ref: RefObject<T | null>) =>
  useScrollVar(ref, '--p', (r, vh) => clamp(0, 1, (vh * 0.88 - r.top) / (vh * 0.58)))

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
