// ============================================================
// Hero block — the masthead. Eyebrow + display name + lead + CTA
// trio (from the Figma source). Composable, theme-aware, sharp.
// ============================================================
import { motion } from 'framer-motion'
import { Cta } from '@/blocks/_parts'
import { CornerRightDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { riseIn, stagger, revealOnce } from '@/lib/motion'
import { useParallax } from '@/lib/gsap'

type HeroCta = { label: string; href?: string; icon?: 'scroll' | 'external' | 'download' }

type Props = {
  eyebrow?: string
  name?: string
  lead?: string
  ctas?: HeroCta[]
  className?: string
}

const icons = {
  scroll: <CornerRightDown size={15} />,
  external: <ArrowUpRight size={15} />,
  download: <ArrowDownRight size={15} />,
}

export default function Hero({
  eyebrow = 'Product, UX & Design Systems',
  name = 'Adedayo Babalola',
  lead = 'I turn complex systems into intuitive experiences. Five years designing for fintech, Web3, and SaaS — creating products that manage $5M+ in digital assets and drive 30% average engagement increases.',
  ctas = [
    { label: 'Case Studies', href: '#work', icon: 'scroll' },
    { label: 'Get in touch', href: '#contact', icon: 'external' },
    { label: 'Resume', href: '#', icon: 'download' },
  ],
  className = '',
}: Props) {
  const scope = useParallax('[data-parallax]', -32)
  return (
    <section ref={scope} className={['container-opt py-opt-6xl text-center', className].join(' ')}>
      <motion.div variants={stagger(0.08)} {...revealOnce} className="mx-auto max-w-[900px]">
        <motion.h1
          data-parallax
          variants={riseIn}
          className="font-display text-[clamp(3rem,9vw,var(--opt-font-size-display))] leading-[0.95] tracking-[-0.02em] text-opt-text-heading will-change-transform"
        >
          {name}
        </motion.h1>
        <motion.p variants={riseIn} className="eyebrow mt-6">
          {eyebrow}
        </motion.p>
        <motion.p
          variants={riseIn}
          className="mx-auto mt-6 max-w-[62ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary"
        >
          {lead}
        </motion.p>
        <motion.div variants={riseIn} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {ctas.map((c) => (
            <Cta
              key={c.label}
              as="a"
              href={c.href}
              variant="solid"
              caps
              icon={c.icon ? icons[c.icon] : undefined}
            >
              {c.label}
            </Cta>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
