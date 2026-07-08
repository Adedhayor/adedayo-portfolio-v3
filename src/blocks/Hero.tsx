// ============================================================
// Hero block — v3 masthead (BRIEF §4.1, reworked 2026-07-07).
// Marketing layout: copy LEFT, a tilted cluster of the four
// case-study covers RIGHT. On scroll the cluster lifts + fades
// (transform/opacity only, scoped to the hero — it never flies
// over the work section), handing off to the same covers as they
// reveal in the work bento below. No metrics strip (owner
// decision). Always plays (BRIEF §0.6 — motion is the experience).
// ============================================================
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { profile, caseStudies } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

/* Right-column collage — the 4 case-study covers, tilted + overlapping.
   Percentages are relative to the square cluster box (md+ only). */
const CLUSTER = [
  { top: '1%', left: '5%', w: '60%', rotate: -5, z: 30 },
  { top: '7%', left: '45%', w: '51%', rotate: 6, z: 20 },
  { top: '46%', left: '0%', w: '54%', rotate: 5, z: 10 },
  { top: '52%', left: '43%', w: '53%', rotate: -4, z: 25 },
]

type Props = {
  className?: string
}

export default function Hero({ className = '' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // Cluster exit — parallax up, staying opaque until it's most of the way
  // out (fading late reads as "scrolling away", not "disappearing").
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0])

  return (
    <section
      ref={ref}
      data-hero
      className={[
        'relative flex min-h-[92vh] items-center overflow-hidden py-opt-5xl',
        className,
      ].join(' ')}
    >
      <div className="container-opt relative z-[1] grid w-full grid-cols-1 items-center gap-opt-3xl md:grid-cols-[1.05fr_0.95fr]">
        {/* Left — copy */}
        <motion.div variants={stagger(0.13)} {...revealOnce} className="max-w-[54ch]">
          <motion.h1
            variants={riseIn}
            className="font-display text-[clamp(2.75rem,7vw,var(--opt-font-size-display))] leading-[0.95] tracking-[-0.02em] text-opt-text-heading"
          >
            {profile.shortName} {profile.name.split(' ')[0]}
          </motion.h1>
          <motion.p
            variants={riseIn}
            className="mt-4 font-mono text-[13px] uppercase tracking-[0.14em] text-opt-text-secondary"
          >
            Product, UX &amp; Design Systems
          </motion.p>
          <motion.p
            variants={riseIn}
            className="mt-6 max-w-[52ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary"
          >
            {profile.intro}
          </motion.p>
          <motion.div variants={riseIn} className="mt-9 flex flex-wrap items-center gap-3">
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

        {/* Right — tilted cover cluster (md+); mobile lets the grid own covers */}
        <motion.div
          aria-hidden="true"
          style={{ y, opacity }}
          className="pointer-events-none relative hidden aspect-square w-full md:block"
        >
          {caseStudies.map((cs, i) => {
            const c = CLUSTER[i]
            if (!c) return null
            return (
              <motion.div
                key={cs.slug}
                initial={{ opacity: 0, y: 24, rotate: c.rotate }}
                animate={{ opacity: 1, y: 0, rotate: c.rotate }}
                transition={{ delay: 0.15 + i * 0.09, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ top: c.top, left: c.left, width: c.w, zIndex: c.z }}
                className="absolute aspect-[4/3] overflow-hidden rounded-none border border-opt-border-subtle bg-opt-surface-low shadow-opt-md"
              >
                <img
                  src={cs.cover}
                  alt=""
                  loading="eager"
                  className="size-full object-contain p-2"
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
