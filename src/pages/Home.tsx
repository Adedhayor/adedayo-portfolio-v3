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
import YardSurface from '@/components/global/YardSurface'
import Hero from '@/blocks/Hero'
import WorkGrid from '@/blocks/WorkGrid'
import WritingStrip from '@/blocks/WritingStrip'
import FooterWordmark from '@/blocks/FooterWordmark'
import { riseIn, revealOnce } from '@/lib/motion'
import { showPlayground } from '@/lib/release'

/* Play teaser — a taste that links to the full /play page (feedback #6). */
function PlayTeaser() {
  return (
    <section className="container-opt py-opt-3xl">
      <motion.div
        variants={riseIn}
        {...revealOnce}
        className="relative min-h-[440px] overflow-hidden border border-opt-border-subtle bg-[#24393b]"
      >
        <div className="absolute inset-0">
          <YardSurface className="h-full !min-h-0" controlPosition="top-right" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,16,17,0.78)_0%,rgba(7,16,17,0.32)_58%,rgba(7,16,17,0.08)_100%)]" />
        <div className="relative z-10 flex min-h-[440px] flex-col justify-end gap-7 p-8 text-white md:p-10">
          <div className="max-w-[46ch]">
            <h2 className="font-display text-[clamp(2.4rem,5vw,var(--opt-font-size-h2))] leading-[1.02]">
              The Playground.
            </h2>
            <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.6] text-white/80">
              Side projects, live builds, and small experiments — the things I made to figure
              something out.
            </p>
          </div>
          <Link
            to="/play"
            className="group inline-flex w-fit shrink-0 items-center gap-1.5 text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="link-underline">Explore the Playground</span>
            <ArrowRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:translate-x-1"
            />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

export default function Home() {
  return (
    <div id="top" className="min-h-screen">
      {/* Opening sequence — plays once per session, skippable */}
      <Loader />

      <PageFrame />
      <NavIsland />
      <main className="relative z-[1]">
        <section data-section="Home">
          <Hero />
        </section>
        <section id="work" data-section="Work">
          <WorkGrid />
        </section>
        {/* Playground index; private experiments gate themselves in production. */}
        {showPlayground && (
          <section id="play" data-section="Play">
            <PlayTeaser />
          </section>
        )}
        <section id="blog" data-section="Blog">
          <WritingStrip />
        </section>
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
