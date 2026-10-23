// Share cards for the case studies and the main pages: public/og/<slug>.jpg, 1200x630, the og:image in src/meta.ts.
// Run: node scripts/og_cards.mjs [slug ...]   (again after adding a project or changing its title or image; the build
// fails on a case page whose card is missing). Renders in installed Chrome, which can also seek the H.264 clips.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const file = (p) => pathToFileURL(join(root, p)).href
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

// Each project's own top-level fields (4-space indent: a clip's title or poster is deeper).
const src = readFileSync(join(root, 'src/content/site.ts'), 'utf8')
const list = src.slice(src.indexOf('export const projects'), src.indexOf('export const getProject'))
const field = (body, key) => body.match(new RegExp(`\\n {4}${key}: '([^']*)'`))?.[1]
const projects = [...list.matchAll(/\n {4}slug: '([^']+)'((?:(?!\n {4}slug: ')[\s\S])*)/g)].map(([, slug, body]) => ({
  slug,
  title: field(body, 'title'),
  kind: field(body, 'kind'),
  client: field(body, 'client'),
  image: field(body, 'image'),
  // web projects show their card as a screen, not a full-bleed photo: a fade would put the site's own text behind the title
  screen: /\n {4}categories: \[[^\]]*'code'/.test(body),
}))

// Cards that won't read at share size (three-frame triptychs, split frames) use one real still of the project instead:
// its poster or a gallery still, or a frame of its own video at second t. pos is the CSS object-position.
const still = {
  'ten-fold': { src: '/assets/work/ten-fold-2-cc.webp' },
  solvra: { src: '/assets/work/solvra-2.webp', pos: '50% 40%' },
  'platinum-plaques': { src: '/assets/work/plaques-2.webp', pos: '50% 30%' },
  'photo-selects': { src: '/assets/work/portrait-1.webp', pos: '50% 25%' },
  'barbershop-promo': { src: '/assets/videos/barbershop-promo-q.mp4', t: 53.6, pos: '50% 25%' },
  'barbershop-braids': { src: '/assets/videos/barbershop-braids.mp4', t: 53, pos: '50% 30%' },
  'club-event': { src: '/assets/videos/club-event-nye.mp4', t: 38.8, pos: '50% 40%' },
  'laurier-basketball': { src: '/assets/videos/laurier-basketball.mp4', t: 4, pos: '50% 25%' },
  'sevynn-salon': { src: '/assets/work/savyan-salon-v2-2-cc.webp', pos: '50% 30%' },
  // the card's top band would take this one's head with it
  'kenoh-mexico': { src: '/assets/work/kenoh-mexico-4.webp', pos: '75% 50%' },
}
// Where to centre the crop of a card image that does read.
const pos = { 'fujiwill-fall-in-love-with-me': '0% 50%', 'kenoh-reroute': '0% 50%' }

// The main pages' cards (public/og/<slug>.jpg, set as `image` in src/meta.ts), each on a real still; home keeps /og-image.jpg.
const pages = [
  { slug: 'work', kind: 'Work', title: 'Video, web & 3D', client: 'Music videos, brand promos, websites and apps', still: { src: '/assets/work/laurier-clash-hero.webp' } },
  {
    slug: 'services',
    kind: 'Services',
    title: 'Photo, video & websites',
    client: 'Shoot, Shoot + site and Full brand, for businesses in Brampton and the GTA',
    still: { src: '/assets/videos/barbershop-promo-q.mp4', t: 53.6, pos: '50% 25%' },
  },
  { slug: 'music-videos', kind: 'Music videos', title: 'Directed, shot & edited', client: 'Music videos for Brampton and GTA artists', still: { src: '/assets/work/kenoh-mexico-4.webp', pos: '75% 50%' } },
  { slug: 'video', kind: 'Video', title: 'Brand & event video', client: 'Promos and reels for GTA businesses', still: { src: '/assets/videos/barbershop-braids.mp4', t: 53, pos: '50% 30%' } },
  { slug: 'websites', kind: 'Websites', title: 'Built & kept current', client: 'Websites and web apps for GTA businesses', screen: true, still: { src: '/assets/work/suburbia-home-2x.webp' } },
  { slug: 'about', kind: 'About', title: 'Credits & résumé', client: 'Videographer, web developer and music producer', still: { src: '/assets/work/laurier-broadcast-v2.webp' } },
  { slug: 'book', kind: 'Book a call', title: '30 minutes', client: 'A free call about your website, photos or video', still: { src: '/assets/work/call-booking.webp' } },
  { slug: 'contact', kind: 'Contact', title: 'Let’s talk', client: 'work@captainsolo.ca · replies within 1–2 business days', still: { src: '/assets/work/savyan-salon-v2-2-cc.webp', pos: '50% 30%' } },
  { slug: 'blog', kind: 'Blog', title: 'Notes & guides', client: 'Web dev, video, music and local business tips', still: { src: '/assets/work/ten-fold-2-cc.webp' } },
  { slug: 'voice-tags', kind: 'Voice tags', title: 'Producer tags', client: 'Custom tags and DJ drops, delivered in 24 hours', still: { src: '/assets/work/plaques-2.webp', pos: '50% 30%' } },
].map((p) => ({ ...p, image: p.still.src }))
for (const p of pages) if (projects.some((q) => q.slug === p.slug)) throw new Error(`og/${p.slug}.jpg would be both a page card and a case card`)

