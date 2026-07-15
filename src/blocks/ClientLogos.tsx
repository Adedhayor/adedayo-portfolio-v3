// ============================================================
// ClientLogos block — a "worked with" carousel of OFFICIAL brand
// assets rendered as currentColor CSS masks (monochrome, theme-
// aware; see assets/logos). Scrolls horizontally on a continuous
// loop with soft fades at both edges (About feedback 2026-07-12
// #3); pauses on hover.
// ============================================================
import { motion } from 'framer-motion'
import { CLIENT_LOGOS } from '@/assets/logos'
import { riseIn, revealOnce } from '@/lib/motion'

type Props = {
  label?: string
  className?: string
}

/* One pass of the logo row — rendered twice so the -50% keyframe
   loops without a seam. */
function LogoRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden || undefined} className="flex shrink-0 items-center gap-opt-4xl pr-opt-4xl">
      {CLIENT_LOGOS.map(({ name, src, w, h, showName }) => (
        <span
          key={name}
          className="inline-flex items-center gap-2.5 whitespace-nowrap text-opt-text-placeholder transition-colors duration-[var(--opt-motion-base)] hover:text-opt-text-heading"
        >
          {src && (
            <span
              role="img"
              aria-label={name}
              className="inline-block shrink-0 bg-current"
              style={{
                width: w,
                height: h,
                maskImage: `url(${src})`,
                maskRepeat: 'no-repeat',
                maskSize: 'contain',
                maskPosition: 'center',
                WebkitMaskImage: `url(${src})`,
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                WebkitMaskPosition: 'center',
              }}
            />
          )}
          {(!src || showName) && (
            <span className="font-display text-[clamp(1rem,1.8vw,1.35rem)] tracking-[-0.01em]">{name}</span>
          )}
        </span>
      ))}
    </div>
  )
}

export default function ClientLogos({ label = 'Trusted by teams at', className = '' }: Props) {
  return (
    <section className={['container-opt py-opt-3xl', className].join(' ')}>
      <motion.div variants={riseIn} {...revealOnce} className="border-y border-opt-border-default py-opt-xl">
        <p className="mb-opt-lg text-center text-[13px] text-opt-text-secondary">{label}</p>
        <div className="logo-marquee">
          <div className="logo-marquee-track">
            <LogoRow />
            <LogoRow ariaHidden />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
