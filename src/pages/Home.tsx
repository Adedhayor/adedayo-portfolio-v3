// ============================================================
// Home — the composed landing page (BRIEF §4).
// Order: Loader → Hero (scatter) → Work bento → MiniAbout →
// Clients → Testimonials (placeholders) → Writing → Contact →
// Footer. Global chrome: AsciiField + PageFrame + NavIsland.
// ============================================================
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import Loader from '@/components/global/Loader'
import AsciiField from '@/components/global/AsciiField'
import Hero from '@/blocks/Hero'
import WorkGrid from '@/blocks/WorkGrid'
import MiniAbout from '@/blocks/MiniAbout'
import ClientLogos from '@/blocks/ClientLogos'
import TestimonialBand from '@/blocks/TestimonialBand'
import WritingStrip from '@/blocks/WritingStrip'
import Contact from '@/blocks/Contact'
import FooterWordmark from '@/blocks/FooterWordmark'
import { useScatterToBento } from '@/lib/scatter'

export default function Home() {
  // Scatter-to-bento choreography — spans the hero and work grid
  const scatterScope = useScatterToBento<HTMLElement>()
  return (
    <div id="top" className="min-h-screen">
      {/* Opening sequence — plays once per session, skippable */}
      <Loader />

      {/* Cursor-reactive ASCII background — behind everything */}
      <AsciiField />

      <PageFrame />
      <NavIsland />
      <main ref={scatterScope} className="relative z-[1]">
        <section data-section="Home">
          <Hero />
        </section>
        <section id="work" data-section="Work">
          <WorkGrid />
        </section>
        <section id="about" data-section="About">
          <MiniAbout />
          <ClientLogos label="Clients & companies" />
          <TestimonialBand />
        </section>
        <section id="writing" data-section="Writing">
          <WritingStrip />
        </section>
        <section id="contact" data-section="Contact">
          <Contact />
        </section>
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
