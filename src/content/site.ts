// Site copy carried over from the June 2026 build. Edit here; every page reads from this file.

export const site = {
  name: 'Solomon Olufelo',
  alias: 'Captain Solo',
  url: 'https://captainsolo.ca',
  email: 'work@captainsolo.ca',
  location: 'Brampton, ON · Serving the GTA',
  portrait: '/images/solomon-portrait-20260624.webp',
  /** Cal.com event, e.g. 'captainsolo/intro'. Empty: Book a call opens the contact form instead. */
  cal: 'solomon-olufelo/30min',
  roles: ['Creative technologist', 'Full-stack developer', 'Motion & video'],
  tagline: 'Shipped demos, case studies, and client work across code and camera.',
  description:
    'Solomon Olufelo shoots photos and video and builds websites for businesses in Brampton and the GTA: from the first call to launch and the monthly upkeep.',
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


export type Category = 'code' | 'video' | 'motion' | 'photo' | 'design'

export type Project = {
  slug: string
  title: string
  /** Who it was for; "Personal project" when it's yours. */
  client: string
  /** What you did on it. */
  role: string
  summary: string
  /** One or two words for the work list, e.g. "Web app". */
  kind: string
  status: 'live' | 'wip'
  categories: Category[]
  tags: string[]
  image: string
  video?: string
  /** Short silent loop shown when the work-list row is hovered. */
  preview?: string
  /** Real screens for the case-study page; falls back to `image`. */
  gallery?: string[]
  /** 'grid' lays pieces out in columns instead of one wide stack; 'dense' uses four narrow columns (vertical frames, cover walls). */
  layout?: 'grid' | 'dense'
  /** Silent loop shown big at the top of the case study; `poster` is its first frame. */
  loop?: string
  poster?: string
  demo?: { label: string; href: string }
  source?: string
}

export const projects: Project[] = [
  {
    slug: 'ten-fold',
    title: 'Ten Fold',
    client: 'TGK',
    role: 'Edit',
    summary: 'Music video filmed between Paris and a Greek island, finished in a film-gate look.',
    kind: 'Music video',
    preview: '/assets/previews/ten-fold.mp4',
    status: 'live',
    categories: ['video'],
    tags: ['Music video', 'Travel', 'Colour'],
    image: '/assets/projects/ten-fold.webp',
    loop: '/assets/videos/ten-fold-loop.mp4',
    poster: '/assets/work/ten-fold-poster.webp',
    gallery: ['/assets/work/ten-fold-1.webp', '/assets/work/ten-fold-2.webp', '/assets/work/ten-fold-3.webp', '/assets/work/ten-fold-4.webp'],
    layout: 'grid',
  },
  {
    slug: 'tec',
    title: 'TEC',
    client: '10k Moss',
    role: 'Shot and edited',
    summary: 'A built teal set, hard coloured light and a fire title.',
    kind: 'Music video',
    preview: '/assets/previews/tec-q.mp4',
    status: 'live',
    categories: ['video'],
    tags: ['Music video', 'Set design', 'VFX'],
    image: '/assets/projects/tec.webp',
    loop: '/assets/videos/tec-loop-q.mp4',
    poster: '/assets/work/tec-poster-q.webp',
    gallery: ['/assets/work/tec-1-q.webp', '/assets/work/tec-2-q.webp', '/assets/work/tec-3-q.webp', '/assets/work/tec-4-q.webp'],
    layout: 'grid',
  },
  {
    slug: 'july-6',
    title: 'July 6',
    client: 'Dela',
    role: 'Director',
    summary: 'Black-and-white street portraits around Spadina and Chinatown.',
    kind: 'Music video',
    preview: '/assets/previews/july-6.mp4',
    status: 'live',
    categories: ['video'],
    tags: ['Music video', 'Black and white', 'Toronto'],
    image: '/assets/projects/july-6.webp',
    loop: '/assets/videos/july-6-loop.mp4',
    poster: '/assets/work/july-6-poster.webp',
    gallery: ['/assets/work/july-6-1.webp', '/assets/work/july-6-2.webp', '/assets/work/july-6-3.webp', '/assets/work/july-6-4.webp'],
    layout: 'grid',
  },
  {
    slug: 'primary-lotus',
    title: 'Primary Lotus',
    client: 'J.V',
    role: 'Shot and edited',
    summary: 'Summer backlight, shallow focus and fast, clean cutting.',
    kind: 'Music video',
    preview: '/assets/previews/primary-lotus.mp4',
    status: 'live',
    categories: ['video'],
    tags: ['Music video', 'Natural light', 'Lyrics'],
    image: '/assets/projects/primary-lotus-q.webp',
    loop: '/assets/videos/primary-lotus-loop.mp4',
    poster: '/assets/work/primary-lotus-poster-q.webp',
    gallery: ['/assets/work/primary-lotus-1.webp', '/assets/work/primary-lotus-2-q.webp', '/assets/work/primary-lotus-3-q.webp', '/assets/work/primary-lotus-4.webp'],
    layout: 'grid',
  },
  {
    slug: 'stepwhiz',
    title: 'StepWhiz',
    client: 'Personal product',
    role: 'Design, full stack, AI',
    summary: 'AI study app: snap a problem, get a sourced step-by-step answer, then flashcards that make it stick.',
    kind: 'AI study app',
    status: 'live',
    categories: ['code'],
    tags: ['TypeScript', 'Fastify', 'Preact', 'AI'],
    image: '/assets/projects/stepwhiz.webp',
    gallery: ['/assets/work/stepwhiz-1.webp', '/assets/work/stepwhiz-2.webp', '/assets/work/stepwhiz-3.webp', '/assets/work/stepwhiz-4.webp'],
    demo: { label: 'Live demo', href: 'https://stepwhiz.onrender.com/app/' },
  },
  {
    slug: 'unicreate-studio',
    title: 'UniCreate Studio',
    client: 'Captain Solo Creative',
    role: 'Design, full stack, video engine',
    summary: 'Drop in a shoot, get finished short-form clips: cut, captioned, checked and ready to post.',
    kind: 'Video app',
    status: 'live',
    categories: ['code', 'video'],
    tags: ['Next.js', 'Python', 'FFmpeg', 'Postgres'],
    image: '/assets/projects/unicreate.webp',
    gallery: ['/assets/work/unicreate-1.webp', '/assets/work/unicreate-2.webp', '/assets/work/unicreate-3.webp', '/assets/work/unicreate-4.webp'],
    demo: { label: 'Live demo', href: 'https://unicreate-studio-demo.onrender.com' },
  },
  {
    slug: 'captain-funds',
    title: 'Captain Funds',
    client: 'Personal project',
    role: 'Design, front end, API, database',
    summary: 'MERN fundraising platform: campaign creation, donations, role-based access, admin analytics.',
    kind: 'Web app',
    status: 'live',
    categories: ['code'],
    tags: ['React', 'TypeScript', 'Express', 'MongoDB', 'Stripe'],
    image: '/assets/projects/captainfunds.webp',
    gallery: ['/assets/work/captainfunds-landing.webp', '/assets/work/captainfunds-dashboard.webp', '/assets/work/captainfunds-admin.webp', '/assets/work/captainfunds-donate.webp'],
    demo: { label: 'Live demo', href: 'https://captainfunds.netlify.app/' },
    source: 'https://github.com/solufelo/captain-funds-mern',
  },
  {
    slug: 'velare',
    title: 'Velare',
    client: 'Concept brand',
    role: '3D, motion, front end',
    summary: 'Launch site for a concept electric motorcycle: a scroll-driven 3D walkaround, a 3D configurator and a reservation flow.',
    kind: '3D website',
    status: 'live',
    categories: ['code', 'motion'],
    tags: ['Next.js', 'three.js', 'R3F', 'Framer Motion'],
    image: '/assets/projects/velare.webp',
    preview: '/assets/previews/velare-promo-q.mp4',
    loop: '/assets/videos/velare-promo-loop-q.mp4',
    poster: '/assets/work/velare-promo-poster-q.webp',
    gallery: ['/assets/work/velare-home.webp', '/assets/work/velare-configure.webp', '/assets/work/velare-exploded.webp', '/assets/work/velare-finishes.webp'],
    demo: { label: 'Live demo', href: 'https://velare-site.netlify.app/' },
    source: 'https://github.com/solufelo/velare-site',
  },
  {
    slug: 'suburbia',
    title: 'Suburbia',
    client: 'Concept skate shop',
    role: 'Design, CMS, front end',
    summary: 'Skate shop on a headless CMS: a 3D board builder, a cart that survives reloads and a demo checkout.',
    kind: 'Online shop',
    status: 'live',
    categories: ['code'],
    tags: ['Next.js', 'Prismic', 'R3F', 'GSAP', 'Stripe'],
    image: '/assets/projects/suburbia.webp',
    gallery: ['/assets/work/suburbia-home.webp', '/assets/work/suburbia-builder.webp', '/assets/work/suburbia-product.webp', '/assets/work/suburbia-receipt.webp'],
    demo: { label: 'Live demo', href: 'https://suburbia-solo.netlify.app/' },
    source: 'https://github.com/solufelo/suburbia-solo',
  },
  {
    slug: 'cinemaverse',
    title: 'CinemaVerse',
    client: 'Personal project',
    role: 'Full stack',
    summary: 'Social film log: watch status, ratings, a squad feed and AI picks, on live TMDB data.',
    kind: 'Web app',
    status: 'live',
    categories: ['code'],
    tags: ['React', 'TypeScript', 'PostgreSQL', 'Netlify Functions', 'AI'],
    image: '/assets/projects/cinemaverse.webp',
    gallery: ['/assets/work/cinemaverse-home.webp', '/assets/work/cinemaverse-feed.webp', '/assets/work/cinemaverse-foryou.webp', '/assets/work/cinemaverse-profile.webp'],
    demo: { label: 'Live demo', href: 'https://cinemaverse-solo.netlify.app/' },
    source: 'https://github.com/solufelo/cinemaverse-solo-wapp',
  },
  {
    slug: 'godways-ministry',
    title: 'Godways Ministry',
    client: 'Godways International Ministry, Toronto',
    role: 'Design, front end, API, CMS',
    summary: 'Client pitch demo: the ministry’s real copy and brand, a sermon library, events, and a CMS for staff.',
    kind: 'Website',
    status: 'live',
    categories: ['code'],
    tags: ['React', 'Vite', 'Express', 'Render'],
    image: '/assets/projects/godways.webp',
    gallery: ['/assets/work/godways-home.webp', '/assets/work/godways-sermons.webp', '/assets/work/godways-week.webp', '/assets/work/godways-cms.webp'],
    demo: { label: 'Live demo', href: 'https://godways-demo-wapp.onrender.com/' },
    source: 'https://github.com/solufelo/godways-demo-wapp',
  },
  {
    slug: 'captainsolo-ca',
    title: 'captainsolo.ca',
    client: 'Personal project',
    role: 'Design, build, video, hosting',
    summary: 'This site. Rebuilt October 2026: prerendered React pages, a showreel in a camera viewfinder, and a contact form on Cloudflare Workers.',
    kind: 'This site',
    status: 'live',
    categories: ['code', 'motion'],
    tags: ['React', 'Vite', 'Cloudflare', 'Video'],
    image: '/assets/projects/captainsolo.webp',
    gallery: ['/og-image.jpg', '/assets/projects/captainsolo.webp'],
    source: 'https://github.com/solufelo/captainsolo.ca',
  },
  {
    slug: 'laurier-gameday',
    title: 'Laurier Game Day',
    client: 'Laurier Golden Hawks Athletics',
    role: 'Design, 3D, motion',
    summary: 'Game-day graphics for Golden Hawks football: social posts, countdown stories, 3D helmet renders and the live-stream scorebug.',
    kind: 'Sports design',
    preview: '/assets/previews/laurier-gameday.mp4',
    status: 'live',
    categories: ['design', 'motion'],
    tags: ['Blender', 'After Effects', 'Photoshop', 'Broadcast'],
    image: '/assets/projects/laurier-gameday-q.webp',
    loop: '/assets/videos/laurier-cinematic-opener.mp4',
    poster: '/assets/work/laurier-cinematic-opener-poster.webp',
    gallery: ['/assets/work/laurier-senior-day.webp', '/assets/work/laurier-countdown-1.webp', '/assets/work/laurier-countdown-2.webp', '/assets/work/laurier-countdown-3.webp', '/assets/work/laurier-endzone.webp', '/assets/work/laurier-bhm.webp', '/assets/work/laurier-crest.webp', '/assets/work/laurier-broadcast.webp'],
    layout: 'grid',
  },
  {
    slug: 'solvra',
    title: 'SOLVRA',
    client: 'SOLVRA skincare',
    role: '3D product visuals',
    summary: '3D product visuals for a skincare line: stills and a short product film.',
    kind: '3D product visuals',
    preview: '/assets/previews/solvra.mp4',
    status: 'live',
    categories: ['motion', 'design'],
    tags: ['3D', 'Product', 'Motion'],
    image: '/assets/projects/solvra-q.webp',
    loop: '/assets/videos/solvra-loop.mp4',
    poster: '/assets/work/solvra-poster.webp',
    gallery: ['/assets/work/solvra-1.webp', '/assets/work/solvra-2.webp', '/assets/work/solvra-3.webp'],
    layout: 'grid',
  },
  {
    slug: 'no-captains-orders',
    title: 'No Captain’s Orders',
    client: 'Concept brand',
    role: '3D, motion, label design',
    summary: 'A 3D launch film for a concept Pinot Noir: gold-foil label, glass and a wine splash.',
    kind: '3D product ad',
    preview: '/assets/previews/no-captains-orders.mp4',
    status: 'live',
    categories: ['motion', 'design'],
    tags: ['3D', 'Motion', 'Label design'],
    image: '/assets/projects/no-captains-orders.webp',
    loop: '/assets/videos/no-captains-orders-loop.mp4',
    poster: '/assets/work/no-captains-orders-poster.webp',
    gallery: ['/assets/work/no-captains-orders-1.webp', '/assets/work/no-captains-orders-2.webp', '/assets/work/no-captains-orders-3.webp', '/assets/work/no-captains-orders-4.webp'],
    layout: 'grid',
  },
  {
    slug: 'cover-art',
    title: 'Cover art',
    client: 'Kenoh, J Finesse, TGK, JV and others',
    role: 'Design, photography',
    summary: 'Single and album covers for GTA artists, from the shoot to the type.',
    kind: 'Cover art',
    status: 'live',
    categories: ['design'],
    tags: ['Photoshop', 'Photography', 'Type'],
    image: '/assets/projects/cover-art-q.webp',
    loop: '/assets/videos/writing-my-story-loop.mp4',
    poster: '/assets/work/writing-my-story-poster.webp',
    gallery: ['/assets/work/cover-misdirection.webp', '/assets/work/cover-get-together.webp', '/assets/work/cover-no-manners.webp', '/assets/work/cover-livin-lies.webp', '/assets/work/cover-how-we-do.webp', '/assets/work/cover-aint-sad.webp', '/assets/work/cover-mexico.webp', '/assets/work/cover-rubber-band-man.webp', '/assets/work/cover-where-i-live.webp', '/assets/work/cover-jfinesse-chrome.webp', '/assets/work/cover-break-the-bank.webp', '/assets/work/cover-childs-play.webp', '/assets/work/cover-gift-n-curse.webp', '/assets/work/cover-cold-summer.webp', '/assets/work/cover-cold-summer-back.webp', '/assets/work/cover-fairy-remix.webp', '/assets/work/cover-i-miss-you.webp'],
    layout: 'dense',
  },
  {
    slug: 'koldhearted-lookbook',
    title: 'KOLDHEARTED lookbook',
    client: 'KOLDHEARTED apparel',
    role: 'Photography',
    summary: 'Apparel lookbook on a colour-loud set, plus product shots for the shop.',
    kind: 'Photography',
    status: 'live',
    categories: ['photo'],
    tags: ['Sony A6100', 'Lookbook', 'Product'],
    image: '/assets/projects/koldhearted-q.webp',
    gallery: ['/assets/work/koldhearted-g1.webp', '/assets/work/koldhearted-g2.webp', '/assets/work/koldhearted-g3.webp', '/assets/work/koldhearted-g4-q.webp', '/assets/work/koldhearted-g5.webp', '/assets/work/koldhearted-g6.webp'],
    layout: 'grid',
  },
  {
    slug: 'platinum-plaques',
    title: 'Platinum plaques',
    client: 'UTM, artist management',
    role: 'Photography',
    summary: 'Plaque shoot for an artist-management label: the awards, the details and the artist with them.',
    kind: 'Product photography',
    status: 'live',
    categories: ['photo'],
    tags: ['Product', 'Studio', 'Music'],
    image: '/assets/projects/plaques-q.webp',
    gallery: ['/assets/work/plaques-1.webp', '/assets/work/plaques-2.webp', '/assets/work/plaques-3.webp', '/assets/work/plaques-4.webp', '/assets/work/plaques-5.webp'],
    layout: 'grid',
  },
  {
    slug: 'photo-selects',
    title: 'Photo selects',
    client: 'Artists and events',
    role: 'Photography',
    summary: 'Studio portraits, sessions, street style and nights out.',
    kind: 'Photography',
    status: 'live',
    categories: ['photo'],
    tags: ['Sony A6100', 'Events', 'Studio'],
    image: '/assets/projects/photo-selects-q.webp',
    gallery: ['/assets/work/portrait-1.webp', '/assets/work/portrait-2.webp', '/assets/work/portrait-3.webp', '/assets/work/selects-g1-q.webp', '/assets/work/selects-g2.webp', '/assets/work/selects-g3.webp', '/assets/work/selects-g4.webp', '/assets/work/selects-g5.webp'],
    layout: 'grid',
  },
  {
    slug: 'moksha-festival',
    title: 'Festival of Diversity',
    client: 'Moksha Canada',
    role: 'Edit',
    summary: 'Festival promo at Nathan Phillips Square: performers, crowd and kinetic titles.',
    kind: 'Event promo',
    preview: '/assets/previews/moksha-festival.mp4',
    status: 'live',
    categories: ['video'],
    tags: ['Event', '4K', 'Motion titles'],
    image: '/assets/projects/moksha-festival-q.webp',
    loop: '/assets/videos/moksha-festival-loop.mp4',
    poster: '/assets/work/moksha-festival-poster.webp',
    gallery: ['/assets/work/moksha-festival-1.webp', '/assets/work/moksha-festival-2-q.webp', '/assets/work/moksha-festival-3.webp', '/assets/work/moksha-festival-4.webp'],
    layout: 'grid',
  },
  {
    slug: 'vair-drop',
    title: 'Vair drop teaser',
    client: 'Vair Studios',
    role: 'Shot and edited',
    summary: 'Drop teaser for a clothing label: product-first framing and split screens.',
    kind: 'Brand video',
    preview: '/assets/previews/vair-drop.mp4',
    status: 'live',
    categories: ['video'],
    tags: ['Brand', '4K', 'Apparel'],
    image: '/assets/projects/vair-drop.webp',
    loop: '/assets/videos/vair-drop-loop.mp4',
    poster: '/assets/work/vair-drop-poster.webp',
    gallery: ['/assets/work/vair-drop-1.webp', '/assets/work/vair-drop-2.webp', '/assets/work/vair-drop-3-q.webp', '/assets/work/vair-drop-4.webp'],
    layout: 'grid',
  },
  {
    slug: 'barbershop-promo',
    title: 'Barbershop promo',
    client: 'A Brampton barbershop',
    role: 'Shoot, edit, colour',
    summary: 'High-energy social promo: cinematic cuts synced to the music.',
    kind: 'Brand video',
    preview: '/assets/previews/barbershop-promo-q.mp4',
    status: 'live',
    categories: ['video'],
    tags: ['Premiere Pro', 'Sony A6100'],
    image: '/assets/projects/barbershop-promo.webp',
    video: '/assets/videos/barbershop-promo-q.mp4',
    demo: { label: 'Watch on Instagram', href: 'https://www.instagram.com/reel/CsCKDtUJGo2/' },
  },
  {
    slug: 'club-event',
    title: 'Club event coverage',
    client: 'Event promoter',
    role: 'Multi-cam shoot, edit',
    summary: 'Event energy captured with fast, beat-synced editing.',
    kind: 'Event video',
    preview: '/assets/previews/club-event-q.mp4',
    status: 'live',
    categories: ['video'],
    tags: ['Multi-cam', 'Gimbal', 'Live coverage'],
    image: '/assets/projects/club-event.webp',
    video: '/assets/videos/club-event-q.mp4',
    demo: { label: 'Watch on Instagram', href: 'https://www.instagram.com/reel/CqQzDikJRQj/' },
  },
  {
    slug: 'womens-basketball',
    title: 'Women’s university basketball',
    client: 'University athletics',
    role: 'Shoot, edit',
    summary: 'Athletic highlights for university athletics.',
    kind: 'Sports video',
    preview: '/assets/previews/womens-basketball.mp4',
    status: 'live',
    categories: ['video'],
    tags: ['Sports video', 'Telephoto'],
    image: '/assets/projects/womens-basketball.webp',
    video: '/assets/videos/womens-basketball.mp4',
    demo: { label: 'Watch on Instagram', href: 'https://www.instagram.com/reel/Coi6VfvuGDq/' },
  },
  {
    slug: 'mens-basketball',
    title: 'Men’s basketball recap',
    client: 'University athletics',
    role: 'Multi-cam shoot, edit',
    summary: 'University athletics game recap: multi-cam, beat-synced cuts.',
    kind: 'Sports video',
    preview: '/assets/previews/mens-basketball.mp4',
    status: 'live',
    categories: ['video'],
    tags: ['Athletics', 'Game recap'],
    image: '/assets/projects/mens-basketball.webp',
    video: '/assets/videos/mens-basketball.mp4',
    demo: { label: 'Watch on Instagram', href: 'https://www.instagram.com/reel/C0VtaMVM0iF/' },
  },
  {
    slug: 'savyan-salon',
    title: 'Savyan Shades',
    client: 'Savyan Shades Beauty Salon',
    role: 'Shot and edited',
    summary: 'Promo reel for a beauty salon: nails, braids and a bright pink studio.',
    kind: 'Brand video',
    preview: '/assets/previews/savyan-salon-v2.mp4',
    status: 'live',
    categories: ['video'],
    tags: ['Local business', 'Vertical', 'Social'],
    image: '/assets/projects/savyan-salon.webp',
    loop: '/assets/videos/savyan-salon-loop-v2.mp4',
    poster: '/assets/work/savyan-salon-poster-v2.webp',
    gallery: ['/assets/work/savyan-salon-v2-1.webp', '/assets/work/savyan-salon-v2-2.webp', '/assets/work/savyan-salon-v2-3.webp', '/assets/work/savyan-salon-v2-4.webp'],
    layout: 'dense',
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)


// Home page, in the order a business owner reads it: their problem, the work, what I do, how, questions, a call.
export const pains = [
  'Photos from your phone, or from years ago.',
  'A website that’s slow, dated or missing.',
  'One person for the site, another for the shoot, and none of it matches.',
]

export const clients = ['Laurier Golden Hawks', 'KOLDHEARTED', 'SOLVRA', 'Savyan Shades', 'Moksha Canada', 'Vair Studios', 'UTM', 'TGK', '10k Moss', 'Dela', 'J.V', 'Kenoh', 'J Finesse']

export const offers = [
  { title: 'Websites', line: 'A fast site that brings in bookings, and that you can update yourself.' },
  { title: 'Photo & video', line: 'Shoots at your place that make people stop scrolling and walk in.' },
  { title: 'Care plan', line: 'Hosting, edits and fresh content every month, so it never goes stale.' },
]

export const faqs = [
  { q: 'What does it cost?', a: 'Every project is quoted after a short call, so you only pay for what you need.' },
  { q: 'Do I need to be technical?', a: 'No. You get a site you can edit yourself and a walkthrough at launch.' },
  { q: 'Can you shoot at my location?', a: 'Yes: your shop, studio or event, anywhere in the GTA.' },
  { q: 'What happens after launch?', a: 'Site care covers hosting, updates and fixes for one monthly fee. Add content shoots whenever you want fresh material.' },
  { q: 'Do you only work with businesses?', a: 'Mostly local businesses, plus music videos and cover art for artists.' },
]

/** Where every "Book a call" button goes: the booking calendar, or the contact form with the request written. */
export const bookCall = site.cal ? '/book' : '/contact?call=1'

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
  { step: 'Call', body: 'Thirty minutes on what you sell, who buys it and what isn’t working.' },
  { step: 'Shoot and build', body: 'I shoot at your place and build the site around it. You see it first.' },
  { step: 'Launch and care', body: 'Domain, email and Google set up, then I keep it fresh every month.' },
]

export const contactServices = ['Brand package', 'Photo / video shoot', 'Website', 'Web app / full-stack build', 'Voice tag', 'Collaboration / other']
export const budgets = ['Under $1,000', '$1,000 – $2,500', '$2,500 – $5,000', '$5,000+', 'Not sure yet']
