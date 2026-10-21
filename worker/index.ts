import { formatEmail, validateContact } from './contact'

interface Env {
  ASSETS: Fetcher
  EMAIL: SendEmail
  /** Verified Email Routing destination (your real inbox). Set in wrangler.jsonc `vars`. */
  CONTACT_TO: string
  /** Any address on captainsolo.ca, e.g. contact@captainsolo.ca. */
  CONTACT_FROM: string
}

const MAX_BODY = 20_000

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })

async function handleContact(req: Request, env: Env): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Use POST.' }, 405)

  // Browsers always send Origin on a cross-site POST; refuse forms posted from other sites.
  const origin = req.headers.get('origin')
  if (origin && origin !== new URL(req.url).origin) return json({ error: 'Forbidden.' }, 403)
  if (!req.headers.get('content-type')?.includes('application/json')) return json({ error: 'Send the form as JSON.' }, 415)

  const raw = await req.text()
  if (raw.length > MAX_BODY) return json({ error: 'That message is too long.' }, 413)
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return json({ error: 'Send the form as JSON.' }, 400)
  }

  const result = validateContact(body)
  if (!result.ok) return json({ error: result.error }, 422)
  if (result.spam) return json({ ok: true })

  const { subject, text } = formatEmail(result.data)
  try {
    await env.EMAIL.send({
      to: env.CONTACT_TO,
      from: { email: env.CONTACT_FROM, name: 'captainsolo.ca' },
      replyTo: { email: result.data.email, name: result.data.name },
      subject,
      text,
    })
  } catch (err) {
    console.error('contact email failed', err)
    return json({ error: 'The message couldn’t be delivered right now.' }, 502)
  }
  return json({ ok: true })
}

export default {
  async fetch(req, env): Promise<Response> {
    const url = new URL(req.url)
    // One canonical host: www.captainsolo.ca -> captainsolo.ca, keeping path and query.
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4)
      return Response.redirect(url.toString(), 301)
    }
    const { pathname } = url
    if (pathname === '/api/contact') return handleContact(req, env)
    if (pathname.startsWith('/api/')) return json({ error: 'Not found.' }, 404)
    return env.ASSETS.fetch(req)
  },
} satisfies ExportedHandler<Env>
