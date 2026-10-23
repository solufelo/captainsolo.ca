import { getProject, projects, site, socials } from './content/site'
import { getPost, posts } from './content/posts'
import legal from './content/legal.json'

/** `image`: the page's share card (og:image), a path under public/; pages without one use /og-image.jpg. */
export type Meta = { title: string; description: string; path: string; type?: 'website' | 'article'; image?: string; jsonLd?: object }

const creator = {
  '@type': 'Person',
  '@id': `${site.url}/#person`,
  name: site.name,
  alternateName: site.alias,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: 'Videographer, web developer and music producer',
  address: { '@type': 'PostalAddress', addressLocality: 'Brampton', addressRegion: 'ON', addressCountry: 'CA' },
  sameAs: socials.map((s) => s.href),
}

// The business behind the Google Business Profile: same name, site and service areas, so search ties them together.
const business = {
  '@type': 'ProfessionalService',
  '@id': `${site.url}/#business`,
  name: site.name,
  url: site.url,
  image: `${site.url}/og-image.jpg`,
  email: site.email,
  description: site.description,
  address: creator.address,
  areaServed: ['Brampton', 'Mississauga', 'Toronto', 'Caledon', 'Vaughan', 'Oakville', 'Milton', 'Halton Hills', 'Kitchener', 'Waterloo'].map(
    (name) => ({ '@type': 'City', name }),
  ),
  knowsAbout: ['Videography', 'Video production', 'Photography', 'Web design', 'Web development'],
  founder: { '@id': creator['@id'] },
  sameAs: creator.sameAs,
}

// Upload dates of the case studies' YouTube videos, as their channels show them (Portfolio-Archive/_triage/web-credits/
// credits.json, matched by URL). A video without one here gets CreativeWork data: never a guessed date.
const uploaded: Record<string, string> = {
  uIts3LeNtbs: '2024-10-31',
  N5jcnlP1PLU: '2023-08-17',
  hWXnXhGhBYg: '2026-01-21',
  EW3lemJXpzE: '2026-03-27',
  'apHpz-q5Z_8': '2025-09-25',
  CLlMd5SBxTs: '2026-08-24',
  YM3hKK1O7_g: '2024-04-06',
  'fkc-Vnrbr5Y': '2023-10-29',
  '8MDTS1aIbPQ': '2024-10-19',
}

const fixed: Record<string, Omit<Meta, 'path'>> = {
  '/': { title: `${site.name} — Videographer & Web Developer, Brampton`, description: site.description, jsonLd: { '@context': 'https://schema.org', '@graph': [creator, business] } },
  '/work': {
    title: `Work | Websites, Apps & Video by ${site.name}`,
    description: 'Websites, web apps, brand video and sports reels by Solomon Olufelo, Brampton.',
    image: '/og/work.jpg',
  },
  '/services/music-videos': {
    title: 'Music Video Director in Brampton & the GTA | Solomon Olufelo',
    description: 'Music videos directed, shot and edited for Kenoh, TGK, Dela, Yung Koba, JFinesse and FujiWill. Based in Brampton, shooting across the GTA.',
    image: '/og/music-videos.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Music video production',
      serviceType: 'Music video production',
      url: `${site.url}/services/music-videos`,
      provider: { '@type': 'ProfessionalService', '@id': business['@id'], name: site.name, url: site.url },
      areaServed: business.areaServed,
    },
  },
  '/services': {
    title: 'Video, Photo & Web Services in Brampton | Solomon Olufelo',
    description: 'Shoot, Shoot + site and Full brand packages, plus monthly site care and content shoots. Quoted after a short call.',
    image: '/og/services.jpg',
  },
  ...(site.cal && {
    '/book': { title: 'Book a call | Solomon Olufelo', description: 'Pick a time for a free 30-minute call about your website, photos or video.', image: '/og/book.jpg' },
  }),
  '/blog': {
    title: 'Blog: Web, Video, AI & Music Guides | Solomon Olufelo',
    description: 'Guides on web development, videography, music production, study tools and local business tips for Brampton and the GTA.',
    image: '/og/blog.jpg',
  },
  '/voice-tags': {
    title: 'Voice Tags & Producer Tags | 24-Hour Delivery | Solomon Olufelo',
    description: 'Custom voice tags, producer tags and DJ drops. Listen to real samples, pick a style, and order a single tag with 24-hour delivery.',
    image: '/og/voice-tags.jpg',
  },
  '/about': {
    title: 'About | Credits, Experience & Résumé | Solomon Olufelo',
    description: 'Every credit and the résumé: video for Laurier Athletics and GTA artists and businesses, websites and web apps, and music produced as Solufelo.',
    image: '/og/about.jpg',
    jsonLd: { '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: creator },
  },
  '/contact': {
    title: 'Contact | Web & Video in Brampton | Solomon Olufelo',
    description: 'Tell me about your website, app, video or voice-tag project. I reply within 1–2 business days.',
    image: '/og/contact.jpg',
  },
  '/privacy-policy': { title: 'Privacy Policy | Solomon Olufelo', description: 'What this site collects and how it’s used.' },
  '/terms-of-service': { title: 'Terms of Service | Solomon Olufelo', description: 'Terms for Solomon Olufelo’s services.' },
}

export function metaFor(path: string): Meta {
  const clean = path.replace(/\/+$/, '') || '/'
  if (fixed[clean]) return { ...fixed[clean], path: clean }
  const project = clean.startsWith('/work/') ? getProject(clean.slice(6)) : undefined
  if (project) {
    const image = `/og/${project.slug}.jpg` // scripts/og_cards.mjs
    const video = project.demo?.href.match(/^https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})$/)?.[1]
    const uploadDate = video && uploaded[video]
    const full = `${project.title} — ${project.client} | ${site.name}`
    return {
      title: full.length > 60 ? `${project.title} | ${site.name}` : full, // longer ones get cut in results, name first to go
      description: `${project.summary} ${project.role} by ${site.name}.`,
      path: clean,
      image,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': uploadDate ? 'VideoObject' : 'CreativeWork',
        name: project.title,
        description: project.summary,
        creator,
        image: site.url + image,
        url: site.url + clean,
        ...(uploadDate && { thumbnailUrl: site.url + image, embedUrl: `https://www.youtube.com/embed/${video}`, uploadDate }),
      },
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
        dateModified: post.date,
        image: `${site.url}/og-image.jpg`,
        author: { '@type': 'Person', name: site.name, url: site.url },
        mainEntityOfPage: site.url + clean,
      },
    }
  }
  return { title: 'Page not found | Solomon Olufelo', description: site.description, path: clean }
}

/** Every URL the prerender step writes to disk. */
export const prerenderPaths = [...Object.keys(fixed), ...projects.map((p) => `/work/${p.slug}`), ...posts.map((p) => `/blog/${p.slug}`)]

// legal.json is imported here so its keys stay in sync with the routes above.
export const legalPages = legal as Record<'privacy-policy' | 'terms-of-service', { title: string; html: string }>
