import { Routes, Route, Navigate } from 'react-router-dom'
import { Agentation } from 'agentation'
import Home from '@/pages/Home'
import CaseStudy from '@/pages/CaseStudy'
import Stub from '@/pages/Stub'

export default function App() {
  return (
    <>
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Visual feedback toolbar — dev only */}
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}
