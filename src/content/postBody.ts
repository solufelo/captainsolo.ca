import raw from './post-bodies.json'

// Only the post page imports this file, so the posts' text (most of the site's words) loads with that page, not every page.

type Toc = { id: string; text: string }[]

const slugify = (s: string) =>
  s.toLowerCase().replace(/&[a-z]+;/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Give every <h2> an id so the table of contents can link to it. Runs identically on server and client.
function withAnchors(html: string) {
  const toc: Toc = []
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim()
    let id = slugify(text) || 'section'
    while (toc.some((t) => t.id === id)) id += '-2'
    toc.push({ id, text })
    return `<h2 id="${id}">${inner}</h2>`
  })
  return { html: out, toc }
}

const bodies: Record<string, { html: string; toc: Toc }> = Object.fromEntries(
  Object.entries(raw as Record<string, string>).map(([slug, html]) => [slug, withAnchors(html)]),
)

export const postBody = (slug: string) => bodies[slug] as { html: string; toc: Toc } | undefined
