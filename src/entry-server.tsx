import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import { App } from './App'
import { metaFor, prerenderPaths } from './meta'

export { metaFor, prerenderPaths }

// prerender, not renderToString: it waits for lazy pages (the blog post), so their HTML is in the file.
export async function render(url: string) {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return new Response(prelude).text()
}
