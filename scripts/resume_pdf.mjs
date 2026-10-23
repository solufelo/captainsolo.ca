// Prints the résumé linked from /about: public/solomon-olufelo-resume.pdf, one Letter page, from src/content/about.ts.
// Run: node scripts/resume_pdf.mjs   (again whenever about.ts changes). Public file: no phone number, no home address.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import { awards, education, experience, summary, tools } from '../src/content/about.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const font = (rel) => `data:font/woff2;base64,${readFileSync(join(root, 'node_modules', rel)).toString('base64')}`
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const html = `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><style>
@font-face { font-family: Oswald; src: url(${font('@fontsource-variable/oswald/files/oswald-latin-wght-normal.woff2')}); font-weight: 200 700; }
@font-face { font-family: Plex; src: url(${font('@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2')}); font-weight: 400; }
@font-face { font-family: Plex; src: url(${font('@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2')}); font-weight: 600; }
@page { size: Letter; margin: 0.55in 0.6in; }
* { box-sizing: border-box; }
body { margin: 0; font: 400 9.6pt/1.42 Plex, sans-serif; color: #0b0d14; }
h1 { margin: 0; font: 600 30pt/1 Oswald, sans-serif; text-transform: uppercase; letter-spacing: 0.01em; }
.role { margin: 4px 0 0; font: 500 11pt Oswald, sans-serif; letter-spacing: 0.06em; text-transform: uppercase; color: #2563eb; }
.contact { margin: 6px 0 0; color: #4a5266; }
.summary { margin: 14px 0 0; padding-top: 12px; border-top: 1.5px solid #0b0d14; }
h2 { margin: 16px 0 6px; font: 600 11pt Oswald, sans-serif; letter-spacing: 0.12em; text-transform: uppercase; }
.job { margin: 0 0 9px; }
.job-head { display: flex; justify-content: space-between; gap: 12px; }
.job-head strong { font-weight: 600; }
.when { color: #4a5266; white-space: nowrap; }
.org { color: #4a5266; }
ul { margin: 3px 0 0; padding-left: 14px; }
li + li { margin-top: 2px; }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px; }
.plain { list-style: none; padding: 0; }
a { color: inherit; text-decoration: none; }
.foot { margin-top: 14px; padding-top: 8px; border-top: 1px solid #c9ceda; color: #4a5266; font-size: 8.6pt; }
</style></head><body>
<h1>Solomon Olufelo</h1>
<p class="role">Videographer · Web developer · Music producer</p>
<p class="contact">Brampton, ON · <a href="mailto:work@captainsolo.ca">work@captainsolo.ca</a> · <a href="https://captainsolo.ca">captainsolo.ca</a> · <a href="https://github.com/solufelo">github.com/solufelo</a></p>
<p class="summary">${esc(summary)}</p>
<h2>Experience</h2>
${experience
  .map(
    (j) => `<div class="job"><div class="job-head"><span><strong>${esc(j.role)}</strong> <span class="org">· ${esc(j.org)}, ${esc(j.place)}</span></span><span class="when">${esc(j.when)}</span></div>
<ul>${j.points.map((p) => `<li>${esc(p.replace('this site', 'captainsolo.ca'))}</li>`).join('')}</ul></div>`, // the About page's "this site" means nothing on paper
  )
  .join('')}
<div class="cols">
<div><h2>Education</h2><ul class="plain">${education.map((e) => `<li><strong>${esc(e.school)}</strong>, ${esc(e.detail)} <span class="when">· ${esc(e.when)}</span></li>`).join('')}</ul>
<h2>Awards</h2><ul class="plain">${awards.map((a) => `<li>${esc(a.name)} <span class="when">· ${esc(a.when)}</span></li>`).join('')}</ul></div>
<div><h2>Tools</h2><ul class="plain">${tools.map((t) => `<li><strong>${esc(t.area)}:</strong> ${t.items.map(esc).join(', ')}</li>`).join('')}</ul></div>
</div>
<p class="foot">Work and every credit, with links: <a href="https://captainsolo.ca/work">captainsolo.ca/work</a> and <a href="https://captainsolo.ca/about">captainsolo.ca/about</a></p>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
const out = join(root, 'public', 'solomon-olufelo-resume.pdf')
await page.pdf({ path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true })
const pages = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight / (11 * 96 - 2 * 0.55 * 96)))
await browser.close()
if (pages > 1) throw new Error(`résumé runs to about ${pages} pages: trim about.ts or the styles`)
console.log('wrote', pathToFileURL(out).href)
