import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { reducedMotion } from '../motion'

// "Welcome" in the languages of the people I work with, ending in Yoruba.
const GREETINGS = ['Hello', 'Bonjour', 'Hola', 'Ciao', 'Olá', 'Hallo', 'Ẹ kú àbọ̀']
const LABELS: Record<string, string> = { '/': 'Home', '/work': 'Work', '/services': 'Services', '/services/music-videos': 'Music videos', '/services/video': 'Video', '/services/websites': 'Websites', '/book': 'Book a call', '/contact': 'Contact', '/blog': 'Blog', '/voice-tags': 'Voice tags' }
const labelFor = (path: string) => LABELS[path] ?? (path.startsWith('/work/') ? 'Work' : path.startsWith('/blog/') ? 'Blog' : '')
const reduced = () => reducedMotion()
const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * A dark curtain with a curved edge. On the first visit of a session it cycles greetings, then lifts
 * (index.html decides that before first paint by adding `html.intro`). On every client-side page change
 * it drops in with the page's name and lifts again. Off for reduced motion.
 */
export function Curtain() {
  const { pathname } = useLocation()
  const [state, setState] = useState<'idle' | 'cover' | 'lift'>('idle')
  const [word, setWord] = useState('')
  const first = useRef(true)

  // First load: greetings, then lift.
  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('intro')) return
    root.dataset.greeting = '1' // started: index.html's 2.5 s cap leaves it alone
    let i = 0
    setWord(GREETINGS[0])
    setState('cover')
    const tick = setInterval(() => {
      i += 1
      if (i < GREETINGS.length) return setWord(GREETINGS[i])
      clearInterval(tick)
      setState('lift')
      root.classList.remove('intro')
      try {
        sessionStorage.setItem('intro-seen', '1')
      } catch {
        /* private mode: it just shows again next visit */
      }
    }, 230)
    return () => clearInterval(tick)
  }, [])

  // Page changes: cover before the new page paints, then lift.
  useIso(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (reduced()) return
    setWord(labelFor(pathname))
    setState('cover')
    const t = setTimeout(() => setState('lift'), 380)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div className="curtain" data-state={state} aria-hidden="true" onTransitionEnd={() => state === 'lift' && setState('idle')}>
      <p className="curtain-word">{word && <>• {word}</>}</p>
      <svg className="curtain-edge" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M0 0 Q50 20 100 0 Z" />
      </svg>
    </div>
  )
}
