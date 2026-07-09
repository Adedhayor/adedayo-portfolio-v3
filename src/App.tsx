import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Agentation } from 'agentation'
import Home from '@/pages/Home'
import CaseStudy from '@/pages/CaseStudy'
import About from '@/pages/About'
import Play from '@/pages/Play'
import Notes from '@/pages/Notes'
import NoteReader from '@/pages/NoteReader'
import Stub from '@/pages/Stub'
import NotFound from '@/pages/NotFound'
import CustomCursor from '@/components/global/CustomCursor'

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
      <CustomCursor />
      <Routes>
        {/* The composed portfolio, assembled from Optimus blocks. */}
        <Route path="/" element={<Home />} />
        <Route path="/case-study/:slug" element={<CaseStudy />} />

        {/* Full pages */}
        <Route path="/about" element={<About />} />
        <Route path="/play" element={<Play />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:slug" element={<NoteReader />} />

        {/* Renamed: /writing → /notes (feedback #9) */}
        <Route path="/writing" element={<Navigate to="/notes" replace />} />

        {/* Still a structured stub */}
        <Route
          path="/work"
          element={
            <Stub
              section="Work"
              title="All work."
              blurb="The full bento — case studies and live projects. Side projects and experiments now live on the Play page."
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
