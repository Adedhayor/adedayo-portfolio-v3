// ============================================================
// WorkGrid — the five selected studies on Home. Desktop uses a
// native CSS sticky stack: the heading remains visible while each
// opaque project row replaces the one before it. Mobile falls back
// to a straightforward vertical list.
// ============================================================
import { ArrowRight, ArrowUpRight, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { isNdaUnlocked } from '@/lib/nda'
import { caseStudies, featuredSlugs, type CaseStudy } from '@/data'

const HOME_SLUGS = featuredSlugs
const DISPLAY_TITLES: Record<string, string> = {
  inkwell: 'Inkwell Design System',
}

function SelectedProject({ study, index }: { study: CaseStudy; index: number }) {
  const locked = Boolean(study.nda) && !isNdaUnlocked()
  const tags = study.tag.split('·').map((tag) => tag.trim())

  return (
    <div
      className={[
        'selected-work-sticky w-full lg:sticky',
        index === 0 ? 'lg:top-0' : 'lg:top-[11.25rem]',
      ].join(' ')}
      style={{ zIndex: index + 1 }}
    >
      {index === 0 && (
        <div className="flex min-h-[11.25rem] items-end border-b border-opt-border-default bg-opt-surface-base pb-5">
          <h2 className="font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.035em] text-opt-text-heading">
            Selected work
          </h2>
        </div>
      )}

      <Link
        to={`/case-study/${study.slug}`}
        className="group relative isolate grid w-full overflow-hidden border border-opt-border-default bg-opt-surface-base p-3 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-opt-text-heading lg:min-h-[454px] lg:grid-cols-12 lg:gap-x-3 lg:px-0 lg:py-4"
      >
        <div className="relative aspect-[16/10] overflow-hidden border border-opt-border-subtle bg-opt-surface-low lg:col-span-7 lg:aspect-auto lg:h-[420px]">
          <img
            src={study.cover}
            alt={study.title}
            loading={index < 2 ? 'eager' : 'lazy'}
            style={{ objectPosition: study.coverPos }}
            className="absolute inset-0 size-full object-cover transition-transform duration-[var(--opt-motion-slower)] [transition-timing-function:var(--opt-easing-expo)] group-hover:scale-[1.025]"
          />
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 border border-white/30 bg-black/45 px-3 py-2 text-[12px] font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity duration-[var(--opt-motion-base)] group-hover:opacity-100 group-focus-visible:opacity-100">
            {locked && <Lock size={12} aria-hidden="true" />}
            Read case study
            <ArrowUpRight size={13} aria-hidden="true" />
          </span>
        </div>

        <div className="flex flex-col justify-between gap-8 py-5 lg:col-span-3 lg:py-0">
          <p className="text-[clamp(1rem,1.35vw,1.2rem)] font-medium leading-[1.12] text-opt-text-primary">
            {study.blurb}
          </p>
          <div>
            <p className="text-[12px] text-opt-text-secondary">
              {[study.client, study.year].filter(Boolean).join(' · ')}
            </p>
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.08em] text-opt-text-secondary">
              {tags.map((tag) => <span key={tag}>{tag}</span>)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_18px] items-start gap-3 pb-2 lg:col-span-2 lg:py-0">
          <h3 className="min-w-0 font-display text-[clamp(1.65rem,2.4vw,2.45rem)] leading-[0.98] tracking-[-0.025em] text-opt-text-heading">
            {DISPLAY_TITLES[study.slug] ?? study.title}
          </h3>
          <ArrowRight
            size={18}
            aria-hidden="true"
            className="mt-1 shrink-0 text-opt-text-secondary transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:translate-x-1"
          />
        </div>
      </Link>
    </div>
  )
}

export default function WorkGrid({ className = '' }: { className?: string }) {
  const studies = HOME_SLUGS
    .map((slug) => caseStudies.find((study) => study.slug === slug))
    .filter((study): study is CaseStudy => Boolean(study))

  return (
    <section className={['container-opt py-opt-5xl', className].join(' ')}>
      <div className="selected-work-stack isolate">
        {studies.map((study, index) => (
          <SelectedProject key={study.slug} study={study} index={index} />
        ))}
      </div>

      <div className="relative z-10 flex justify-center bg-opt-surface-base pt-opt-2xl">
        <Link to="/work" className={buttonVariants({ variant: 'ghost', iconPosition: 'trailing' })}>
          See all work
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  )
}
