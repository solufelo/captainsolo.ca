import { useEffect, useRef } from 'react'
import { reducedMotion } from '../motion'

const INTERACTIVE = 'a, button, summary, label, [role="button"]'
const NATIVE = 'input, textarea, select, iframe, [contenteditable="true"]'

/**
 * Dot + halo cursor (the eolufelo.com one): the dot sits on the pointer, the halo eases after it and catches up.
 * Over links and buttons the halo grows and inverts what's under it; [data-cursor="View"] turns it into a labelled disc;
 * [data-cursor="hide"] leaves just the dot; [data-magnetic] elements lean toward the pointer with the halo wrapped round
 * them, and wobble back when it leaves (CSS --elastic). Mouse only, and off for reduced motion: then the system cursor stays.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const halo = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion()) return
    const d = dot.current
    const h = halo.current
    if (!d || !h) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    let x = -100
    let y = -100
    let hx = x
    let hy = y
    let raf = 0
    let magnet: HTMLElement | null = null

    const tick = () => {
      let tx = x
      let ty = y
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        tx = r.left + r.width / 2
        ty = r.top + r.height / 2
      }
      hx += (tx - hx) * 0.18
      hy += (ty - hy) * 0.18
      h.style.translate = `${hx}px ${hy}px`
      raf = Math.abs(tx - hx) + Math.abs(ty - hy) > 0.2 ? requestAnimationFrame(tick) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const setState = (state: string, label = '') => {
      d.dataset.state = h.dataset.state = state
      if (h.textContent !== label) h.textContent = label
    }
    const release = () => {
      if (magnet) magnet.style.translate = ''
      magnet = null
    }

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      d.style.translate = `${x}px ${y}px`
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        // lean a third of the way toward the pointer (the element's own transition makes it follow, then wobble home)
        magnet.style.translate = `${(x - r.left - r.width / 2) * 0.3}px ${(y - r.top - r.height / 2) * 0.3}px`
      }
      root.classList.remove('cursor-out')
      kick()
    }
    const over = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const t = e.target instanceof Element ? e.target : null
      const native = t?.closest(NATIVE)
      const tagged = t?.closest<HTMLElement>('[data-cursor]')
      const m = t?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (m !== magnet) {
        release()
        magnet = m
      }
      if (native) setState('native')
      else if (magnet) {
        h.style.setProperty('--stick', `${Math.max(magnet.offsetWidth, magnet.offsetHeight) + 14}px`)
        setState('stick')
      } else if (tagged) {
        const label = tagged.dataset.cursor ?? ''
        setState(label === 'hide' ? 'hide' : 'label', label === 'hide' ? '' : label)
      } else setState(t?.closest(INTERACTIVE) ? 'hover' : '')
      kick()
    }
    const down = () => h.classList.add('is-down')
    const up = () => h.classList.remove('is-down')
    const leave = () => {
      root.classList.add('cursor-out')
      release()
    }

    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerover', over, { passive: true })
    addEventListener('pointerdown', down, { passive: true })
    addEventListener('pointerup', up, { passive: true })
    root.addEventListener('mouseleave', leave)
    return () => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerover', over)
      removeEventListener('pointerdown', down)
      removeEventListener('pointerup', up)
      root.removeEventListener('mouseleave', leave)
      cancelAnimationFrame(raf)
      release()
      root.classList.remove('has-cursor', 'cursor-out')
    }
  }, [])
  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={halo} className="cursor-halo" aria-hidden="true" />
    </>
  )
}
