// ============================================================
// TestimonialBand block — references (BRIEF §4.5, feedback #11/#12).
// Horizontal carousel with prev/next controls. PLACEHOLDER MODE:
// real references are being collected from referees; entries render
// in a clearly-marked awaiting state. Fully data-driven — flip
// `placeholder: false` and a real quote renders with no changes.
// TODO (#13): drop a shader render effect behind this band, ported
// from the effects-studio playground.
// ============================================================
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials, type Testimonial } from '@/data'
import { revealOnce, riseIn } from '@/lib/motion'

// Lazy so the WebGL shader code-splits out of the initial bundle.
const ShaderBackdrop = lazy(() => import('@/components/global/ShaderBackdrop'))

// Light pastels read on the light surface; dark mode needs richer, darker
// tones at higher opacity or the wash vanishes against the near-black bg.
const SHADER_LIGHT = ['#F4F4F1', '#E7ECFF', '#DFF3C9', '#F0EAFF']
const SHADER_DARK = ['#141420', '#33265E', '#1E4634', '#213152']

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure
      className={[
        'flex h-full flex-col justify-between p-6',
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
    </figure>
  )
}

const arrowCls =
  'grid size-10 shrink-0 cursor-pointer place-items-center rounded-none border border-opt-border-default bg-opt-surface-raised text-opt-text-secondary transition-colors duration-[var(--opt-motion-base)] hover:border-opt-border-focus/40 hover:text-opt-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus'

export default function TestimonialBand({ className = '' }: { className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = resolvedTheme === 'dark'

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.85
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <section className={['relative overflow-hidden bg-opt-surface-low', className].join(' ')}>
      {/* Subtle Paper shader wash behind the band — theme-aware so it reads in
          both light and dark (mounted-gated to avoid a wrong-theme flash). */}
      {mounted && (
        <Suspense fallback={null}>
          <ShaderBackdrop
            colors={dark ? SHADER_DARK : SHADER_LIGHT}
            speed={0.25}
            distortion={0.7}
            swirl={0.4}
            opacity={dark ? 0.6 : 0.28}
          />
        </Suspense>
      )}
      <div className="relative z-[1] container-opt py-opt-5xl">
        <div className="mb-opt-2xl flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(2rem,4.4vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading">
            What they say
          </h2>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous reference" onClick={() => scrollByCards(-1)} className={arrowCls}>
              <ChevronLeft size={16} />
            </button>
            <button type="button" aria-label="Next reference" onClick={() => scrollByCards(1)} className={arrowCls}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <motion.div
          variants={riseIn}
          {...revealOnce}
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t) => (
            <div key={t.name} data-card className="w-[86%] shrink-0 snap-start sm:w-[420px]">
              <TestimonialCard t={t} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
