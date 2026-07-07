// ============================================================
// MiniAbout block — landing about band (BRIEF §4.3).
// Left column: portrait + identity + a STACKED DECK of the work
// history (most-recent role on top; older roles peek underneath
// in decreasing widths; "See all roles" fans the full list).
// Right column: essay cut + stack/process.
// ============================================================
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { about, profile, workHistory } from '@/data'
import { dur, easeExpo, riseIn, stagger, revealOnce } from '@/lib/motion'

type Role = (typeof workHistory)[number]

function RoleCard({ w, className = '' }: { w: Role; className?: string }) {
  return (
    <div className={['border border-opt-border-subtle bg-opt-surface-raised p-4', className].join(' ')}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-medium text-opt-text-heading">{w.company}</span>
        <span className="shrink-0 text-[12px] text-opt-text-secondary">{w.period}</span>
      </div>
      <p className="mt-1 text-[13px] leading-[1.45] text-opt-text-secondary">{w.role}</p>
    </div>
  )
}

/* Stacked deck — collapsed shows the top role with two narrower cards
   peeking beneath; expanded fans out every role. */
function WorkHistoryStack() {
  const [open, setOpen] = useState(false)
  const top = workHistory[0]
  return (
    <div className="mt-opt-2xl">
      <p className="mb-3 text-[13px] font-semibold text-opt-text-secondary">Work history</p>

      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <motion.div
            key="stack"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.fast, ease: easeExpo }}
          >
            <div className="relative">
              {/* Peek layers — decreasing width, offset down, behind the top card */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-full w-[84%] -translate-x-1/2 translate-y-[14px] border border-opt-border-subtle bg-opt-surface-low"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-full w-[92%] -translate-x-1/2 translate-y-[7px] border border-opt-border-subtle bg-opt-surface-raised"
              />
              <RoleCard w={top} className="relative z-10" />
            </div>
            <button
              onClick={() => setOpen(true)}
              className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-opt-text-secondary transition-colors hover:text-opt-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
            >
              See all roles ({workHistory.length}) <ChevronDown size={13} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.base, ease: easeExpo }}
          >
            <div className="flex flex-col gap-2.5">
              {workHistory.map((w) => (
                <RoleCard key={w.company} w={w} />
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-opt-text-secondary transition-colors hover:text-opt-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
            >
              Show less <ChevronUp size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function MiniAbout({ className = '' }: { className?: string }) {
  return (
    <section className={['container-opt py-opt-6xl', className].join(' ')}>
      {/* Display heading */}
      <motion.h2
        variants={riseIn}
        {...revealOnce}
        className="max-w-[16ch] font-display text-[clamp(2.25rem,5vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading"
      >
        {about.heading}
      </motion.h2>

      <div className="mt-opt-3xl grid grid-cols-1 gap-opt-3xl md:grid-cols-[0.85fr_1.15fr]">
        {/* Portrait + identity + work-history stack */}
        <motion.div variants={riseIn} {...revealOnce}>
          <div className="overflow-hidden rounded-none border border-opt-border-subtle bg-opt-surface-raised">
            <img src={about.portrait} alt={`${profile.shortName} Babalola`} loading="lazy" className="aspect-square w-full object-cover" />
          </div>
          <p className="mt-4 text-[16px] font-medium text-opt-text-heading">Adedayo Babalola</p>
          <p className="mt-0.5 text-[13px] text-opt-text-secondary">
            {profile.role} · {profile.location}
          </p>

          <WorkHistoryStack />
        </motion.div>

        {/* Essay cut + stack */}
        <motion.div variants={stagger(0.08)} {...revealOnce}>
          {about.bio.map((p) => (
            <motion.p
              key={p.slice(0, 24)}
              variants={riseIn}
              className="mb-5 max-w-[58ch] text-[var(--opt-font-size-lead)] leading-[1.55] text-opt-text-secondary [&:first-of-type]:text-opt-text-primary"
            >
              {p}
            </motion.p>
          ))}

          <motion.div variants={riseIn}>
            <Link
              to="/about"
              className="link-underline inline-flex items-center gap-1.5 text-[14px] font-medium text-opt-text-heading"
            >
              The full story <ArrowUpRight size={14} />
            </Link>
          </motion.div>

          {/* Stack & process */}
          <motion.div variants={riseIn} className="mt-opt-3xl">
            <p className="mb-3 text-[13px] font-semibold text-opt-text-secondary">Stack &amp; process</p>
            <div className="flex flex-wrap gap-2">
              {about.stack.map((tool) => (
                <span
                  key={tool}
                  className="border border-opt-border-subtle bg-opt-surface-raised px-3 py-1.5 text-[13px] text-opt-text-secondary transition-colors duration-[var(--opt-motion-base)] hover:border-opt-border-default hover:text-opt-text-heading"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
