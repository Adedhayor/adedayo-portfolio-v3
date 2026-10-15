import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from '@/pages/Home'
import CaseStudy from '@/pages/CaseStudy'
import About from '@/pages/About'
import Notes from '@/pages/Notes'
import NoteReader from '@/pages/NoteReader'
import Work from '@/pages/Work'
import NotFound from '@/pages/NotFound'
import CustomCursor from '@/components/global/CustomCursor'
import RouteMeta from '@/components/global/RouteMeta'
import { isProduction, showPlayground } from '@/lib/release'
import FloatingContact from '@/components/global/FloatingContact'
import AsciiField from '@/components/global/AsciiField'

// Lazy so the toolbar ships as its own chunk that production never
// fetches — the package isn't tree-shakeable from the main bundle.
const Agentation = lazy(() => import('agentation').then((m) => ({ default: m.Agentation })))
const Guide = lazy(() => import('@/pages/Guide'))
const Playground = lazy(() => import('@/pages/Play'))
const YardWorld = lazy(() => import('@/pages/YardWorld'))

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
  // The /play world is immersive full-viewport WebGL — the ambient
  // ASCII field and the chat FAB would fight it for pointer + GPU.
  const pathname = useLocation().pathname
  const inImmersivePage = pathname.startsWith('/play') || pathname === '/blog/tech-511'
  return (
    <>
      <ScrollToHash />
      {/* Per-route titles/canonical + analytics pageviews */}
      <RouteMeta />
      {pathname !== '/blog/tech-511' && <CustomCursor />}

      {/* Cursor-reactive ASCII background — behind every page (round G) */}
      {!inImmersivePage && <AsciiField />}
      <Routes>
        {/* The composed portfolio, assembled from Optimus blocks. */}
        <Route path="/" element={<Home />} />
        <Route path="/case-study/:slug" element={<CaseStudy />} />

        {/* Full pages */}
        <Route path="/about" element={<About />} />
        {showPlayground && (
          <>
            <Route
              path="/play"
              element={
                <Suspense fallback={<p>Opening the playground…</p>}>
                  <Playground />
                </Suspense>
              }
            />
            <Route
              path="/play/yard"
              element={
                <Suspense fallback={<p>Opening The Yard…</p>}>
                  <YardWorld />
                </Suspense>
              }
            />
            <Route path="/play/world" element={<Navigate to="/play/yard" replace />} />
          </>
        )}
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:slug" element={<NoteReader />} />
        <Route
          path="/blog/tech-511"
          element={
            <Suspense fallback={<p>Opening the guide…</p>}>
              <Guide />
            </Suspense>
          }
        />

        {/* Renamed: /writing → /notes (feedback #9) */}
        <Route path="/writing" element={<Navigate to="/notes" replace />} />

        {/* Renamed: Tabulera → Tabulerasa (round G) — keep the old live URL working */}
        <Route path="/case-study/tabulera" element={<Navigate to="/case-study/tabulerasa" replace />} />

        <Route path="/work" element={<Work />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Optimus chat — rides every page except the /play world (round F #9; released 2026-07-17) */}
      {!inImmersivePage && <FloatingContact />}

      {/* Visual feedback toolbar — staging channel only (dev, local
          preview, and the staging.pages.dev deploy); never production */}
      {!isProduction && (
        <Suspense fallback={null}>
          <Agentation />
        </Suspense>
      )}
    </>
  )
}
