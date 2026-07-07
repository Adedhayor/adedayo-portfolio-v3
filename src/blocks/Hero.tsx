// ============================================================
// Hero block — v3 masthead (BRIEF §4.1). Centered text with
// real product shots scattered around it that scroll into the
// work bento grid (see lib/scatter.ts, wired at Home level).
// No metrics strip (owner decision, 2026-07-07).
// ============================================================
import { motion } from 'framer-motion'
import { CornerRightDown, ArrowUpRight } from 'lucide-react'
import { Cta } from '@/blocks/_parts'
import { profile, heroScatter } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

type Props = {
  className?: string
}

export default function Hero({ className = '' }: Props) {
  return (
    <section
      data-hero
      className={[
        'relative flex min-h-[92vh] flex-col items-center justify-center overflow-visible py-opt-6xl',
        className,
      ].join(' ')}
    >
      {/* Scattered product shots — md+ only; they scrub into the bento */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden md:block">
        {heroScatter.map((s) => (
          <img
            key={s.id}
            data-scatter={s.slug ?? ''}
            data-rotate={s.rotate}
            src={s.src}
            alt=""
            loading="eager"
            style={{ top: s.top, left: s.left, width: s.w }}
            className="absolute rounded-none border border-opt-border-subtle shadow-opt-md will-change-transform"
          />
        ))}
      </div>

      {/* Centered copy */}
      <motion.div
        variants={stagger(0.09)}
        {...revealOnce}
        className="container-opt relative z-[1] mx-auto max-w-[840px] text-center"
      >
        <motion.p variants={riseIn} className="eyebrow">
          {profile.role} — {profile.location.split(',')[0]}
        </motion.p>
        <motion.h1
          variants={riseIn}
          className="mt-5 font-display text-[clamp(3rem,9vw,var(--opt-font-size-display))] leading-[0.95] tracking-[-0.02em] text-opt-text-heading"
        >
          {profile.shortName} {profile.name.split(' ')[0]}
        </motion.h1>
        <motion.p
          variants={riseIn}
          className="mx-auto mt-7 max-w-[58ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary"
        >
          {profile.intro}
        </motion.p>
        <motion.p variants={riseIn} className="mt-5 text-[15px] text-opt-text-secondary">
          <span className="font-medium text-opt-text-heading">Currently</span> — {profile.currently}
        </motion.p>
        <motion.div variants={riseIn} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Cta as="a" href="#work" variant="solid" caps icon={<CornerRightDown size={15} />}>
            View work
          </Cta>
          <Cta as="a" href={profile.calendly} variant="ghost" caps icon={<ArrowUpRight size={15} />}>
            Book a call
          </Cta>
        </motion.div>
      </motion.div>
    </section>
  )
}
