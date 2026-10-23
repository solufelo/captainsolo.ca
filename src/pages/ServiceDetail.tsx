import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { Credits } from '../components/Credits'
import { WorkList } from '../components/WorkList'
import { tools } from '../content/about'
import { bookCall, brandPackages, credits, projects, type Project } from '../content/site'
import { NotFound } from './NotFound'

type Detail = {
  label: string
  title: string
  lead: string
  area: string
  items: Project[]
  steps: { title: string; body: string }[]
  includes?: { title: string; items: string[] }
  note: ReactNode
  ask: { label: string; service: string }
  credits?: boolean
}

const kit = (area: string) => tools.find((t) => t.area === area)?.items.join(', ')
const shooting = 'Based in Brampton, shooting across Peel, the GTA and Kitchener-Waterloo.'
const musicVideos = projects.filter((p) => p.kind === 'Music video')
// The local-business promos lead the video page; everything else keeps the order of site.ts.
const LEAD = ['barbershop-promo', 'sevynn-salon', 'barbershop-braids']
const lead = (p: Project) => (LEAD.includes(p.slug) ? LEAD.indexOf(p.slug) : LEAD.length)

// The service pages, /services/<id>. Only what the work on this site shows: no services, prices or numbers it can't back.
const details: Record<string, Detail> = {
  'music-videos': {
    label: `Music videos · ${musicVideos.length}`,
    title: 'Music videos for Brampton and GTA artists',
    lead: `I direct, shoot and edit music videos: night shoots lit by headlights, camcorder tape, golden-hour handheld and film-gate finishes. ${musicVideos.length} videos below, ${credits.length} more credits on YouTube.`,
    area: shooting,
    items: musicVideos,
    steps: [
      { title: 'Call', body: 'The song, the look you have in mind, the dates and the budget.' },
      { title: 'Shoot', body: 'I direct and shoot on location: streets, studios, rooftops, wherever the song lives.' },
      { title: 'Edit and finish', body: 'Cut, colour, titles and VFX, finished for YouTube and your socials.' },
    ],
    note: (
      <>
        Every video is quoted after a short call. Rated by FACTOR? Its{' '}
        <a href="https://www.factor.ca/programs/artist-programs/video/" target="_blank" rel="noopener noreferrer">
          Video program
        </a>{' '}
        can cover half the budget.
      </>
    ),
    ask: { label: 'Ask about a music video', service: 'Music video' },
    credits: true,
  },
  video: {
    label: 'Brand and event video',
    title: 'Videographer in Brampton for brands and events',
    lead: 'I shoot and edit promos, event coverage and social reels for GTA businesses: barbershops, salons, clothing labels and club nights, plus game-day video for Laurier Athletics.',
    area: shooting,
    // shoots for businesses first; web apps that handle video (UniCreate) belong on the websites page
    items: projects
      .filter((p) => p.categories.includes('video') && !p.categories.includes('code') && p.kind !== 'Music video')
      .sort((a, b) => lead(a) - lead(b)),
    steps: [
      { title: 'Call', body: 'What you sell, who buys it and where the video will run.' },
      { title: 'Shoot', body: 'Half a day at your shop, studio or event: the work, the people and the details.' },
      { title: 'Edit and deliver', body: 'Colour-graded edits, vertical for Reels and TikTok, wide for your site.' },
    ],
    includes: { title: 'A shoot includes', items: brandPackages[0].includes },
    note: (
      <>
        A shoot starts at {brandPackages[0].from}, and every project is quoted after a short call. Kit: {kit('Camera and post')}.
      </>
    ),
    ask: { label: 'Ask about a shoot', service: 'Photo / video shoot' },
  },
  websites: {
    label: 'Websites and web apps',
    title: 'Websites for Brampton businesses, built and kept current',
    lead: 'I design and build fast websites and web apps, then keep them current with monthly site care. Every build below has a live demo; the concept and pitch-demo builds are labelled as such.',
    area: 'Based in Brampton, building for businesses across the GTA and Kitchener-Waterloo.',
    items: projects.filter((p) => p.categories.includes('code')),
    steps: [
      { title: 'Call', body: 'What you sell, who buys it and what the site needs to do.' },
      { title: 'Design and build', body: 'I design it and build it, and you see it before it goes live.' },
      { title: 'Launch and care', body: 'Domain and Google set up, then site care keeps it fast, safe and current.' },
    ],
    includes: {
      title: 'A website includes',
      items: [
        'Design and build, one page or many',
        'Contact or booking form to your inbox',
        'Domain, hosting and SSL set up',
        'A CMS, so you edit your own text and photos',
        'Google Business Profile tune-up and local SEO',
        'Site care every month: hosting, edits and fixes',
      ],
    },
    note: (
      <>
        A shoot with a website starts at {brandPackages[1].from} and the full brand at {brandPackages[2].from}; every project is quoted after a
        short call, and the packages are on <Link to="/services">Services</Link>. Built with {kit('Web')}.
      </>
    ),
    ask: { label: 'Ask about a website', service: 'Website' },
  },
}

/** A service page: the work first, then how it gets made and how to start. */
export function ServiceDetail() {
  const { service = '' } = useParams()
  const d = details[service]
  if (!d) return <NotFound />
  const quotes = d.items.flatMap((p) => (p.quote ? [p.quote] : []))
  return (
    <div className="page">
      <header className="page-head wrap">
        <p className="label">{d.label}</p>
        <h1 className="page-title">{d.title}</h1>
        <p className="lead">{d.lead}</p>
        <p className="muted">{d.area}</p>
      </header>
      <section className="wrap" aria-labelledby="work-title">
        <h2 id="work-title" className="sr-only">
          Work
        </h2>
        <WorkList items={d.items} byClient />
      </section>
      {quotes.map((q) => (
        <blockquote key={q.by} className="wrap case-quote">
          <p>“{q.text}”</p>
          <footer>{q.by}</footer>
        </blockquote>
      ))}
      <section className="wrap steps" aria-labelledby="how-title">
        <h2 id="how-title" className="label">
          How it works
        </h2>
        <ol>
          {d.steps.map((s, i) => (
            <li key={s.title}>
              <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        {d.includes && (
          <div className="care service-includes">
            <h3>{d.includes.title}</h3>
            <ul>
              {d.includes.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="muted">{d.note}</p>
        <div className="about-ctas">
          <Link to={bookCall} className="btn">
            Book a call
          </Link>
          <Link to={`/contact?service=${encodeURIComponent(d.ask.service)}`} className="btn btn-ghost">
            {d.ask.label}
          </Link>
        </div>
      </section>
      {d.credits && (
        <div className="wrap">
          <Credits />
        </div>
      )}
    </div>
  )
}
