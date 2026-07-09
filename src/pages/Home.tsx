// ============================================================
// Home — the composed landing page (BRIEF §4, reworked 2026-07-09).
// Order: Loader → Hero → Work bento → Play teaser → Notes strip →
// Footer. About moved to its own /about page; Contact folded into
// the footer. Global chrome: AsciiField + PageFrame + NavIsland.
// ============================================================
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import Loader from '@/components/global/Loader'
import AsciiField from '@/components/global/AsciiField'
import FloatingContact from '@/components/global/FloatingContact'
import Hero from '@/blocks/Hero'
import WorkGrid from '@/blocks/WorkGrid'
import WritingStrip from '@/blocks/WritingStrip'
import FooterWordmark from '@/blocks/FooterWordmark'
import { moreWork, labs } from '@/data'
import { riseIn, revealOnce } from '@/lib/motion'

/* Play teaser — a taste that links to the full /play page (feedback #6). */
function PlayTeaser() {
  const count = moreWork.length + labs.length
  return (
    <section className="container-opt py-opt-5xl">
      <motion.div
        variants={riseIn}
        {...revealOnce}
        className="flex flex-col items-start justify-between gap-6 border border-opt-border-subtle bg-opt-surface-raised p-8 md:flex-row md:items-center md:p-10"
      >
        <div className="max-w-[46ch]">
          <h2 className="font-display text-[clamp(1.75rem,3.4vw,var(--opt-font-size-h3))] leading-[1.08] text-opt-text-heading">
            Play.
          </h2>
          <p className="mt-3 text-[15px] leading-[1.5] text-opt-text-secondary">
            Side projects, live builds, and small experiments — the things I made to figure
            something out. {count} and counting.
          </p>
        </div>
        <Link
          to="/play"
          className="group inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold text-opt-text-heading"
        >
          <span className="link-underline">Enter the playground</span>
          <ArrowRight
            size={15}
            strokeWidth={2.5}
            className="transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:translate-x-1"
          />
        </Link>
      </motion.div>
    </section>
  )
}

export default function Home() {
  return (
    <div id="top" className="min-h-screen">
      {/* Opening sequence — plays once per session, skippable */}
      <Loader />

      {/* Cursor-reactive ASCII background — behind everything */}
      <AsciiField />

      <PageFrame />
      <NavIsland />
      <main className="relative z-[1]">
        <section data-section="Home">
          <Hero />
        </section>
        <section id="work" data-section="Work">
          <WorkGrid />
        </section>
        <section id="play" data-section="Play">
          <PlayTeaser />
        </section>
        <section id="notes" data-section="Notes">
          <WritingStrip />
        </section>
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>

      {/* Floating contact toolbar — rides the bottom until the footer is reached */}
      <FloatingContact />
    </div>
  )
}
