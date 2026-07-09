// ============================================================
// About — /about (BRIEF §5, feedback #8/#13). The full story:
// the MiniAbout band (portrait, essay, work history, stack) →
// a numbered process (01–04) → clients → testimonials → a
// closing pair of images. The landing page no longer carries
// this section — it lives here now.
// ============================================================
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import MiniAbout from '@/blocks/MiniAbout'
import ClientLogos from '@/blocks/ClientLogos'
import TestimonialBand from '@/blocks/TestimonialBand'
import { process } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

/* Numbered process — 01–04 (Sean-style). */
function Process() {
  return (
    <section className="container-opt py-opt-5xl">
      <motion.h2
        variants={riseIn}
        {...revealOnce}
        className="max-w-[18ch] font-display text-[clamp(2rem,4.4vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading"
      >
        How I work.
      </motion.h2>
      <motion.div
        variants={stagger(0.08)}
        {...revealOnce}
        className="mt-opt-2xl grid grid-cols-1 border-t border-opt-border-default sm:grid-cols-2 lg:grid-cols-4"
      >
        {process.map((p) => (
          <motion.div
            key={p.no}
            variants={riseIn}
            className="border-b border-opt-border-subtle p-6 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:last-child]:border-r-0"
          >
            <p className="font-display text-[13px] tracking-[0.06em] text-opt-text-placeholder">{p.no}</p>
            <h3 className="mt-3 text-[17px] font-medium text-opt-text-heading">{p.title}</h3>
            <p className="mt-2 text-[14px] leading-[1.55] text-opt-text-secondary">{p.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* Closing images — two-up. Placeholder tiles until Adedayo drops in
   real photos (owner will supply — feedback #13). */
function ClosingImages() {
  return (
    <section className="container-opt pb-opt-6xl">
      <motion.div variants={stagger(0.08)} {...revealOnce} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {['Portrait / studio', 'On the move'].map((label) => (
          <motion.div
            key={label}
            variants={riseIn}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 border border-dashed border-opt-border-default bg-opt-surface-low text-opt-text-placeholder"
          >
            <Camera size={22} />
            <span className="text-[12px] uppercase tracking-[0.08em]">{label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default function About() {
  return (
    <div className="min-h-screen">
      <PageFrame />
      <NavIsland />
      <main className="relative z-[1]">
        <section data-section="About" className="container-opt pt-40 pb-opt-lg">
          <Link
            to="/"
            className="link-underline inline-flex items-center gap-1.5 text-[13px] font-medium text-opt-text-secondary"
          >
            <ArrowLeft size={13} /> Home
          </Link>
        </section>

        <MiniAbout hideFullStory className="pt-opt-lg" />
        <Process />
        <ClientLogos label="Clients & companies" />
        <TestimonialBand />
        <ClosingImages />
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
