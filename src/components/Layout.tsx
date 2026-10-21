import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { projects, site, socials } from '../content/site'
import { CopyEmail } from './CopyEmail'
import { Mark } from './Mark'

const nav = [
  { to: '/#work', label: 'Work' },
  { to: '/#packages', label: 'Packages' },
  { to: '/#services', label: 'Services' },
  { to: '/#about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/voice-tags', label: 'Voice tags' },
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
  useEffect(() => setOpen(false), [pathname, hash])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header" data-open={open}>
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

/** Work carousel under the footer: the last thing a visitor sees before the email is more work. */
function WorkCarousel() {
  const row = [...projects, ...projects]
  return (
    <div className="work-carousel" aria-hidden="true">
      <div className="work-carousel-track">
        {row.map((p, i) => (
          <Link key={p.slug + i} to={`/work/${p.slug}`} tabIndex={-1}>
            <img src={p.image} alt="" width="240" height="150" loading="lazy" />
          </Link>
        ))}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-cta" data-reveal>
        <h2 className="section-title">Let’s make yours.</h2>
        <p className="lead">One email is all it takes. I reply within 1–2 business days.</p>
        <CopyEmail />
      </div>
      <WorkCarousel />
      <div className="wrap footer-grid">
        <div>
          <p className="footer-name">{site.name}</p>
          <p className="muted">
            {site.alias} · {site.location}
          </p>
          <a className="footer-mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <nav aria-label="Social">
          <ul className="link-list">
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
          <ul className="link-list">
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/voice-tags">Voice tags</Link></li>
            <li><Link to="/contact">Contact form</Link></li>
            <li><Link to="/privacy-policy">Privacy</Link></li>
            <li><Link to="/terms-of-service">Terms</Link></li>
          </ul>
        </nav>
      </div>
      <p className="wrap fineprint muted">© {new Date().getFullYear()} {site.name}. Built by hand in Brampton.</p>
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
