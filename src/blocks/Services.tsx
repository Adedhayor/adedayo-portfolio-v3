// ============================================================
// Services block — "Services that supercharge your business."
// Editorial two-column: statement left, numbered service list right.
// Rows are hairline-separated (no rounding), reveal on scroll.
// ============================================================
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

type Service = { name: string; note?: string }

type Props = {
  title?: string
  services?: Service[]
  className?: string
}

export default function Services({
  title = 'Services that supercharge your business.',
  services = [
    { name: 'Design Systems', note: 'Token-based, accessible, dev-ready' },
    { name: 'Product Design', note: 'Complex flows made simple' },
    { name: 'Web Apps', note: 'Design + build in code' },
    { name: 'Mobile Apps', note: 'iOS & Android product UX' },
    { name: 'Landing Pages', note: 'High-converting, fast' },
    { name: 'UI/UX Consultation', note: 'Audits, direction, systems' },
  ],
  className = '',
}: Props) {
  return (
    <section className={['container-opt py-opt-6xl', className].join(' ')}>
      <div className="grid grid-cols-1 gap-opt-2xl lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="font-display text-[clamp(2rem,4.4vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading">
          {title}
        </h2>

        <motion.ul variants={stagger(0.06)} {...revealOnce} className="border-t border-opt-border-default">
          {services.map((s) => (
            <motion.li key={s.name} variants={riseIn}>
              <a
                href="#contact"
                className="group flex items-center justify-between gap-4 border-b border-opt-border-default py-opt-lg"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-[17px] font-medium text-opt-text-heading">{s.name}</span>
                  {s.note && <span className="hidden text-[14px] text-opt-text-placeholder sm:inline">{s.note}</span>}
                </div>
                <ArrowUpRight
                  size={18}
                  className="shrink-0 text-opt-text-secondary transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
