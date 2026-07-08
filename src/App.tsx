import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Agentation } from 'agentation'
import Home from '@/pages/Home'
import CaseStudy from '@/pages/CaseStudy'
import Stub from '@/pages/Stub'
import NotFound from '@/pages/NotFound'

/* Makes /#section links scroll to their target after navigation, and
   resets to the top on plain route changes (react-router doesn't do
   hash scrolling itself). */
function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      // Wait a frame so the target route has rendered.
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      })
      return
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        {/* The composed portfolio, assembled from Optimus blocks. */}
        <Route path="/" element={<Home />} />
        <Route path="/case-study/:slug" element={<CaseStudy />} />

        {/* v1.1 pages — structured stubs for now (BRIEF §5) */}
        <Route
          path="/work"
          element={
            <Stub
              section="Work"
              title="All work."
              blurb="The full bento — case studies, live projects, and the Playground tab fetched from GitHub (Community League, SPOB, Spotifeed & more)."
            />
          }
        />
        <Route
          path="/about"
          element={
            <Stub
              section="About"
              title="I build software that earns trust."
              blurb="From a mechanical-engineering lab in Ibadan to design systems and shipped code — the full essay, process, stack, and what I'm reading now."
            />
          }
        />
        <Route
          path="/writing"
          element={
            <Stub
              section="Writing"
              title="Adedayo 𓂀 — existing."
              blurb="Personal essays from the Substack, readable right here without leaving the site. The in-site reader lands with the build-time RSS fetch."
            />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Visual feedback toolbar — dev only */}
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}
