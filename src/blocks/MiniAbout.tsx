// ============================================================
// MiniAbout block — landing about band (BRIEF §4.3).
// Portrait left · essay cut + work history + stack right.
// Reference: v2 about band (photo, "Designing experiences that
// solve real problems.", history stack).
// ============================================================
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { about, profile, workHistory } from '@/data'
import { dur, easeExpo, riseIn, stagger, revealOnce } from '@/lib/motion'

const VISIBLE_HISTORY = 3

export default function MiniAbout({ className = '' }: { className?: string }) {
  const [showAll, setShowAll] = useState(false)
  const rows = showAll ? workHistory : workHistory.slice(0, VISIBLE_HISTORY)

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
        {/* Portrait + identity */}
        <motion.div variants={riseIn} {...revealOnce}>
          <div className="overflow-hidden rounded-none border border-opt-border-subtle bg-opt-surface-raised">
            <img src={about.portrait} alt={`${profile.shortName} Babalola`} loading="lazy" className="aspect-square w-full object-cover" />
          </div>
          <p className="mt-4 text-[16px] font-medium text-opt-text-heading">Adedayo Babalola</p>
          <p className="label mt-0.5">
            {profile.role} · {profile.location}
          </p>
        </motion.div>

        {/* Essay cut + history + stack */}
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

          {/* Work history */}
          <motion.div variants={riseIn} className="mt-opt-2xl">
            <p className="eyebrow mb-3">Work history</p>
            <ul className="border-t border-opt-border-default">
              {rows.map((w) => (
                <li
                  key={w.company}
                  className="flex items-baseline justify-between gap-4 border-b border-opt-border-subtle py-3.5"
                >
                  <div className="min-w-0">
                    <span className="text-[15px] font-medium text-opt-text-heading">{w.company}</span>
                    <span className="ml-2 text-[13px] text-opt-text-secondary">{w.role}</span>
                  </div>
                  <span className="label shrink-0">{w.period}</span>
                </li>
              ))}
            </ul>
            <AnimatePresence initial={false}>
              {!showAll && (
                <motion.button
                  exit={{ opacity: 0 }}
                  transition={{ duration: dur.fast, ease: easeExpo }}
                  onClick={() => setShowAll(true)}
                  className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-opt-text-secondary transition-colors hover:text-opt-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
                >
                  Show all <ChevronDown size={13} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stack & process */}
          <motion.div variants={riseIn} className="mt-opt-2xl">
            <p className="eyebrow mb-3">Stack &amp; process</p>
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
