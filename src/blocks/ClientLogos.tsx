// ============================================================
// ClientLogos block — a quiet "worked with" strip using the
// original monochrome logo marks (currentColor, theme-aware).
// Sharp, evenly spaced, responsive.
// ============================================================
import { motion } from 'framer-motion'
import { CLIENT_LOGOS } from '@/assets/logos'
import { riseIn, revealOnce } from '@/lib/motion'

type Props = {
  label?: string
  className?: string
}

export default function ClientLogos({ label = 'Trusted by teams at', className = '' }: Props) {
  return (
    <section className={['container-opt py-opt-3xl', className].join(' ')}>
      <motion.div variants={riseIn} {...revealOnce} className="border-y border-opt-border-default py-opt-xl">
        <p className="mb-opt-lg text-center text-[13px] text-opt-text-secondary">{label}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-opt-3xl gap-y-opt-lg sm:gap-x-opt-4xl">
          {CLIENT_LOGOS.map(({ name, Mark }) => (
            <span
              key={name}
              className="inline-flex items-center gap-2 text-opt-text-placeholder transition-colors duration-[var(--opt-motion-base)] hover:text-opt-text-heading"
            >
              <Mark className="shrink-0" />
              <span className="font-display text-[clamp(1rem,1.8vw,1.35rem)] tracking-[-0.01em]">{name}</span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
