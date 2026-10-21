// Site copy carried over from the June 2026 build. Edit here; every page reads from this file.

export const site = {
  name: 'Solomon Olufelo',
  alias: 'Captain Solo',
  url: 'https://captainsolo.ca',
  email: 'work@captainsolo.ca',
  location: 'Brampton, ON · Serving the GTA',
  roles: ['Creative technologist', 'Full-stack developer', 'Motion & video'],
  tagline: 'Shipped demos, case studies, and client work across code and camera.',
  description:
    'Solomon Olufelo (Captain Solo) is a Brampton-based full-stack developer and videographer. React, Python and C++ builds, plus sports, event and brand video.',
  airgigs: {
    profile: 'https://www.airgigs.com/user/solufelobeats',
    tag: 'https://www.airgigs.com/Voiceovers/111986/Custom-Producer-Tag--Voice-Tag-Studio-Quality-24-Hour-Delivery-Wet--Dry-Versions',
    pack: 'https://www.airgigs.com/Voiceovers/111987/Producer-Brand-Pack-3-Custom-Producer-Tags--DJ-Drop--Beat-Intro-&-Outro',
  },
}

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/caaptainsolo/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/solomon-olufeo-854360241/' },
  { label: 'GitHub', href: 'https://github.com/solufelo' },
  { label: 'YouTube', href: 'https://www.youtube.com/@captainsolo' },
]

export type Service = { title: string; body: string; tags: string[]; link?: { label: string; href: string } }

export const services: { group: string; items: Service[] }[] = [
  {
    group: 'Code',
    items: [
      {
        title: 'Frontend & UX',
        body: 'React 19 and Vite. Fast, responsive, built to convert. This site is the demo.',
        tags: ['React', 'Vite', 'TypeScript', 'GSAP'],
      },
      {
        title: 'APIs & auth',
        body: 'Express or Python REST, session auth, contact forms, Stripe hooks, admin dashboards.',
        tags: ['Python', 'Node.js', 'SQLite', 'Stripe'],
        link: { label: 'See work', href: '/#work' },
      },
    ],
  },
  {
    group: 'Photo, video & motion',
    items: [
      {
        title: 'Brand photography',
        body: 'Portraits, storefronts, products and team shots for your site, socials and Google listing.',
        tags: ['Portraits', 'Products', 'Locations'],
        link: { label: 'See packages', href: '/#packages' },
      },
      {
        title: 'Athletics & events',
        body: 'University athletics: game recaps, multi-cam coverage and fast social cuts.',
        tags: ['Premiere', 'Sony A6100', 'Sports'],
        link: { label: 'See reels', href: '/#work' },
      },
      {
        title: 'Brand & promo',
        body: 'Short-form promos for local businesses: hooks, colour and platform-ready exports.',
        tags: ['Premiere', 'Colour', 'Social'],
        link: { label: 'See reels', href: '/#work' },
      },
      {
        title: '3D & motion',
        body: 'WebGL product landings and Blender motion: Velare and campus 3D assets.',
        tags: ['three.js', 'Blender', 'GSAP'],
        link: { label: 'Live demo', href: 'https://velare-site.netlify.app/' },
      },
    ],
  },
]

export type Category = 'code' | 'video' | 'motion'

export type Project = {
  slug: string
  title: string
  /** Who it was for; "Personal project" when it's yours. */
  client: string
  /** What you did on it. */
  role: string
  summary: string
  status: 'live' | 'wip'
  categories: Category[]
  tags: string[]
  image: string
  video?: string
  /** Real screens for the case-study page; falls back to `image`. */
  gallery?: string[]
  /** Case-study overview: what it was, the problem, what changed. Swap in real numbers when you have them. */
  overview: { what: string; problem: string; outcome: string }
  demo?: { label: string; href: string }
  source?: string
}

