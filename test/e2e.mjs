// End-to-end checks against `wrangler dev` (http://127.0.0.1:8787). Run: npm run build && npx wrangler dev, then npm run test:e2e
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:8787'
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const results = []
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra && !ok ? '  — ' + extra : ''}`)

// Reduced motion stops the planet's render loop: with software WebGL it starves the headless browser's timers.
async function newPage(w = 1280, h = 800, opts = {}) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce', ...opts })
  page.errors = []
  page.on('console', (m) => m.type() === 'error' && page.errors.push(m.text()))
  page.on('pageerror', (e) => page.errors.push(e.message))
  // Prerendered HTML is clickable before React attaches handlers; wait for hydration after every load.
  const goto = page.goto.bind(page)
  page.goto = async (...args) => {
    const res = await goto(...args)
    await page.waitForFunction(() => {
      const el = document.querySelector('#root .skip-link')
      return !!el && Object.keys(el).some((k) => k.startsWith('__react'))
    })
    return res
  }
  return page
}

// Hero: the showreel plays inside the viewfinder (WebM/VP9 plays in Playwright's Chromium) and the HUD tracks it
let p = await newPage(1280, 800, { reducedMotion: 'no-preference' })
await p.goto(BASE + '/', { waitUntil: 'load' })
await p.waitForTimeout(2500)
const vf = await p.evaluate(() => {
  const v = document.querySelector('.viewfinder video')
  return { t: v?.currentTime ?? 0, w: v?.videoWidth ?? 0, rec: document.querySelector('.vf-rec')?.textContent ?? '', clip: document.querySelector('.vf-clip')?.getAttribute('href') }
})
check('hero reel plays in the viewfinder', vf.t > 0.5 && vf.w >= 640, JSON.stringify(vf))
check('viewfinder HUD shows REC + timecode and links the clip', /REC\s*00:00:\d\d:\d\d/.test(vf.rec) && /^\/work\//.test(vf.clip || ''), JSON.stringify(vf))
await p.locator('.work-row').first().hover()
await p.waitForTimeout(500)
check('hovering a video row floats its silent preview', await p.evaluate(() => {
  const f = document.querySelector('.work-float')
  const v = f?.querySelector('video')
  return f?.dataset.on === 'true' && !!v && v.muted && /\/assets\/previews\//.test(v.getAttribute('src') || '')
}))
check('hero: no console errors', p.errors.length === 0, p.errors.join(' | '))
await p.close()

// Phones get the 9:16 cut, so faces aren't centre-cropped out of the 16:9 reel
p = await newPage(390, 844, { reducedMotion: 'no-preference' })
await p.goto(BASE + '/', { waitUntil: 'load' })
await p.waitForTimeout(2000)
const tall = await p.evaluate(() => {
  const v = document.querySelector('.viewfinder video')
  return { w: v?.videoWidth ?? 0, h: v?.videoHeight ?? 0, src: v?.currentSrc ?? '', t: v?.currentTime ?? 0 }
})
check('phone hero plays the vertical cut', tall.h > tall.w && /-tall\./.test(tall.src) && tall.t > 0.3, JSON.stringify(tall))
check('photo strip holds each still’s size before it loads', await p.evaluate(() => [...document.querySelectorAll('.strip img')].every((i) => i.getAttribute('width') && i.getAttribute('height'))))
// Scrolled past, the reel stops decoding and picks up again on the way back
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
await p.waitForTimeout(800)
const away = await p.evaluate(() => document.querySelector('.viewfinder video').paused)
await p.evaluate(() => window.scrollTo(0, 0))
await p.waitForTimeout(800)
check('hero reel pauses off screen and resumes on return', away && (await p.evaluate(() => !document.querySelector('.viewfinder video').paused)))
await p.close()

// Reduced motion: the reel waits, with a Play button that starts it
p = await newPage(1280, 800)
await p.goto(BASE + '/', { waitUntil: 'load' })
const playBtn = p.getByRole('button', { name: 'Play reel' })
check('reduced motion: reel holds with a Play reel button', await playBtn.isVisible())
await playBtn.click()
await p.waitForTimeout(1200)
check('Play reel button starts the reel', await p.evaluate(() => !document.querySelector('.viewfinder video').paused))
await p.close()

// Home: hydration, work list + hover preview, theme, client-side navigation
p = await newPage()
await p.goto(BASE + '/', { waitUntil: 'load' })
check('one hero (no duplicate render)', (await p.locator('.hero').count()) === 1)
check('home lists 8 projects', (await p.locator('.work-row').count()) === 8)
// 400 plus room for one real client quote under the reels (counted here with the reduced-motion note showing)
check('home stays short (under 410 words)', (await p.evaluate(() => document.body.innerText.split(/\s+/).filter(Boolean).length)) < 410)
check('home leads with the client problem', (await p.locator('#problem-title').innerText()).includes('better than it looks online'))
await p.locator('.faq summary').first().click()
check('FAQ answers open', await p.locator('.faq details').first().evaluate((d) => d.open))
await p.locator('.work-row').first().hover()
await p.waitForTimeout(500)
check('reduced motion: hovering a row floats its still card, no video, no tilt', await p.evaluate(() => {
  const f = document.querySelector('.work-float')
  return f?.dataset.on === 'true' && !f.querySelector('video') && !!f.querySelector('img') && f.style.transform.endsWith('rotate(0deg)')
}))
const before = await p.evaluate(() => document.documentElement.dataset.theme)
await p.locator('.theme-toggle').click()
const after = await p.evaluate(() => [document.documentElement.dataset.theme, localStorage.getItem('theme')])
check('theme toggle flips and persists', before !== after[0] && after[0] === after[1], `${before} -> ${after}`)

// /work: filters and case studies
await p.getByRole('link', { name: /^All work/ }).click()
await p.waitForURL('**/work')
await p.getByRole('button', { name: /^Video/ }).click()
check('work filter: Video shows 21 cards', (await p.locator('.work-card').count()) === 21)
await p.getByRole('button', { name: /^Sites & apps/ }).click()
check('work filter: Sites & apps shows 8', (await p.locator('.work-card').count()) === 8)
check('empty "In progress" filter is hidden', (await p.getByRole('button', { name: /^In progress/ }).count()) === 0)
await p.getByRole('button', { name: /^All/ }).first().click()
check('work filter: All shows 35', (await p.locator('.work-card').count()) === 35)
check(
  'more credits: 11 YouTube links that open in a new tab, each read out in full',
  (await p.locator('a.credit[target="_blank"][href^="https://www.youtube.com/watch?v="]').count()) === 11 &&
    (await p.getByRole('link', { name: 'REALTALK Yung Koba ft. TGK Co-directed, shot and edited 2024', exact: true }).count()) === 1,
)
await p.getByRole('button', { name: /^Video/ }).click()
await p.locator('.work-card a').first().click()
await p.waitForURL('**/work/**')
await p.waitForFunction(() => document.querySelectorAll('.case-meta dt').length >= 3, null, { timeout: 5000 }).catch(() => {})
check('work card opens its case study', (await p.locator('h1').count()) === 1 && (await p.locator('.case-meta dt').count()) >= 3)
check('case study: the video is on the page with controls', await p.locator('.case-video video[controls], .case-loop video[controls]').first().isVisible())
check('case study: links to the next project', (await p.locator('.case-next a[href^="/work/"]').count()) === 1)
await p.goto(BASE + '/', { waitUntil: 'load' })
await p.locator('.site-footer').getByRole('link', { name: 'Blog' }).click()
await p.waitForURL('**/blog')
const titled = await p.waitForFunction(() => document.title.startsWith('Blog'), null, { timeout: 3000 }).then(() => true, () => false)
check('client nav to /blog updates the title', titled, await p.title())
await p.getByRole('button', { name: /^Music Production/ }).click()
check('blog filter: Music Production shows 3', (await p.locator('.post-card').count()) === 3)
// a post's page and text load on demand (they're not in the main bundle)
await p.locator('.post-card').first().click()
await p.waitForURL('**/blog/**')
check('a post opened from the blog loads its text', await p.locator('.prose h2').first().waitFor({ timeout: 5000 }).then(() => true, () => false))
check('home + blog: no console errors', p.errors.length === 0, p.errors.join(' | '))
await p.close()

// Case pages: videos are named and say what they sound like (none has dialogue); stills are described, not numbered
p = await newPage()
await p.goto(BASE + '/work/laurier-gameday', { waitUntil: 'load' })
check('case videos are labelled and say what they sound like', await p.evaluate(() => {
  const clips = [...document.querySelectorAll('.case-clip')]
  return clips.length === 7 && clips.every((f) => f.querySelector('video')?.getAttribute('aria-label') && f.querySelector('.case-sound')) && !!document.querySelector('.case-loop video')?.getAttribute('aria-label')
}))
check('gallery stills carry real descriptions', await p.evaluate(() => {
  const alts = [...document.querySelectorAll('.case-media img')].map((i) => i.alt)
  return alts.length > 10 && alts.every((a) => a.length > 30 && !/, (piece|screen) \d+$/.test(a))
}))
await p.close()

// Music-video cases play the full video on the page, and nothing is fetched from YouTube until play is pressed
p = await newPage()
const ytRequests = []
p.on('request', (r) => /(^|\.)(youtube\.com|youtube-nocookie\.com|ytimg\.com)$/.test(new URL(r.url()).hostname) && ytRequests.push(r.url()))
await p.goto(BASE + '/work/tec', { waitUntil: 'networkidle' })
const beforePlay = [...ytRequests]
await p.getByRole('button', { name: 'Play the full video' }).click()
const player = await p.locator('iframe[src^="https://www.youtube-nocookie.com/embed/uIts3LeNtbs?"]').waitFor({ timeout: 5000 }).then(() => true, () => false)
check('YouTube: nothing fetched before play, then the youtube-nocookie player', beforePlay.length === 0 && player, `before play: ${beforePlay.join(' ')} player=${player}`)
await p.close()

// About: experience, every credit grouped by discipline, and the résumé PDF
p = await newPage()
await p.goto(BASE + '/about', { waitUntil: 'load' })
check('about shows experience and grouped credits, and links a PDF résumé', await p.evaluate(async () => {
  const res = await fetch('/solomon-olufelo-resume.pdf', { method: 'HEAD' })
  return document.querySelectorAll('.xp > li').length === 3 && document.querySelectorAll('.credit-group').length >= 6 && res.ok && (res.headers.get('content-type') || '').includes('pdf')
}))
await p.close()

// Old printed links to /#packages land on /services; a package button prefills the contact form
p = await newPage()
await p.goto(BASE + '/#packages', { waitUntil: 'load' })
check('old /#packages link lands on /services', await p.waitForURL('**/services', { timeout: 3000 }).then(() => true, () => false), p.url())
await p.getByRole('link', { name: 'Ask about Full brand' }).click()
await p.waitForURL('**/contact?**')
await p.waitForTimeout(300)
check('package button: service preselected', (await p.locator('select[name=service]').inputValue()) === 'Brand package')
check('package button: message mentions the package', (await p.locator('textarea[name=message]').inputValue()).includes('Full brand'))
check('package flow: no console errors', p.errors.length === 0, p.errors.join(' | '))
await p.close()

// "Book a call" opens the Cal.com calendar; "Send a message" there opens the form with the request written
p = await newPage()
await p.goto(BASE + '/', { waitUntil: 'load' })
await p.locator('.site-header').getByRole('link', { name: 'Book a call' }).first().click()
await p.waitForURL('**/book')
check('Book a call: the booking calendar is embedded', /^https:\/\/cal\.com\/solomon-olufelo\/30min\?embed=true/.test((await p.locator('iframe.cal-frame').getAttribute('src')) || ''))
await p.getByRole('link', { name: 'Send a message' }).click()
await p.waitForURL('**/contact?call=1')
await p.waitForTimeout(300)
check('Book a call: the message fallback is prefilled', (await p.locator('textarea[name=message]').inputValue()).includes('30-minute call'))
await p.close()

// One-tap email copies the address
p = await newPage()
await p.context().grantPermissions(['clipboard-read', 'clipboard-write'])
await p.goto(BASE + '/contact', { waitUntil: 'load' })
await p.locator('.contact .copy-email').click()
await p.waitForTimeout(200)
const clip = await p.evaluate(() => navigator.clipboard.readText())
check('copy-email button copies the address and says Copied', clip === 'work@captainsolo.ca' && (await p.locator('.contact .copy-email').innerText()).includes('Copied'), clip)
await p.close()

// Mobile menu
p = await newPage(390, 844)
await p.goto(BASE + '/', { waitUntil: 'load' })
const navLink = p.locator('#main-nav').getByRole('link', { name: 'Services' })
check('mobile: nav hidden before opening', !(await navLink.isVisible()))
await p.getByRole('button', { name: 'Open menu' }).click()
await p.waitForTimeout(300)
check('mobile: menu opens', await navLink.isVisible())
await p.keyboard.press('Escape')
const closed = await p.waitForFunction(() => document.querySelector('.site-header').dataset.open === 'false', null, { timeout: 3000 }).then(() => true, () => false)
await p.waitForTimeout(400) // fade-out
check('mobile: Escape closes the menu', closed && !(await navLink.isVisible()), `closed=${closed}`)
check('mobile: no sideways scroll', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
await p.close()

// Blog post links route client-side; voice-tag samples play
p = await newPage()
await p.goto(BASE + '/blog/metro-boomin-producer-tag', { waitUntil: 'load' })
await p.evaluate(() => (window.__marker = 1))
await p.locator('.prose a[href="/voice-tags"]').first().click()
await p.waitForURL('**/voice-tags')
check('in-post link navigates without a reload', (await p.evaluate(() => window.__marker)) === 1)
await p.getByRole('button', { name: 'Play Doxy tag' }).click()
await p.waitForTimeout(1200)
const a = await p.evaluate(() => {
  const el = document.querySelector('audio')
  return { t: el.currentTime, paused: el.paused }
})
check('voice-tag sample plays', a.t > 0, JSON.stringify(a))
check('voice tags: contact form preselects "Voice tag"', (await p.locator('select[name=service]').inputValue()) === 'Voice tag')
check('post + voice tags: no console errors', p.errors.length === 0, p.errors.join(' | '))
await p.close()

// Every prerendered page loads, has one h1 and hydrates cleanly
p = await newPage()
const sitemap = await (await fetch(BASE + '/sitemap.xml')).text()
const paths = [...sitemap.matchAll(/<loc>https:\/\/captainsolo\.ca([^<]*)<\/loc>/g)].map((m) => m[1])
const bad = []
for (const path of paths) {
  p.errors = []
  const res = await p.goto(BASE + path, { waitUntil: 'load' })
  const h1 = await p.locator('h1').count()
  if (res.status() !== 200 || h1 !== 1 || p.errors.length) bad.push(`${path} status=${res.status()} h1=${h1} ${p.errors.join(' | ')}`)
}
check(`all ${paths.length} sitemap pages: 200, one h1, no errors`, paths.length > 15 && bad.length === 0, bad.join('\n      '))
const nf = await p.goto(BASE + '/no-such-page', { waitUntil: 'load' })
check('unknown URL gets 404 status and the designed page', nf.status() === 404 && (await p.locator('h1').innerText()).toUpperCase().includes('LOST'), String(nf.status()))
await p.close()

// Contact form through the real Worker
p = await newPage()
await p.goto(BASE + '/contact', { waitUntil: 'load' })
await p.fill('input[name=name]', 'Test Person')
await p.fill('input[name=email]', 'test@example.com')
await p.fill('textarea[name=message]', 'Testing the new contact form end to end.')
await p.selectOption('select[name=service]', 'Website')
await p.getByRole('button', { name: 'Send message' }).click()
await p.locator('.form-done, .form-error').first().waitFor({ timeout: 15000 })
const err = (await p.locator('.form-error').count()) ? await p.locator('.form-error').innerText() : ''
check('contact form: valid submit shows "Message sent"', await p.locator('.form-done').isVisible(), err)
await p.close()

const post = (body, headers = {}) =>
  fetch(BASE + '/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
let r = await post({ name: 'x', email: 'bad', message: 'long enough message' })
check('API: bad email gets 422', r.status === 422, String(r.status))
r = await post({ name: 'x', email: 'a@b.co', message: 'long enough message' }, { origin: 'https://evil.example' })
check('API: cross-site Origin gets 403', r.status === 403, String(r.status))
r = await post({ name: 'x', email: 'a@b.co', message: 'long enough message', website: 'spam' })
check('API: honeypot gets 200 and is dropped', r.status === 200, String(r.status))
r = await post('{not json')
check('API: malformed JSON gets 400', r.status === 400, String(r.status))
r = await fetch(BASE + '/api/contact')
check('API: GET gets 405', r.status === 405, String(r.status))
r = await fetch(BASE + '/api/nope')
check('API: unknown /api route gets JSON 404', r.status === 404 && (r.headers.get('content-type') || '').includes('json'), String(r.status))

await browser.close()
console.log(results.join('\n'))
const passed = results.filter((x) => x.startsWith('PASS')).length
console.log(`\n${passed}/${results.length} passed`)
process.exit(passed === results.length ? 0 : 1)
