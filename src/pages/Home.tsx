// ============================================================
// Home — the composed portfolio, assembled from Optimus blocks.
// This is what ships at adedayobabalola.com.
// ============================================================
import Nav from '@/blocks/Nav'
import Hero from '@/blocks/Hero'
import ClientLogos from '@/blocks/ClientLogos'
import ProjectGrid from '@/blocks/ProjectGrid'
import Services from '@/blocks/Services'
import TestimonialBand from '@/blocks/TestimonialBand'
import Contact from '@/blocks/Contact'
import FooterWordmark from '@/blocks/FooterWordmark'

export default function Home() {
  return (
    <div className="min-h-screen bg-opt-surface-base">
      <Nav />
      <main>
        <Hero />
        <ClientLogos />
        <ProjectGrid />
        <Services />
        <TestimonialBand />
        <Contact />
      </main>
      <FooterWordmark />
    </div>
  )
}
