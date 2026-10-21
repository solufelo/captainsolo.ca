// Contact-form validation and email formatting. Pure functions, so test/contact.test.mjs can run them in Node.

export type ContactInput = {
  name: string
  email: string
  phone: string
  service: string
  budget: string
  message: string
}

export type Validated = { ok: true; spam: boolean; data: ContactInput } | { ok: false; error: string }

const LIMITS = { name: 100, email: 200, phone: 40, service: 80, budget: 40, message: 5000 } as const
const EMAIL = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/

// Strip line breaks from anything that lands in a mail header (subject, reply-to), so it can't inject headers.
const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, ' ').trim()

export function validateContact(body: unknown): Validated {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Send the form as JSON.' }
  const b = body as Record<string, unknown>
  const str = (k: string) => (typeof b[k] === 'string' ? (b[k] as string) : '')

  // Honeypot filled in: report success so the bot moves on, but send nothing.
  if (str('website').trim()) return { ok: true, spam: true, data: emptyInput() }

  const data: ContactInput = {
    name: oneLine(str('name')),
    email: oneLine(str('email')),
    phone: oneLine(str('phone')),
    service: oneLine(str('service')),
    budget: oneLine(str('budget')),
    message: str('message').replace(/\r\n/g, '\n').trim(),
  }

  for (const [k, max] of Object.entries(LIMITS) as [keyof ContactInput, number][]) {
    if (data[k].length > max) return { ok: false, error: `The ${k} field is too long (max ${max} characters).` }
  }
  if (!data.name) return { ok: false, error: 'Add your name.' }
  if (!EMAIL.test(data.email)) return { ok: false, error: 'That email address doesn’t look right.' }
  if (data.message.length < 10) return { ok: false, error: 'Tell me a bit more about the project (10+ characters).' }
  return { ok: true, spam: false, data }
}

function emptyInput(): ContactInput {
  return { name: '', email: '', phone: '', service: '', budget: '', message: '' }
}

export function formatEmail(d: ContactInput) {
  const subject = `New enquiry: ${d.service || 'General'} — ${d.name}`.slice(0, 160)
  const text = [
    `Name:    ${d.name}`,
    `Email:   ${d.email}`,
    `Phone:   ${d.phone || '—'}`,
    `Service: ${d.service || '—'}`,
    `Budget:  ${d.budget || '—'}`,
    '',
    d.message,
    '',
    '— Sent from the contact form on captainsolo.ca. Reply to this email to answer them directly.',
  ].join('\n')
  return { subject, text }
}
