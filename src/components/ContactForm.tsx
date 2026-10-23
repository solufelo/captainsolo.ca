import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { bookCall, contactServices, site, socials } from '../content/site'
import { CopyEmail } from './CopyEmail'

type Status = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string }

export function ContactForm({ defaultService = '' }: { defaultService?: string }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const formRef = useRef<HTMLFormElement>(null)
  const { search } = useLocation()

  // Package buttons link here with ?service=…&package=…. Applied after hydration so server and client markup match.
  useEffect(() => {
    const form = formRef.current
    if (!form) return
    const q = new URLSearchParams(search)
    const service = q.get('service')
    const pkg = q.get('package')
    const select = form.elements.namedItem('service') as HTMLSelectElement | null
    if (select && service && contactServices.includes(service)) select.value = service
    const message = form.elements.namedItem('message') as HTMLTextAreaElement | null
    if (message && pkg && !message.value) message.value = `I’m interested in the ${pkg.slice(0, 40)} package. `
    // "Book a call" buttons: there's no calendar, so the request is written for them.
    if (message && q.get('call') && !message.value) message.value = 'I’d like a 30-minute call about my business. Good days and times for me: '
  }, [search])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(body.error || 'The message didn’t send.')
      form.reset()
      setStatus({ kind: 'sent' })
    } catch (err) {
      const message = err instanceof TypeError ? 'You seem to be offline.' : (err as Error).message
      setStatus({ kind: 'error', message })
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className="form-done" role="status">
        <h3>Message sent.</h3>
        <p>Thanks — I’ll reply within 1–2 business days.</p>
        <button type="button" className="btn btn-ghost" onClick={() => setStatus({ kind: 'idle' })}>
          Send another
        </button>
      </div>
    )
  }

  // Three fields. Phone and budget come up on the call; fewer inputs, more messages.
  return (
    <form ref={formRef} className="contact-form" onSubmit={submit}>
      <div className="field-row">
        <label className="field">
          <span>Name</span>
          <input name="name" required maxLength={100} autoComplete="name" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
      </div>
      <label className="field">
        <span>What do you need?</span>
        <select name="service" defaultValue={defaultService}>
          <option value="">Pick one (optional)</option>
          {contactServices.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Your message</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="What are you building, and when do you need it?" />
      </label>
      {/* Honeypot: hidden from people, filled in by bots. The Worker drops anything that sets it. */}
      <label className="hp" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-foot">
        <button className="btn" type="submit" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p className="muted small">I only use your details to reply.</p>
      </div>
      {status.kind === 'error' && (
        <p className="form-error" role="alert">
          {status.message} Try again, or email <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      )}
    </form>
  )
}

export function ContactSection({ defaultService, isPage = false }: { defaultService?: string; isPage?: boolean }) {
  const Title = isPage ? 'h1' : 'h2'
  return (
    <section id="contact" className="section section-alt contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div>
          <p className="kicker">Say hi</p>
          <Title id="contact-title" className="section-title">
            Got a project?
          </Title>
          <p className="lead">
            Email me or use the form. I reply within 1–2 business days. Rather talk? <Link to={bookCall}>Book a free call</Link>.
          </p>
          <CopyEmail />
          <dl className="contact-facts">
            <div>
              <dt>Based in</dt>
              <dd>{site.location}</dd>
            </div>
            <div>
              <dt>Elsewhere</dt>
              <dd className="inline-links">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>
        <div data-reveal>
          <p className="form-or">Or send it from here</p>
          <ContactForm defaultService={defaultService} />
        </div>
      </div>
    </section>
  )
}