// The Cut, exactly as src/components/Mark.tsx draws it.
const markSrc = readFileSync(join(root, 'src/components/Mark.tsx'), 'utf8')
const mark = `<svg viewBox="${markSrc.match(/viewBox="([^"]+)"/)[1]}">${[...markSrc.matchAll(/ d="([^"]+)"/g)].map((m) => `<path d="${m[1]}"/>`).join('')}</svg>`

const css = `
@font-face { font-family: Osw; src: url(${file('node_modules/@fontsource-variable/oswald/files/oswald-latin-wght-normal.woff2')}); font-weight: 200 700; }
@font-face { font-family: Plex; src: url(${file('node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2')}); font-weight: 400; }
@font-face { font-family: Plex; src: url(${file('node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2')}); font-weight: 600; }
html, body { margin: 0; background: #0b0d14; }
.card { width: 1200px; height: 630px; position: relative; overflow: hidden; background: #0b0d14; color: #eef1f8; }
.photo { position: absolute; inset: 0 0 0 430px; }
.photo > * { display: block; width: 100%; height: 100%; object-fit: cover; }
/* a portrait still or vertical reel gets a narrower box, so it isn't cropped to a sliver of itself */
.tall .photo { left: 560px; }
/* the card images carry their own label and mark in the top band: crop it off */
.photo > .card-img { object-view-box: inset(11% 0 0 0); }
.photo::after { content: ''; position: absolute; inset: 0; background:
  linear-gradient(90deg, #0b0d14 0%, rgb(11 13 20 / 0.86) 12%, rgb(11 13 20 / 0.5) 26%, rgb(11 13 20 / 0.18) 42%, rgb(11 13 20 / 0) 58%),
  linear-gradient(0deg, rgb(11 13 20 / 0.55), rgb(11 13 20 / 0) 34%),
  linear-gradient(180deg, rgb(11 13 20 / 0.5), rgb(11 13 20 / 0) 26%); }
/* the site's viewfinder corners and REC light */
.corner { position: absolute; width: 34px; height: 34px; border: 0 solid rgb(255 255 255 / 0.85); }
.tl { left: 688px; top: 40px; border-top-width: 3px; border-left-width: 3px; }
.br { right: 40px; bottom: 40px; border-bottom-width: 3px; border-right-width: 3px; }
.rec { position: absolute; right: 64px; top: 44px; font: 500 15px/1 Osw; letter-spacing: 0.2em; color: #fff; text-shadow: 0 1px 8px rgb(0 0 0 / 0.6); }
.rec::before { content: ''; display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ff3b30; box-shadow: 0 0 10px #ff3b30; margin-right: 10px; vertical-align: 1px; }
/* web projects: the card as a lit screen bleeding off the right edge, over a blurred copy of itself */
.screen .col { width: 480px; }
.screen .photo { inset: 118px -150px 0 590px; border-radius: 16px 0 0 0; overflow: hidden; box-shadow: 0 0 0 1px rgb(255 255 255 / 0.12), -30px 30px 80px -10px rgb(0 0 0 / 0.75); }
.screen .photo::after { display: none; }
.screen .photo > * { object-position: 0 0; }
.screen .photo > .card-img { object-view-box: inset(9% 0 0 0); }
.glow { position: absolute; inset: 60px -100px -60px 520px; width: auto; height: auto; filter: blur(70px) saturate(1.3); opacity: 0.55; object-fit: cover; }
.screen .corner, .screen .rec { display: none; }
.col { position: absolute; left: 72px; top: 56px; bottom: 50px; width: 580px; display: flex; flex-direction: column; }
.lockup { display: flex; align-items: center; gap: 16px; }
.lockup svg { height: 48px; fill: #eef1f8; }
.lockup span { font: 600 24px/1 Osw; letter-spacing: 0.16em; text-transform: uppercase; }
.kicker { margin-top: auto; font: 600 17px/1.3 Plex; letter-spacing: 0.2em; text-transform: uppercase; color: #7aa3ff; }
.title { margin: 14px 0 0; font: 600 112px/0.94 Osw; letter-spacing: 0.005em; text-transform: uppercase; text-wrap: balance; color: #f3f5fb; text-shadow: 0 2px 28px rgb(11 13 20 / 0.6); }
.client { margin-top: 16px; font: 400 24px/1.35 Plex; color: #aab2c5; }
.url { margin-top: 34px; font: 500 16px/1 Osw; letter-spacing: 0.26em; color: #8b93a7; }
`

