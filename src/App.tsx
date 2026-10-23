import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { BlogIndex } from './pages/BlogIndex'
import { WorkIndex } from './pages/WorkIndex'
import { ServicesPage } from './pages/ServicesPage'
import { Book } from './pages/Book'
import { VoiceTags } from './pages/VoiceTags'
import { ContactPage } from './pages/ContactPage'
import { Legal } from './pages/Legal'
import { NotFound } from './pages/NotFound'
import { metaFor } from './meta'

// A post page brings the posts' text with it, and a case study its gallery descriptions (alts.json), so other pages
// don't download them. The prerendered HTML shows meanwhile.
const BlogPost = lazy(() => import('./pages/BlogPost').then((m) => ({ default: m.BlogPost })))
const Work = lazy(() => import('./pages/Work').then((m) => ({ default: m.Work })))
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))

/** Keeps <title>/description current on client-side navigation and handles #hash scrolling. */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const meta = metaFor(pathname)
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', 'https://captainsolo.ca' + meta.path)
  }, [pathname])
  useEffect(() => {
    // Printed leave-behinds link to /#packages; packages now live on /services.
    if (pathname === '/' && hash === '#packages') return void navigate('/services', { replace: true })
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
    // Lenis (smooth scrolling) keeps its own position, so scroll through it when it's running.
    const lenis = window.lenis
    if (target) lenis ? lenis.scrollTo(target, { offset: -24 }) : target.scrollIntoView({ behavior: 'auto' })
    else if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
  }, [pathname, hash, navigate])
  return null
}

export function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blog" element={<BlogIndex />} />
          <Route
            path="blog/:slug"
            element={
              <Suspense>
                <BlogPost />
              </Suspense>
            }
          />
          <Route path="work" element={<WorkIndex />} />
          <Route
            path="work/:slug"
            element={
              <Suspense>
                <Work />
              </Suspense>
            }
          />
          <Route path="services" element={<ServicesPage />} />
          <Route path="book" element={<Book />} />
          <Route path="voice-tags" element={<VoiceTags />} />
          <Route
            path="about"
            element={
              <Suspense>
                <About />
              </Suspense>
            }
          />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy-policy" element={<Legal page="privacy-policy" />} />
          <Route path="terms-of-service" element={<Legal page="terms-of-service" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
