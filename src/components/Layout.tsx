import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { site, socials } from '../content/site'
import { CopyEmail } from './CopyEmail'
import { Mark } from './Mark'
import { Orb } from './Orb'

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
    <button className="icon-btn theme-toggle" type="button" onClick={toggle} aria-label="Switch light or dark mode">
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
          <CopyEmail className="btn btn-sm" compact />
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <button
            className="icon-btn menu-btn"
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
          <Orb to="/contact" size="lg">
            Get in touch
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
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
