import { useEffect, useRef } from 'react'
import { reducedMotion } from '../motion'

const INTERACTIVE = 'a, button, summary, label, [role="button"]'
const NATIVE = 'input, textarea, select, iframe, [contenteditable="true"]'
// Per second, not per frame, so it feels the same on a 60 Hz laptop and a 380 Hz monitor: the halo closes
// 1 - e^(-FOLLOW * dt) of the gap each frame (~18 % at 60 Hz).
const FOLLOW = 12
const PULL = 0.3 // how far a magnetic element leans toward the pointer

/**
 * Dot + halo cursor (the eolufelo.com one): the dot sits on the pointer, the halo eases after it, stretching along
 * the way it moves and springing round again when it stops. Over links and buttons the halo grows and inverts what's
 * under it; [data-cursor="View"] turns it into a labelled disc; [data-cursor="hide"] hides it; [data-magnetic]
 * elements lean toward the pointer with the halo morphing round their shape, and wobble home when it leaves
 * (CSS --elastic). Clicks send out a ring. Mouse only, and off for reduced motion: then the system cursor stays.
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
    let last = 0
    let raf = 0
    let state = ''
    let magnet: HTMLElement | null = null

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60)
      last = now
      let tx = x
      let ty = y
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        tx = r.left + r.width / 2
        ty = r.top + r.height / 2
      }
      const k = 1 - Math.exp(-FOLLOW * dt)
      const vx = ((tx - hx) * k) / dt
      const vy = ((ty - hy) * k) / dt
      hx += (tx - hx) * k
      hy += (ty - hy) * k
      h.style.translate = `${hx}px ${hy}px`
      // Squash and stretch along the direction of travel; none while it's a label or wrapped round a button.
      const stretch = state === 'label' || state === 'stick' ? 0 : Math.min(Math.hypot(vx, vy) / 2600, 0.45)
      h.style.rotate = stretch ? `${Math.atan2(vy, vx)}rad` : '0rad'
      h.style.scale = `${1 + stretch} ${1 - stretch * 0.55}`
      const moving = Math.abs(tx - hx) + Math.abs(ty - hy) > 0.2 || stretch > 0.005
      raf = moving ? requestAnimationFrame(tick) : 0
      if (!moving) last = 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const setState = (next: string, label = '') => {
      state = d.dataset.state = h.dataset.state = next
      if (h.textContent !== label) h.textContent = label
    }
    const release = () => {
      if (magnet) magnet.style.translate = ''
      magnet = null
      h.style.removeProperty('--cw')
      h.style.removeProperty('--ch')
      h.style.removeProperty('--cr')
    }
    // The halo takes the magnet's shape: a ring round a round button, a capsule round a pill.
    const wrap = (m: HTMLElement) => {
      const w = m.offsetWidth + 14
      const ht = m.offsetHeight + 14
      const radius = Math.min(parseFloat(getComputedStyle(m).borderTopLeftRadius) || 0, Math.min(m.offsetWidth, m.offsetHeight) / 2)
      h.style.setProperty('--cw', `${w}px`)
      h.style.setProperty('--ch', `${ht}px`)
      h.style.setProperty('--cr', `${radius + 7}px`)
    }

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      d.style.translate = `${x}px ${y}px`
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        const pull = Number(magnet.dataset.magnetic) || PULL
        // the element's own translate transition makes it follow, then wobble home when released
        magnet.style.translate = `${(x - r.left - r.width / 2) * pull}px ${(y - r.top - r.height / 2) * pull}px`
      }
      root.classList.remove('cursor-out')
      kick()
    }
    const over = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const t = e.target instanceof Element ? e.target : null
      const m = t?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (m !== magnet) {
        release()
        magnet = m
      }
      const tagged = t?.closest<HTMLElement>('[data-cursor]')
      if (t?.closest(NATIVE)) setState('native')
      else if (magnet) {
        wrap(magnet)
        setState('stick')
      } else if (tagged) {
        const label = tagged.dataset.cursor ?? ''
        setState(label === 'hide' ? 'hide' : 'label', label === 'hide' ? '' : label)
      } else setState(t?.closest(INTERACTIVE) ? 'hover' : '')
      kick()
    }
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      h.classList.add('is-down')
      const ring = document.createElement('div')
      ring.className = 'cursor-ripple'
      ring.style.translate = `${x}px ${y}px`
      ring.addEventListener('animationend', () => ring.remove())
      document.body.append(ring)
    }
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