function html(p) {
  const s = still[p.slug] ?? p.still
  const at = `style="object-position: ${s?.pos ?? pos[p.slug] ?? '50% 50%'}"`
  const media = s?.t != null
    ? `<video src="${file('public' + s.src)}" muted preload="auto" ${at} data-t="${s.t}"></video>`
    : `<img src="${file('public' + (s?.src ?? p.image))}" ${s ? '' : 'class="card-img"'} ${at} alt="" />`
  return `<!doctype html><meta charset="utf-8" /><style>${css}</style>
<div class="card${p.screen ? ' screen' : ''}">
  ${p.screen ? `<img class="glow" src="${file('public' + (s?.src ?? p.image))}" alt="" />` : ''}
  <div class="photo">${media}</div>
  <span class="corner tl"></span><span class="corner br"></span><span class="rec">REC</span>
  <div class="col">
    <div class="lockup">${mark}<span>Solomon Olufelo</span></div>
    <div class="kicker">${esc(p.kind)}</div>
    <div class="title">${esc(p.title)}</div>
    <div class="client">${esc(p.client)}</div>
    <div class="url">CAPTAINSOLO.CA</div>
  </div>
</div>`
}

// In the page: wait for the fonts and the picture, then shrink the title until it sits on at most two lines.
async function fit() {
  for (const f of ['600 100px Osw', '400 24px Plex', '600 17px Plex']) await document.fonts.load(f)
  if (!document.fonts.check('600 100px Osw') || !document.fonts.check('400 24px Plex')) throw new Error('fonts did not load')
  const m = document.querySelector('.photo > *')
  if (m.tagName === 'VIDEO') {
    if (m.readyState < 1) await new Promise((ok, no) => ((m.onloadedmetadata = ok), (m.onerror = () => no(new Error('video did not load')))))
    m.currentTime = +m.dataset.t
    await new Promise((ok) => (m.onseeked = ok))
    await new Promise(requestAnimationFrame)
  } else await m.decode()
  const [w, h] = m.tagName === 'VIDEO' ? [m.videoWidth, m.videoHeight] : [m.naturalWidth, m.naturalHeight]
  if (h > w) document.querySelector('.card').classList.add('tall')
  const t = document.querySelector('.title')
  for (let px = 112; px >= 60; px -= 2) {
    t.style.fontSize = px + 'px'
    if (t.scrollWidth <= t.clientWidth && t.offsetHeight <= px * 0.94 * 2 + 1) return px
  }
  throw new Error(`title does not fit: ${t.textContent}`)
}

const only = process.argv.slice(2)
const todo = only.length ? [...projects, ...pages].filter((p) => only.includes(p.slug)) : [...projects, ...pages]
for (const p of todo) for (const k of ['title', 'kind', 'client', 'image']) if (!p[k]) throw new Error(`${p.slug}: no ${k} found in site.ts`)
if (!todo.length) throw new Error(`no projects match ${only.join(' ')}`)

mkdirSync(join(root, 'public/og'), { recursive: true })
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.goto(pathToFileURL(join(root, 'public')).href + '/') // a file: page, so the fonts and media below may load
  for (const p of todo) {
    await page.setContent(html(p))
    const px = await page.evaluate(fit)
    const jpg = await page.screenshot({ type: 'jpeg', quality: 85 })
    // WhatsApp drops link previews whose image is over 300 KB
    if (jpg.length > 300_000) throw new Error(`${p.slug}: ${jpg.length} bytes, over 300 KB`)
    writeFileSync(join(root, 'public/og', `${p.slug}.jpg`), jpg)
    console.log(`og/${p.slug}.jpg  ${Math.round(jpg.length / 1024)} KB  title ${px}px`)
  }
} finally {
  await browser.close()
}
