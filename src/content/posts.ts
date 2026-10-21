import raw from './posts.json'

export type Post = {
  slug: string
  title: string
  heading: string
  category: string
  readTime: string
  date: string
  excerpt: string
  seoTitle: string
  description: string
  html: string
  toc: { id: string; text: string }[]
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/&[a-z]+;/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Give every <h2> an id so the table of contents can link to it. Runs identically on server and client.
function withAnchors(html: string) {
  const toc: Post['toc'] = []
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim()
    let id = slugify(text) || 'section'
    while (toc.some((t) => t.id === id)) id += '-2'
    toc.push({ id, text })
    return `<h2 id="${id}">${inner}</h2>`
  })
  return { html: out, toc }
}

export const posts: Post[] = (raw as Omit<Post, 'toc'>[]).map((p) => ({ ...p, ...withAnchors(p.html) }))

export const categories = [...new Set(posts.map((p) => p.category))]

export const getPost = (slug: string) => posts.find((p) => p.slug === slug)

export function relatedPosts(post: Post, count = 3) {
  const same = posts.filter((p) => p.slug !== post.slug && p.category === post.category)
  const rest = posts.filter((p) => p.slug !== post.slug && p.category !== post.category)
  return [...same, ...rest].slice(0, count)
}

export const formatDate = (iso: string) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
