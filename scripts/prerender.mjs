// Renders every route to static HTML after `vite build`, so pages work without JavaScript and search engines see content.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const { render, metaFor, prerenderPaths } = await import(pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href)
const template = readFileSync(join(dist, 'index.html'), 'utf8')
const SITE = 'https://captainsolo.ca'

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Every /assets file a page points at must exist: a phone or strip copy that scripts/phone_media.py hasn't made yet
// would otherwise ship as a broken image or a video that never plays on phones.
const missing = new Set()
function checkAssets(html) {
  const refs = [...html.matchAll(/(?:src|poster)="(\/assets\/[^"]+)"/g)].map((m) => m[1])
  for (const [, set] of html.matchAll(/srcset="([^"]+)"/g)) refs.push(...set.split(',').map((c) => c.trim().split(/\s+/)[0]))
  for (const ref of refs) if (ref.startsWith('/assets/') && !existsSync(join(dist, ref.split(/[?#]/)[0]))) missing.add(ref)
}

async function page(path, outFile) {
  const meta = metaFor(path)
  const url = SITE + (meta.path === '/' ? '/' : meta.path)
  const head = [
    `<meta property="og:type" content="${meta.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="Solomon Olufelo" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/og-image.jpg?v=3" />`, // ?v= makes apps that cached the old card fetch the new one
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    meta.jsonLd ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ].join('\n    ')
  const app = await render(path)
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace('<meta name="description" content="" />', `<meta name="description" content="${esc(meta.description)}" />`)
    .replace('<link rel="canonical" href="https://captainsolo.ca/" />', `<link rel="canonical" href="${url}" />`)
    .replace('<!--head-->', head)
    .replace('<!--app-->', () => app) // a function, so a `$&` or `$'` in a post isn't read as a replacement pattern
  if (!html.includes('id="root"><') || html.includes('<!--app-->')) throw new Error(`prerender produced no markup for ${path}`)
  checkAssets(html)
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, html)
}

// `blog.html`, not `blog/index.html`: Cloudflare's asset router then serves `/blog` itself and
// redirects `/blog/` to it, keeping the slash-less URLs the old site had indexed.
for (const path of prerenderPaths) {
  await page(path, path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1) + '.html'))
}
await page('/404', join(dist, '404.html'))
if (missing.size) throw new Error(`pages point at missing files (run scripts/phone_media.py?):\n  ${[...missing].join('\n  ')}`)

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${prerenderPaths.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
writeFileSync(join(dist, 'sitemap.xml'), sitemap)
rmSync(join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerendered ${prerenderPaths.length} pages + 404, sitemap.xml`)
