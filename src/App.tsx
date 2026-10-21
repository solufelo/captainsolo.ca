import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { BlogIndex } from './pages/BlogIndex'
import { BlogPost } from './pages/BlogPost'
import { Work } from './pages/Work'
import { WorkIndex } from './pages/WorkIndex'
import { ServicesPage } from './pages/ServicesPage'
import { VoiceTags } from './pages/VoiceTags'
import { ContactPage } from './pages/ContactPage'
import { Legal } from './pages/Legal'
import { NotFound } from './pages/NotFound'
import { metaFor } from './meta'

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
    if (target) target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
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
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="work" element={<WorkIndex />} />
          <Route path="work/:slug" element={<Work />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="voice-tags" element={<VoiceTags />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy-policy" element={<Legal page="privacy-policy" />} />
          <Route path="terms-of-service" element={<Legal page="terms-of-service" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
