// ============================================================
// About — /about (BRIEF §5, reworked round E 2026-07-12).
// The split layout returns: portrait + identity ride the LHS and
// stay STICKY while the right column scrolls — bio → currently →
// work history (with role summaries + Read CV) → stack → the
// numbered process as a 2×2. Then the clients carousel.
// (Testimonials + closing images pulled 2026-07-15 pending real
// references and worthier shots.)
// ============================================================
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import { WorkHistoryStack, StackChips } from '@/blocks/MiniAbout'
import ClientLogos from '@/blocks/ClientLogos'
import { about, process, profile } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

/* Above-the-fold on a fresh route — animate on mount (see CaseStudy). */
const revealOnMount = { initial: 'hidden' as const, animate: 'show' as const }

/* Numbered process — 01–04 as a 2×2 grid inside the scrolling column. */
function ProcessGrid() {
  return (
    <div className="mt-opt-4xl">
      <motion.h2
        variants={riseIn}
        {...revealOnce}
        className="max-w-[18ch] font-display text-[clamp(1.75rem,3.4vw,var(--opt-font-size-h3))] leading-[1.08] text-opt-text-heading"
      >
        How I work.
      </motion.h2>
      <motion.div
        variants={stagger(0.08)}
        {...revealOnce}
        className="mt-opt-xl grid grid-cols-1 border-t border-opt-border-default sm:grid-cols-2"
      >
        {process.map((p) => (
          <motion.div
            key={p.no}
            variants={riseIn}
            className="border-b border-opt-border-subtle p-6 sm:[&:nth-child(odd)]:border-r sm:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <p className="font-display text-[13px] tracking-[0.06em] text-opt-text-placeholder">{p.no}</p>
            <h3 className="mt-3 text-[17px] font-medium text-opt-text-heading">{p.title}</h3>
            <p className="mt-2 text-[14px] leading-[1.55] text-opt-text-secondary">{p.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
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

        {/* Heading + split band — sticky portrait left, story right */}
        <section className="container-opt pt-opt-lg pb-opt-5xl">
          <motion.h1
            variants={riseIn}
            {...revealOnMount}
            className="max-w-[16ch] font-display text-[clamp(2.25rem,5vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading"
          >
            {about.heading}
          </motion.h1>

          <div className="mt-opt-3xl grid grid-cols-1 gap-opt-3xl md:grid-cols-[0.85fr_1.15fr]">
            {/* Portrait + identity — sticky while the story scrolls */}
            <motion.div variants={riseIn} {...revealOnMount} className="self-start md:sticky md:top-28">
              <div className="overflow-hidden rounded-none border border-opt-border-subtle bg-opt-surface-raised">
                <img src={about.portrait} alt={`${profile.shortName} Babalola`} className="h-auto w-full" />
              </div>
              <p className="mt-4 text-[16px] font-medium text-opt-text-heading">Adedayo Babalola</p>
              <p className="mt-0.5 text-[13px] text-opt-text-secondary">
                {profile.role} · {profile.location}
              </p>
            </motion.div>

            {/* The story — bio → currently → history → stack → process */}
            <div>
              <motion.div variants={stagger(0.08)} {...revealOnMount}>
                {about.bio.map((p) => (
                  <motion.p
                    key={p.slice(0, 24)}
                    variants={riseIn}
                    className="mb-5 max-w-[58ch] text-[var(--opt-font-size-lead)] leading-[1.55] text-opt-text-secondary [&:first-of-type]:text-opt-text-primary"
                  >
                    {p}
                  </motion.p>
                ))}
                <motion.p variants={riseIn} className="text-[15px] leading-[1.5] text-opt-text-secondary">
                  <span className="font-medium text-opt-text-heading">Currently</span> — {profile.currently}
                </motion.p>
              </motion.div>

              <WorkHistoryStack />

              <motion.div variants={riseIn} {...revealOnce} className="mt-opt-3xl">
                <p className="mb-3 text-[13px] font-semibold text-opt-text-secondary">Stack &amp; process</p>
                <StackChips />
              </motion.div>

              <ProcessGrid />
            </div>
          </div>
        </section>

        <ClientLogos label="Clients & companies" />
        {/* TestimonialBand pulled 2026-07-15 until real references land;
            ClosingImages pulled until worthier shots replace the low-res
            crops. Both blocks still exist — re-add here when ready. */}
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
