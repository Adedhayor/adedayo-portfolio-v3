// ============================================================
// Hero block — v3 masthead (BRIEF §4.1, reworked 2026-07-09).
// Conversational, copy-first (inspiration: seanhalpin.xyz).
// Greeting + name → role tags → a 2-line bio → CTAs. No hero
// images / cover cluster — the work bento carries the covers.
// Single centered column, one-line headline. Always plays (BRIEF §0.6).
// ============================================================
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { profile } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

type Props = {
  className?: string
}

export default function Hero({ className = '' }: Props) {
  return (
    <section
      data-hero
      className={[
        'relative flex min-h-[82vh] items-center overflow-hidden py-opt-5xl',
        className,
      ].join(' ')}
    >
      <div className="container-opt relative z-[1] w-full">
        <motion.div variants={stagger(0.13)} {...revealOnce} className="mx-auto max-w-[64ch] text-center">
          <motion.h1
            variants={riseIn}
            className="font-display text-[clamp(2.5rem,6.5vw,4.75rem)] leading-[0.95] tracking-[-0.02em] text-opt-text-heading sm:whitespace-nowrap"
          >
            Hi, I’m {profile.shortName}.
          </motion.h1>
          <motion.p
            variants={riseIn}
            className="mt-5 font-mono text-[13px] uppercase tracking-[0.14em] text-opt-text-secondary"
          >
            Product · UX · Design Systems
          </motion.p>
          <motion.p
            variants={riseIn}
            className="mx-auto mt-6 max-w-[46ch] text-pretty text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary"
          >
            Human-centered designer thinking in systems — 5 years of crafting product
            experiences end to end, then shipping my own ideas to code.
          </motion.p>
          <motion.div variants={riseIn} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="#work" variant="primary" trailingIcon={<ArrowDownRight size={14} strokeWidth={2.5} />}>
              View work
            </ButtonLink>
            <ButtonLink
              href={profile.calendly}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
              trailingIcon={<ArrowUpRight size={14} strokeWidth={2.5} />}
            >
              Book a call
            </ButtonLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
