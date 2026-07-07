// ============================================================
// WritingStrip block — the Substack strip (BRIEF §4.6).
// Personal essays from "Adedayo 𓂀" — the human counterweight
// to the work. Links out for now; the in-site reader ships
// with /writing (build-time RSS fetch).
// ============================================================
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Cta } from '@/blocks/_parts'
import { writing, substackUrl } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

export default function WritingStrip({ className = '' }: { className?: string }) {
  return (
    <section className={['container-opt py-opt-5xl', className].join(' ')}>
      <div className="mb-opt-2xl flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Writing — Adedayo 𓂀</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.4vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading">
            Essays, not case studies.
          </h2>
        </div>
        <Cta as="a" href={substackUrl} variant="ghost" size="sm" icon={<ArrowUpRight size={14} />}>
          Subscribe on Substack
        </Cta>
      </div>

      <motion.div
        variants={stagger(0.08)}
        {...revealOnce}
        className="grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        {writing.map((w) => (
          <motion.a
            key={w.title}
            variants={riseIn}
            href={w.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col justify-between border border-opt-border-subtle bg-opt-surface-raised p-6 transition-colors duration-[var(--opt-motion-base)] hover:border-opt-border-default"
          >
            <div>
              <p className="label">
                {w.date} · {w.readTime} read
              </p>
              <h3 className="mt-3 font-display text-[22px] leading-[1.15] text-opt-text-heading">
                {w.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.55] text-opt-text-secondary">{w.excerpt}</p>
            </div>
            <p className="mt-6 border-l-2 border-opt-border-default pl-3 text-[13px] italic leading-[1.5] text-opt-text-secondary">
              “{w.quote}”
            </p>
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}
