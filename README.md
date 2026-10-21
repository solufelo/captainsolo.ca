# captainsolo.ca

Portfolio, blog and voice-tag shop for Solomon Olufelo (Captain Solo). React 19 + Vite, every page prerendered to
static HTML, served by a Cloudflare Worker with static assets. The Worker also handles the contact form and emails it
through Cloudflare Email Routing. Hosting is free on Cloudflare's plan.

## Commands

| | |
|---|---|
| `npm run dev` | Vite dev server with hot reload, http://localhost:5173 (no contact form) |
| `npm run build` | Type-check, build, prerender all pages to `dist/`, write `sitemap.xml` |
| `npx wrangler dev` | Run the real Worker locally on http://127.0.0.1:8787, form included (emails are written to `.wrangler/tmp/email`) |
| `npm test` | Contact-form validation unit tests |
| `npm run test:e2e` | 26 browser checks against `wrangler dev` (set `CHROME_PATH` if Playwright's browser isn't installed) |
| `npm run deploy` | Build and deploy to Cloudflare |

## Where things live

- `src/content/site.ts`: services, projects, about copy, socials. Edit text here.
- `src/content/posts.json`: the 13 blog posts (HTML). `scripts/convert_posts.py` generated it from the old site.
- `src/content/voicetags.ts`, `src/content/legal.json`: voice-tag page and legal pages.
- `src/components/Viewfinder.tsx` + `scripts/make_hero_reel.py`: the hero showreel in the SO viewfinder. The script cuts
  the reel from `public/assets/videos/*.mp4`, writes content-hashed files and `src/content/heroReel.json`.
- `src/components/Mark.tsx`: the SO viewfinder mark. Master logo files and the animated sting live in `Documents/brand`.
- `worker/`: the Worker. `contact.ts` validates the form; `index.ts` sends the email and serves the site.
- `scripts/prerender.mjs`: writes `dist/<route>.html` for every route (slash-less URLs, like the old site), plus `404.html` and the sitemap.

New blog post: add an entry to `posts.json` (slug, title, category, date, excerpt, html). It's picked up by the blog,
the sitemap and the prerender automatically.

## Hosting and deploys

Live at **https://captainsolo.ca** (and https://captainsolo.solomonolufelo.workers.dev), on a Cloudflare Worker named
`captainsolo`. `captainsolo.ca` and `www.captainsolo.ca` are Worker custom domains in `wrangler.jsonc`; the Worker
redirects `www` to the bare domain. Keep `"workers_dev": true` there: a deploy without it switches the workers.dev
address off.

- Deploy: `npx wrangler login` once, then `npm run deploy`.
- Contact form: `worker/index.ts` sends through Cloudflare Email Routing (enabled on captainsolo.ca) to `CONTACT_TO`,
  which must be a verified destination address. `work@` and `contact@captainsolo.ca` forward to the same inbox.
- Thumbnails: `node scripts/thumbs/render.mjs <capture-dir>` renders `public/assets/projects/*.webp` from `thumbs.json`.
- The old site (a built React app from June 2026) is kept on the `legacy-build` branch.
