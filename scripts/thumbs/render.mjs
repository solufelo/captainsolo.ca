// Renders the 16:10 project thumbnails (public/assets/projects/<slug>.webp) from real screens and reel frames.
// Run: node scripts/thumbs/render.mjs <source-dir>   (needs Playwright + Python Pillow)
// Source dir holds <slug>-f1..3.jpg reel frames and <slug>-m.png / -d.png captures; see thumbs.json.
import { createRequire } from 'node:module'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '../..')
const src = resolve(process.argv[2] ?? '.')
const { chromium } = createRequire(join(root, 'package.json'))('playwright')
const jobs = JSON.parse(readFileSync(join(here, 'thumbs.json'), 'utf8'))
const W = 1600
const H = 1000

const url = (p) => pathToFileURL(p.startsWith('/') ? join(root, 'public', p) : join(src, p)).href
const font = (f) => pathToFileURL(f).href
const plexDir = join(root, 'node_modules/@fontsource/ibm-plex-sans/files')

// The SO viewfinder mark, so every thumbnail reads as one body of work.
const mark = `<svg class="mark" viewBox="0 0 120 120" fill="none" aria-hidden="true"><path d="M8 32V8h24M88 8h24v24M112 88v24H88M32 112H8V88" stroke="currentColor" stroke-width="7" stroke-linecap="square"/><path d="M50.66 41A10 10 0 1 0 42 56A10 10 0 1 1 33.34 71" stroke="currentColor" stroke-width="10.5"/><circle cx="80" cy="56" r="14.75" stroke="currentColor" stroke-width="10.5"/><circle cx="98" cy="22" r="6.5" fill="#ff3b30"/></svg>`

const base = `
@font-face { font-family: Oswald; src: url('${font('C:/Windows/Fonts/Oswald-VariableFont_wght.ttf')}'); font-weight: 200 700; }
@font-face { font-family: Plex; src: url('${pathToFileURL(join(plexDir, 'ibm-plex-sans-latin-500-normal.woff2')).href}'); font-weight: 500; }
* { box-sizing: border-box; margin: 0; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
body { position: relative; font-family: Plex, sans-serif; color: #fff; }
.grain { position: absolute; inset: 0; opacity: .14; mix-blend-mode: overlay; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.mark { position: absolute; right: 44px; top: 40px; width: 46px; height: 46px; color: rgb(255 255 255 / .82); z-index: 5; }
.kicker { position: absolute; left: 56px; top: 50px; z-index: 5; font: 500 18px/1 Plex; letter-spacing: .22em; text-transform: uppercase; opacity: .82; }
`

function site(j) {
  const [c1, c2, c3] = j.colors
  const second = j.mobile
    ? `<div class="phone"><img src="${url(j.mobile)}"></div>`
    : j.second
      ? `<div class="win win2"><div class="bar"><i></i><i></i><i></i></div><img src="${url(j.second)}"></div>`
      : ''
  const solo = !j.mobile && !j.second
  return `<style>${base}
body { background: ${c1}; }
.glow { position: absolute; inset: 0;
  background: radial-gradient(60% 70% at 18% 20%, ${c2}cc, transparent 70%), radial-gradient(55% 65% at 92% 95%, ${c3}bb, transparent 70%); }
.win { position: absolute; border-radius: 18px; overflow: hidden; background: #fff;
  box-shadow: 0 40px 90px -30px rgb(0 0 0 / .65), 0 0 0 1px rgb(255 255 255 / .12); }
.win1 { left: ${solo ? 150 : 96}px; top: 128px; width: ${solo ? 1300 : 1150}px; height: ${solo ? 920 : 900}px; }
.win2 { right: 70px; bottom: 60px; width: 640px; height: 440px; }
.bar { height: 40px; display: flex; align-items: center; gap: 9px; padding: 0 18px; background: #eef0f4; border-bottom: 1px solid #dde1e8; }
.bar i { width: 12px; height: 12px; border-radius: 50%; background: #c9ced8; }
.bar span { margin-left: 18px; padding: 5px 16px; border-radius: 999px; background: #fff; font: 500 15px Plex; color: #5b6478; }
.win img { display: block; width: 100%; height: calc(100% - 40px); object-fit: cover; object-position: top; }
.phone { position: absolute; right: 92px; bottom: -70px; width: 320px; height: 692px; border-radius: 48px; padding: 11px; background: #0b0d12;
  box-shadow: 0 50px 90px -30px rgb(0 0 0 / .75), 0 0 0 2px rgb(255 255 255 / .14); }
.phone img { width: 100%; height: 100%; border-radius: 38px; object-fit: cover; object-position: top; display: block; }
</style>
<div class="glow"></div>
<p class="kicker">${j.kicker}</p>${mark}
<div class="win win1"><div class="bar"><i></i><i></i><i></i><span>${j.domain}</span></div><img src="${url(j.desktop)}" style="object-position:${j.focus ?? 'left top'}"></div>
${second}
<div class="grain"></div>`
}

function reel(j) {
  const frames = [1, 2, 3].map((n) => url(`${j.slug}-f${n}.jpg`))
  return `<style>${base}
body { background: #05070d; }
.bg { position: absolute; inset: -60px; background: url('${frames[1]}') center/cover; filter: blur(46px) brightness(.38) saturate(1.3); }
.row { position: absolute; inset: 110px 56px 56px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.row div { border-radius: 20px; overflow: hidden; box-shadow: 0 30px 70px -30px rgb(0 0 0 / .8), 0 0 0 1px rgb(255 255 255 / .1); }
.row img { width: 100%; height: 100%; object-fit: cover; object-position: center ${j.focus ?? '40%'}; display: block; }
</style>
<div class="bg"></div>
<p class="kicker">${j.kicker}</p>${mark}
<div class="row">${frames.map((f) => `<div><img src="${f}"></div>`).join('')}</div>
<div class="grain"></div>`
}

// One full-bleed frame: music videos and landscape promos, where the shot is the thumbnail.
function film(j) {
  return `<style>${base}
body { background: #05070d url('${url(`${j.slug}-f1.jpg`)}') center ${j.focus ?? '50%'} / cover; }
.shade { position: absolute; inset: 0; background: linear-gradient(rgb(5 7 13 / .6), transparent 26%, transparent 78%, rgb(5 7 13 / .3)); }
</style>
<div class="shade"></div>
<p class="kicker">${j.kicker}</p>${mark}
<div class="grain"></div>`
}

const out = join(root, 'public/assets/projects')
const tmp = join(src, '_render')
mkdirSync(tmp, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const page = await browser.newPage({ viewport: { width: W, height: H } })
for (const j of jobs) {
  const html = join(tmp, `${j.slug}.html`)
  writeFileSync(html, `<!doctype html><meta charset="utf-8">${({ reel, film }[j.type] ?? site)(j)}`)
  await page.goto(pathToFileURL(html).href, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const png = join(tmp, `${j.slug}.png`)
  await page.screenshot({ path: png })
  execFileSync('python', ['-I', '-c', `from PIL import Image;Image.open(r'${png}').convert('RGB').save(r'${join(out, j.out)}','WEBP',quality=84,method=6)`])
  console.log('rendered', j.out)
}
await browser.close()
