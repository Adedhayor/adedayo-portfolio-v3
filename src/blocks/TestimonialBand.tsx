// ============================================================
// TestimonialBand block — references (BRIEF §4.5).
// PLACEHOLDER MODE: real references are being collected from
// referees; entries render in a clearly-marked awaiting state.
// Fully data-driven from data.ts — when a real reference lands,
// flip `placeholder: false` and it renders as a proper quote
// with zero component changes.
// ============================================================
import { motion } from 'framer-motion'
import { testimonials, type Testimonial } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <motion.figure
      variants={riseIn}
      className={[
        'flex flex-col justify-between p-6',
        t.placeholder
          ? 'border border-dashed border-opt-border-default bg-transparent'
          : 'border border-opt-border-subtle bg-opt-surface-raised',
      ].join(' ')}
    >
      <div>
        {t.placeholder && (
          <span className="mb-4 inline-block border border-opt-border-subtle px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-opt-text-placeholder">
            Awaiting reference
          </span>
        )}
        <blockquote
          className={[
            'font-display text-[19px] leading-[1.35] tracking-[-0.01em]',
            t.placeholder ? 'text-opt-text-placeholder' : 'text-opt-text-heading',
          ].join(' ')}
        >
          “{t.quote}”
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3">
        <span
          className={[
            'grid size-10 place-items-center rounded-none text-[13px] font-semibold',
            t.placeholder
              ? 'border border-dashed border-opt-border-default text-opt-text-placeholder'
              : 'bg-opt-interactive-active-fill text-opt-surface-base',
          ].join(' ')}
        >
          {t.name.charAt(0)}
        </span>
        <div className="leading-tight">
          <div className="text-[14px] font-semibold text-opt-text-heading">{t.name}</div>
          <div className="text-[13px] text-opt-text-secondary">
            {t.title}
            {t.company !== '—' ? ` · ${t.company}` : ''}
          </div>
        </div>
      </figcaption>
    </motion.figure>
  )
}

export default function TestimonialBand({ className = '' }: { className?: string }) {
  return (
    <section className={['bg-opt-surface-low', className].join(' ')}>
      <div className="container-opt py-opt-5xl">
        <p className="eyebrow mb-opt-2xl">What they say — references incoming</p>
        <motion.div
          variants={stagger(0.08)}
          {...revealOnce}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
