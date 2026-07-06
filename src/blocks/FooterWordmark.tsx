// ============================================================
// FooterWordmark block — closing CTA + giant edge-to-edge
// wordmark (from the Figma footer). Sits on ink in both themes.
// ============================================================
import { motion } from 'framer-motion'
import { ContactWidget } from '@/blocks/_parts'
import { riseIn, revealOnce } from '@/lib/motion'
import { useWordmarkDrift } from '@/lib/gsap'

type Props = {
  headline?: string
  wordmark?: string
  email?: string
  calendly?: string
  className?: string
}

export default function FooterWordmark({
  headline = 'Let’s design incredible work together.',
  wordmark = 'ADEDAYO',
  email = 'dayo@replikit.ai',
  calendly = 'https://calendly.com/adedayobabalola/30min',
  className = '',
}: Props) {
  const scope = useWordmarkDrift(10)
  return (
    <footer ref={scope} className={['relative overflow-hidden bg-opt-ink text-opt-paper', className].join(' ')}>
      <div className="container-opt pt-opt-6xl pb-opt-2xl">
        <motion.div variants={riseIn} {...revealOnce} className="flex flex-col items-start gap-opt-2xl">
          <h2 className="max-w-[18ch] font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.02em]">
            {headline}
          </h2>
          <ContactWidget email={email} calendly={calendly} />
        </motion.div>
      </div>

      {/* Giant wordmark — bleeds to the edges */}
      <div className="select-none px-4 pb-6" aria-hidden="true">
        <div data-wordmark className="font-display font-semibold leading-[0.8] tracking-[-0.03em] text-opt-paper/95 text-[clamp(3.5rem,20vw,20rem)] whitespace-nowrap text-center will-change-transform">
          {wordmark}
        </div>
      </div>
    </footer>
  )
}
