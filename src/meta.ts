import { getProject, projects, site } from './content/site'
import { getPost, posts } from './content/posts'
import legal from './content/legal.json'

export type Meta = { title: string; description: string; path: string; type?: 'website' | 'article'; jsonLd?: object }

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  alternateName: site.alias,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: 'Full-stack developer & videographer',
  address: { '@type': 'PostalAddress', addressLocality: 'Brampton', addressRegion: 'ON', addressCountry: 'CA' },
}

const fixed: Record<string, Omit<Meta, 'path'>> = {
  '/': { title: `${site.name} — Videographer & Web Developer, Brampton | ${site.alias}`, description: site.description, jsonLd: person },
  '/work': {
    title: `Work | Websites, Apps & Video by ${site.name}`,
    description: 'Websites, web apps, brand video and sports reels by Solomon Olufelo, Brampton.',
  },
  '/services': {
    title: 'Services | Websites, Photo & Video for GTA Businesses | Captain Solo',
    description: 'Shoot, Shoot + Site and Full brand packages, plus monthly site care and content shoots. Quoted after a short call.',
  },
  ...(site.cal && {
    '/book': { title: 'Book a call | Solomon Olufelo', description: 'Pick a time for a free 30-minute call about your website, photos or video.' },
  }),
  '/blog': {
    title: 'Blog | Web Dev, Videography, AI Tools & Music Production | Captain Solo',
    description: 'Guides on web development, videography, music production, study tools and local business tips for Brampton and the GTA.',
  },
  '/voice-tags': {
    title: 'Voice Tags & Producer Tags | 24-Hour Delivery | Captain Solo',
    description: 'Custom voice tags, producer tags and DJ drops. Listen to real samples, pick a style, and order with 24-hour delivery.',
  },
  '/contact': {
    title: 'Contact | Web Development & Videography in Brampton | Captain Solo',
    description: 'Tell me about your website, app, video or voice-tag project. I reply within 1–2 business days.',
  },
  '/privacy-policy': { title: 'Privacy Policy | Captain Solo', description: 'What this site collects and how it’s used.' },
  '/terms-of-service': { title: 'Terms of Service | Captain Solo', description: 'Terms for Captain Solo services.' },
}

export function metaFor(path: string): Meta {
  const clean = path.replace(/\/+$/, '') || '/'
  if (fixed[clean]) return { ...fixed[clean], path: clean }
  const project = clean.startsWith('/work/') ? getProject(clean.slice(6)) : undefined
  if (project) {
    return {
      title: `${project.title} — ${project.client} | Captain Solo`,
      description: `${project.role}. ${project.summary}`,
      path: clean,
    }
  }
  const post = clean.startsWith('/blog/') ? getPost(clean.slice(6)) : undefined
  if (post) {
    return {
      title: post.seoTitle,
      description: post.description,
      path: clean,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        author: { '@type': 'Person', name: site.name, url: site.url },
        mainEntityOfPage: site.url + clean,
      },
    }
  }
  return { title: 'Page not found | Captain Solo', description: site.description, path: clean }
}

/** Every URL the prerender step writes to disk. */
export const prerenderPaths = [...Object.keys(fixed), ...projects.map((p) => `/work/${p.slug}`), ...posts.map((p) => `/blog/${p.slug}`)]

// legal.json is imported here so its keys stay in sync with the routes above.
export const legalPages = legal as Record<'privacy-policy' | 'terms-of-service', { title: string; html: string }>
