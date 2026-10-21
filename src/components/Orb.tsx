import { useRef, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router'

/** Round call to action that leans toward a mouse pointer (CSS turns the lean off for reduced motion). */
export function Orb({ to, children, size = 'md' }: { to: string; children: ReactNode; size?: 'md' | 'lg' }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const lean = (e: PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.3}px ${(e.clientY - r.top - r.height / 2) * 0.3}px`
  }
  const reset = () => {
    if (ref.current) ref.current.style.translate = ''
  }
  return (
    <Link ref={ref} to={to} className={`orb orb-${size}`} onPointerMove={lean} onPointerLeave={reset}>
      <span>{children}</span>
    </Link>
  )
}
