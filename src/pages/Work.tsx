// ============================================================
// Work — /work. Case studies only (feedback 2026-07-15) —
// the live projects & smaller builds move to the play section
// when it ships. Uniform cards, no featured cell.
// ============================================================
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import { ProjectCard } from '@/blocks/WorkGrid'
import { isNdaUnlocked } from '@/lib/nda'
import { caseStudies } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

export default function Work() {
  return (
    <div className="min-h-screen">
      <PageFrame />
      <NavIsland />
      <main className="relative z-[1]">
        {/* Masthead */}
        <section data-section="Work" className="container-opt pt-40 pb-opt-2xl">
          <motion.div variants={stagger(0.08)} {...revealOnce}>
            <motion.div variants={riseIn}>
              <Link
                to="/"
                className="link-underline inline-flex items-center gap-1.5 text-[13px] font-medium text-opt-text-secondary"
              >
                <ArrowLeft size={13} /> Home
              </Link>
            </motion.div>
            <motion.h1
              variants={riseIn}
              className="mt-6 font-display text-[clamp(2.25rem,5.5vw,var(--opt-font-size-h1))] leading-[1.02] text-opt-text-heading"
            >
              All work.
            </motion.h1>
            <motion.p variants={riseIn} className="mt-5 max-w-[52ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary">
              Deep dives into the work — systems, research, and the decisions behind them.
            </motion.p>
          </motion.div>
        </section>

        {/* Case studies — live projects & smaller builds ship with the
            play section later (feedback 2026-07-15) */}
        <section className="container-opt pb-opt-5xl">
          <motion.div
            variants={stagger(0.06)}
            {...revealOnce}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {caseStudies.map((cs) => {
              const locked = Boolean(cs.nda) && !isNdaUnlocked()
              return (
                <motion.div key={cs.slug} variants={riseIn} className="h-full">
                  <ProjectCard
                    cover={cs.cover}
                    coverPos={cs.coverPos}
                    title={cs.title}
                    meta={`${cs.client} · ${cs.year}`}
                    blurb={cs.blurb}
                    tags={cs.tag.split('·').map((t) => t.trim())}
                    cta="Read case study"
                    to={`/case-study/${cs.slug}`}
                    locked={locked}
                    fill
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </section>

      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
