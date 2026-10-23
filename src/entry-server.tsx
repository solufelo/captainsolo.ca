import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import { App } from './App'
import { metaFor, prerenderPaths } from './meta'

export { metaFor, prerenderPaths }

// prerender, not renderToString: it waits for lazy pages (the blog post), so their HTML is in the file.
// progressiveChunkSize: keep every page inline. Otherwise React moves a big Suspense boundary (About, long posts) into a
// hidden div after the footer plus a reveal script: blank without JS, and a full-page jump with it.
export async function render(url: string) {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  )
  return new Response(prelude).text()
}
