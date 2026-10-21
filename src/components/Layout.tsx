import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { bookCall, site, socials } from '../content/site'
import { CopyEmail } from './CopyEmail'
import { Cursor } from './Cursor'
import { Curtain } from './Curtain'
import { FloatingMenu } from './FloatingMenu'
import { Mark } from './Mark'
import { Orb } from './Orb'
import { reducedMotion } from '../motion'

declare global {
  interface Window {
    lenis?: Lenis
  }
}

/** Smooth, slightly weighted scrolling (Lenis). Native scrolling for reduced motion. */
function useSmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return
    // autoToggle pauses smoothing while the page is overflow: hidden; nested scrollers (menus, embeds) keep native scroll.
    const lenis = new Lenis({ lerp: 0.1, autoToggle: true, allowNestedScroll: true })
    window.lenis = lenis
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      delete window.lenis
    }
  }, [])
}

/** The device asks for less motion, so the effects are off: say so once and offer to turn them on here (same as ?motion=on). */
function MotionNote() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem('motion')
    } catch {
      /* storage blocked: nothing to remember a choice with, so don't ask */
      return
    }
    if (saved || !matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setShown(true)
    // A first-screen note: once the visitor scrolls on, it gets out of the way (it comes back next visit until they choose).
    const onScroll = () => scrollY > 400 && setShown(false)
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])
  const choose = (motion: 'on' | 'off') => {
    try {
      localStorage.setItem('motion', motion)
    } catch {
      /* private mode: the choice just won't persist */
    }
    // The effects set themselves up on load, so turning them on is a reload with html.motion-on (index.html).
    if (motion === 'on') location.reload()
    else setShown(false)
  }
  if (!shown) return null
  return (
    <aside className="motion-note" aria-label="Animations">
      <p>Animations are off on this device.</p>
      <button type="button" className="btn btn-sm" onClick={() => choose('on')}>
        Turn on
      </button>
      <button type="button" className="motion-note-x" onClick={() => choose('off')} aria-label="Keep animations off">
        ×
      </button>
    </aside>
  )
}

/** The page's bottom edge bows over the footer and flattens as the footer scrolls in. */
function FooterCurve() {
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  // Same colour as the page's last section, so the bow reads as the page itself.
  useEffect(() => {
    const last = document.querySelector('main')?.lastElementChild
    const bg = last ? getComputedStyle(last).backgroundColor : ''
    ref.current?.style.setProperty('--curve-bg', bg && bg !== 'rgba(0, 0, 0, 0)' ? bg : 'var(--bg)')
  }, [pathname])
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    const onScroll = () => {
      const p = Math.min(1, Math.max(0, (innerHeight - el.getBoundingClientRect().top) / innerHeight))
      el.style.setProperty('--curve', String(1 - p))
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div ref={ref} className="footer-curve" aria-hidden="true">
      <div />
    </div>
  )
}

const nav = [
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

function ThemeToggle() {
  const toggle = () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* private mode: the choice just won't persist */
    }
    window.dispatchEvent(new Event('themechange'))
  }
  // Both icons render; CSS shows the one for the current theme, so server and client markup match.
  return (
    <button className="icon-btn theme-toggle" type="button" onClick={toggle} aria-label="Switch light or dark mode" data-magnetic="0.4">
      <svg className="icon-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" />
      </svg>
      <svg className="icon-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
      </svg>
    </button>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  // On the home page the header floats over the showreel until you scroll past it.
  const [overHero, setOverHero] = useState(pathname === '/')
  useEffect(() => setOpen(false), [pathname, hash])
  useEffect(() => {
    if (pathname !== '/') return setOverHero(false)
    const onScroll = () => setOverHero(scrollY < innerHeight - 120)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header" data-open={open} data-over-hero={overHero}>
      <div className="wrap header-row">
        <Link to="/" className="brand" aria-label={`${site.name}, home`}>
          <Mark size={34} />
          <span>{site.name}</span>
        </Link>
        <nav className="main-nav" id="main-nav" aria-label="Main">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive && !n.to.includes('#') ? 'active' : undefined)}>
              {n.label}
            </NavLink>
          ))}
          <Link to={bookCall} className="btn btn-sm" data-magnetic="0.25">
            Book a call
          </Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <button
            className="icon-btn menu-btn"
            data-magnetic="0.4"
            type="button"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-cta">
        <h2 className="footer-title">
          <img src={site.portrait} alt="" width="96" height="96" loading="lazy" />
          Let’s work
          <br />
          together
        </h2>
        <div className="footer-rule">
          <Orb to={bookCall} size="lg">
            Book a call
          </Orb>
        </div>
        <CopyEmail className="pill-link" />
      </div>
      <div className="wrap footer-meta">
        <dl>
          <div>
            <dt>Version</dt>
            <dd>{new Date().getFullYear()} Edition</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>Brampton, ON</dd>
          </div>
        </dl>
        <nav aria-label="Social">
          <p className="label">Socials</p>
          <ul>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Site">
          <p className="label">More</p>
          <ul>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/voice-tags">Voice tags</Link></li>
            <li><Link to="/privacy-policy">Privacy</Link></li>
            <li><Link to="/terms-of-service">Terms</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}

/** Fades [data-reveal] elements in as they scroll into view. No-op for reduced motion (CSS keeps them visible). */
function useReveal(key: string) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))),
      { rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}

export function Layout() {
  const { pathname } = useLocation()
  useReveal(pathname)
  useSmoothScroll()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Curtain />
      <Header />
      <FloatingMenu />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <FooterCurve />
      <Footer />
      <MotionNote />
      <Cursor />
    </>
  )
}