export const projects: Project[] = [
  {
    slug: 'captain-funds',
    title: 'Captain Funds',
    client: 'Personal project',
    role: 'Design, front end, API, database',
    summary: 'MERN fundraising platform: campaign creation, donations, role-based access, admin analytics.',
    status: 'live',
    categories: ['code'],
    tags: ['React', 'TypeScript', 'Express', 'MongoDB', 'Stripe'],
    image: '/assets/projects/captainfunds.webp',
    gallery: ['/assets/work/captainfunds-landing.webp', '/assets/work/captainfunds-dashboard.webp', '/assets/work/captainfunds-admin.webp', '/assets/work/captainfunds-donate.webp'],
    overview: {
      what: 'A fundraising platform where organisers create campaigns and supporters donate, with separate views for donors, organisers and admins.',
      problem: 'Small campaigns need donations, user roles and reporting without paying a platform a cut of every dollar.',
      outcome: 'Campaign pages, a donation flow, an organiser dashboard and admin analytics, all read from one donation ledger so every total agrees. The live demo has one-click organiser and admin accounts, fictional data and no real money.',
    },
    demo: { label: 'Live demo', href: 'https://captainfunds.netlify.app/' },
    source: 'https://github.com/solufelo/captain-funds-mern',
  },
  {
    slug: 'velare',
    title: 'Velare',
    client: 'Concept brand',
    role: '3D, motion, front end',
    summary: 'Launch site for a concept electric motorcycle: a scroll-driven 3D walkaround, a 3D configurator and a reservation flow.',
    status: 'live',
    categories: ['code', 'motion'],
    tags: ['Next.js', 'three.js', 'R3F', 'Framer Motion'],
    image: '/assets/projects/velare.webp',
    gallery: ['/assets/work/velare-home.webp', '/assets/work/velare-configure.webp', '/assets/work/velare-exploded.webp', '/assets/work/velare-finishes.webp'],
    overview: {
      what: 'A product landing page for an electric motorbike, built around a 3D model you can turn and zoom.',
      problem: 'Product pages for premium hardware usually fall back to photos. A 3D model lets a visitor explore the bike the way they would in a showroom.',
      outcome: 'A scroll-driven 3D walkaround, a configurator for edition and finish, an exploded view of the technology, and a reservation flow that checks every field and returns a reference. Visitors who prefer reduced motion get a still version of the story.',
    },
    demo: { label: 'Live demo', href: 'https://velare-site.netlify.app/' },
    source: 'https://github.com/solufelo/velare-site',
  },
  {
    slug: 'suburbia',
    title: 'Suburbia',
    client: 'Concept skate shop',
    role: 'Design, CMS, front end',
    summary: 'Skate shop on a headless CMS: a 3D board builder, a cart that survives reloads and a demo checkout.',
    status: 'live',
    categories: ['code'],
    tags: ['Next.js', 'Prismic', 'R3F', 'GSAP', 'Stripe'],
    image: '/assets/projects/suburbia.webp',
    gallery: ['/assets/work/suburbia-home.webp', '/assets/work/suburbia-builder.webp', '/assets/work/suburbia-product.webp', '/assets/work/suburbia-receipt.webp'],
    overview: {
      what: 'An e-commerce site for a skateboard brand: board customiser, product grid and team page, all editable in a headless CMS.',
      problem: 'A small brand needs a shop it can update itself, with product pages that rank, and no developer on call.',
      outcome: 'Shop, product pages and a 3D builder for custom completes, a cart that survives reloads, and a checkout that runs on Stripe test mode or a labelled demo, so nothing is ever charged. Products and pages are edited in Prismic, without code.',
    },
    demo: { label: 'Live demo', href: 'https://suburbia-solo.netlify.app/' },
    source: 'https://github.com/solufelo/suburbia-solo',
  },
  {
    slug: 'cinemaverse',
    title: 'CinemaVerse',
    client: 'Personal project',
    role: 'Full stack',
    summary: 'Social film log: watch status, ratings, a squad feed and AI picks, on live TMDB data.',
    status: 'live',
    categories: ['code'],
    tags: ['React', 'TypeScript', 'PostgreSQL', 'Netlify Functions', 'AI'],
    image: '/assets/projects/cinemaverse.webp',
    gallery: ['/assets/work/cinemaverse-home.webp', '/assets/work/cinemaverse-feed.webp', '/assets/work/cinemaverse-foryou.webp', '/assets/work/cinemaverse-profile.webp'],
    overview: {
      what: 'A gamer-style social layer on top of TMDB: log films, share your watch status, see what your squad is watching.',
      problem: 'Film trackers are either spreadsheets or bloated social networks. This keeps it to a feed, a watchlist and recommendations.',
      outcome: 'Mark a film watching, completed, queued or dropped, rate it and add a take, and it lands on your watchlist, your public profile and the squad feed. "For you" picks come from OpenRouter, with a built-in taste-match engine as the fallback. A one-click guest account lets anyone try it.',
    },
    demo: { label: 'Live demo', href: 'https://cinemaverse-solo.netlify.app/' },
    source: 'https://github.com/solufelo/cinemaverse-solo-wapp',
  },
  {
    slug: 'godways-ministry',
    title: 'Godways Ministry',
    client: 'Godways International Ministry, Toronto',
    role: 'Design, front end, API, CMS',
    summary: 'Client pitch demo: the ministry’s real copy and brand, a sermon library, events, and a CMS for staff.',
    status: 'live',
    categories: ['code'],
    tags: ['React', 'Vite', 'Express', 'Render'],
    image: '/assets/projects/godways.webp',
    gallery: ['/assets/work/godways-home.webp', '/assets/work/godways-sermons.webp', '/assets/work/godways-week.webp', '/assets/work/godways-cms.webp'],
    overview: {
      what: 'A church website: welcome, latest sermon, message library, ministries, events and a give page, in the ministry’s own brand.',
      problem: 'The ministry needed to see what a modern site would look like before committing. A pitch deck wouldn’t do it.',
      outcome: 'A working site with their real copy: a searchable sermon library, the weekly schedule, events, a countdown to the next Sunday service, and a PIN-protected CMS so staff can publish sermons themselves.',
    },
    demo: { label: 'Live demo', href: 'https://godways-demo-wapp.onrender.com/' },
    source: 'https://github.com/solufelo/godways-demo-wapp',
  },
  {
    slug: 'captainsolo-ca',
    title: 'captainsolo.ca',
    client: 'Personal project',
    role: 'Design, build, video, hosting',
    summary: 'This site. Rebuilt October 2026: prerendered React pages, a showreel in a camera viewfinder, and a contact form on Cloudflare Workers.',
    status: 'live',
    categories: ['code', 'motion'],
    tags: ['React', 'Vite', 'Cloudflare', 'Video'],
    image: '/assets/projects/captainsolo.webp',
    gallery: ['/og-image.jpg', '/assets/projects/captainsolo.webp'],
    overview: {
      what: 'The site you’re on: portfolio, blog, voice-tag shop and contact form, with my showreel running inside a camera viewfinder in the hero.',
      problem: 'The previous version ran on shared cPanel hosting with a Python backend for a handful of features, and cost money every year for what is mostly a static site.',
      outcome: 'Every page is prerendered to HTML, the hero is an 11-second, 1.3 MB showreel instead of a WebGL scene, and the contact form runs on a Cloudflare Worker. Hosting cost: $0.',
    },
    source: 'https://github.com/solufelo/captainsolo.ca',
  },
  {
    slug: 'barbershop-promo',
    title: 'Barbershop promo',
    client: 'A Brampton barbershop',
    role: 'Shoot, edit, colour',
    summary: 'High-energy social promo: cinematic cuts synced to the music.',
    status: 'live',
    categories: ['video'],
    tags: ['Premiere Pro', 'Sony A6100'],
    image: '/assets/projects/barbershop-promo.webp',
    video: '/assets/videos/barbershop-promo.mp4',
    overview: {
      what: 'A one-minute vertical promo for a barbershop: fades, detail shots and the finished cut, edited to the beat.',
      problem: 'A barbershop lives on walk-ins and word of mouth. A promo that looks like the work gives people a reason to book.',
      outcome: 'A platform-ready vertical edit for Instagram and TikTok, shot and delivered as a single piece.',
    },
    demo: { label: 'Watch on Instagram', href: 'https://www.instagram.com/reel/CsCKDtUJGo2/' },
  },
  {
    slug: 'club-event',
    title: 'Club event coverage',
    client: 'Event promoter',
    role: 'Multi-cam shoot, edit',
    summary: 'Event energy captured with fast, beat-synced editing.',
    status: 'live',
    categories: ['video'],
    tags: ['Multi-cam', 'Gimbal', 'Live coverage'],
    image: '/assets/projects/club-event.webp',
    video: '/assets/videos/club-event.mp4',
    overview: {
      what: 'A recap of a club night: crowd, lights and the DJ, shot handheld and on a gimbal in low light.',
      problem: 'Promoters need next-day content that makes the last event look like the one you missed.',
      outcome: 'A fast, beat-synced vertical recap ready for the promoter’s socials.',
    },
    demo: { label: 'Watch on Instagram', href: 'https://www.instagram.com/reel/CqQzDikJRQj/' },
  },
  {
    slug: 'womens-basketball',
    title: 'Women’s university basketball',
    client: 'University athletics',
    role: 'Shoot, edit',
    summary: 'Athletic highlights for university athletics.',
    status: 'live',
    categories: ['video'],
    tags: ['Sports video', 'Telephoto'],
    image: '/assets/projects/womens-basketball.webp',
    video: '/assets/videos/womens-basketball.mp4',
    overview: {
      what: 'Game highlights for a women’s university basketball team: plays, reactions and the bench, cut for social.',
      problem: 'Athletics departments need highlights out fast, while the game is still being talked about.',
      outcome: 'A 90-second vertical highlight reel delivered for the team’s channels.',
    },
    demo: { label: 'Watch on Instagram', href: 'https://www.instagram.com/reel/Coi6VfvuGDq/' },
  },
  {
    slug: 'mens-basketball',
    title: 'Men’s basketball recap',
    client: 'University athletics',
    role: 'Multi-cam shoot, edit',
    summary: 'University athletics game recap: multi-cam, beat-synced cuts.',
    status: 'live',
    categories: ['video'],
    tags: ['Athletics', 'Game recap'],
    image: '/assets/projects/mens-basketball.webp',
    video: '/assets/videos/mens-basketball.mp4',
    overview: {
      what: 'A men’s university basketball game recap from two camera positions, cut to music.',
      problem: 'A single courtside angle misses half the game. Two cameras and a tight edit keep the pace up.',
      outcome: 'A one-minute recap with baseline and elevated angles, beat-synced, delivered for the athletics channels.',
    },
    demo: { label: 'Watch on Instagram', href: 'https://www.instagram.com/reel/C0VtaMVM0iF/' },
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

export const about = {
  heading: 'Brampton-based. I build, ship and host my own work.',
  paragraphs: [
    'I build and ship from Brampton: client sites, this portfolio, and the deploy scripts behind it. I own every build, start to finish.',
    'Right now I’m focused on local businesses: the shoot, the site and the upkeep, handled by one person who answers the phone.',
    'Before code paid the bills, video and audio did. Years of it.',
  ],
  portrait: '/images/solomon-portrait-20260624.webp',
}

export type BrandPackage = { id: string; name: string; tagline: string; includes: string[]; featured?: boolean }

// No prices on purpose: every package is quoted after a short call. Edit freely.
export const brandPackages: BrandPackage[] = [
  {
    id: 'Shoot',
    name: 'Shoot',
    tagline: 'Fresh photos and short-form video for your socials.',
    includes: ['Half-day photo + video shoot', 'Edited photo set', '3 short vertical edits for Reels / TikTok', 'Colour graded, platform-ready exports'],
  },
  {
    id: 'Shoot + Site',
    name: 'Shoot + Site',
    tagline: 'Everything in Shoot, plus a site that shows it off.',
    includes: ['Everything in Shoot', 'One-page website built around your shoot', 'Contact or booking form to your inbox', 'Domain, hosting and SSL set up', 'Google Business Profile tune-up'],
  },
  {
    id: 'Full brand',
    name: 'Full brand',
    featured: true,
    tagline: 'A complete personal or business brand you can run yourself.',
    includes: [
      'Everything in Shoot + Site',
      'Multi-page site with a CMS so you edit your own text and photos',
      'Customer list: every enquiry and booking saved in one place',
      'Business email on your domain',
      'Local SEO for Brampton & the GTA',
      'Handover session so you’re never stuck',
    ],
  },
]

// After launch: site care is a flat monthly fee; content shoots are booked on top, monthly or one at a time.
export const retainers = [
  {
    name: 'Site care',
    tagline: 'One flat monthly fee. Your site stays fast, safe and current.',
    includes: ['Hosting, SSL and backups handled', 'Text, photo and menu updates whenever you ask', 'Security and speed checks', 'A short monthly report on visits and enquiries'],
  },
  {
    name: 'Content shoots',
    tagline: 'Add-on, monthly or one-off. Fresh material for your socials and site.',
    includes: ['Photo + short video sessions at your location', 'Vertical edits for Reels and TikTok', 'New photos added to your site the same week', 'Book monthly for a better rate'],
  },
]

export const process = [
  { step: 'Call', body: 'A 20-minute chat about your business, your customers and what you need.' },
  { step: 'Shoot', body: 'Photos and video at your location, planned around your brand.' },
  { step: 'Build', body: 'Your site, built with your own content. You see it before anyone else.' },
  { step: 'Launch', body: 'Domain, email and Google set up. Then I show you how to run it.' },
]

export const contactServices = ['Brand package', 'Photo / video shoot', 'Website', 'Web app / full-stack build', 'Voice tag', 'Collaboration / other']
export const budgets = ['Under $1,000', '$1,000 – $2,500', '$2,500 – $5,000', '$5,000+', 'Not sure yet']
