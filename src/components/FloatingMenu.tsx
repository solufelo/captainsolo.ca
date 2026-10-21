import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { bookCall, site, socials } from '../content/site'

const links = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: bookCall, label: 'Book a call' },
  { to: '/contact', label: 'Contact' },
]

/** Once the header has scrolled away, a round button stays top-right and opens the menu as a side panel. */
export function FloatingMenu() {
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setShown(scrollY > 240)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        className="float-menu-btn"
        data-shown={shown || open}
        data-open={open}
        aria-expanded={open}
        aria-controls="side-menu"
        aria-label={open ? 'Close menu' : 'Menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
      <div className="side-menu-scrim" data-open={open} onClick={() => setOpen(false)} />
      <nav id="side-menu" className="side-menu" data-open={open} aria-label="Menu" aria-hidden={!open} inert={!open}>
        <p className="label">Navigation</p>
        <ul>
          {links.map((l) => (
            <li key={l.label}>
              <Link to={l.to} aria-current={pathname === l.to ? 'page' : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="side-menu-foot">
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
          <a className="side-menu-mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </nav>
    </>
  )
}
