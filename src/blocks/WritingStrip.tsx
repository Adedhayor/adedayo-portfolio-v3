// ============================================================
// WritingStrip block — the Substack strip (BRIEF §4.6, feedback #14).
// Default is an editorial LIST (text-forward, Benji-Taylor reference).
// The original card grid is kept as variant="cards" to revert to.
// Personal essays from "Adedayo 𓂀" — the human counterweight to the
// work. Links out for now; the in-site reader ships with /writing.
// ============================================================
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { writing, substackUrl } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

/* ---------- List (default) ---------- */
function WritingList() {
  return (
    <motion.ul variants={stagger(0.07)} {...revealOnce} className="mt-opt-xl border-t border-opt-border-default">
      {writing.map((w) => (
        <motion.li key={w.title} variants={riseIn}>
          <a
            href={w.url}
            target="_blank"
            rel="noreferrer"
            className="group grid grid-cols-1 gap-2 border-b border-opt-border-subtle py-6 md:grid-cols-[132px_1fr_auto] md:items-baseline md:gap-8"
          >
            <span className="text-[13px] text-opt-text-secondary">
              {w.date} · {w.readTime}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-[clamp(1.25rem,2.4vw,1.6rem)] leading-[1.15] text-opt-text-heading">
                {w.title}
              </h3>
              <p className="mt-2 max-w-[68ch] text-[14px] leading-[1.55] text-opt-text-secondary">{w.excerpt}</p>
            </div>
            <ArrowUpRight
              size={18}
              className="hidden shrink-0 text-opt-text-secondary transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-opt-text-heading md:block"
            />
          </a>
        </motion.li>
      ))}
    </motion.ul>
  )
}

/* ---------- Cards (kept for reference — variant="cards") ---------- */
function WritingCards() {
  return (
    <motion.div variants={stagger(0.08)} {...revealOnce} className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
            <p className="text-[13px] text-opt-text-secondary">
              {w.date} · {w.readTime} read
            </p>
            <h3 className="mt-3 font-display text-[22px] leading-[1.15] text-opt-text-heading">{w.title}</h3>
            <p className="mt-3 text-[14px] leading-[1.55] text-opt-text-secondary">{w.excerpt}</p>
          </div>
          <p className="mt-6 border-l-2 border-opt-border-default pl-3 text-[13px] italic leading-[1.5] text-opt-text-secondary">
            “{w.quote}”
          </p>
        </motion.a>
      ))}
    </motion.div>
  )
}

type Props = {
  variant?: 'list' | 'cards'
  className?: string
}

export default function WritingStrip({ variant = 'list', className = '' }: Props) {
  return (
    <section className={['container-opt py-opt-5xl', className].join(' ')}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-[54ch]">
          <h2 className="font-display text-[clamp(2rem,4.4vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading">
            Essays, not case studies.
          </h2>
          <p className="mt-3 text-[15px] leading-[1.5] text-opt-text-secondary">
            Notes on building, movement, and the human side of the work — written as Adedayo 𓂀.
          </p>
        </div>
        <ButtonLink
          href={substackUrl}
          target="_blank"
          rel="noreferrer"
          variant="ghost"
          size="compact"
          trailingIcon={<ArrowUpRight size={14} />}
        >
          Subscribe on Substack
        </ButtonLink>
      </div>

      {variant === 'cards' ? <WritingCards /> : <WritingList />}
    </section>
  )
}
