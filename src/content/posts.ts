import raw from './posts.json'

/** What cards, titles and search data need. The text itself is in post-bodies.json, loaded with the post page (postBody.ts). */
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
}

export const posts: Post[] = raw

export const categories = [...new Set(posts.map((p) => p.category))]

export const getPost = (slug: string) => posts.find((p) => p.slug === slug)

export function relatedPosts(post: Post, count = 3) {
  const same = posts.filter((p) => p.slug !== post.slug && p.category === post.category)
  const rest = posts.filter((p) => p.slug !== post.slug && p.category !== post.category)
  return [...same, ...rest].slice(0, count)
}

export const formatDate = (iso: string) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
