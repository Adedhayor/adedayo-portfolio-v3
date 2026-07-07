// ============================================================
// WorkGrid block — the bento work section (BRIEF §4.2).
// Tabs: All · Case studies · Live projects · Playground.
// Case-study cells carry data-bento-target/-cover so the hero
// scatter images can land in them (lib/scatter.ts).
// Sharp edges, hairline dividers, filter transitions never
// bounce the page.
// ============================================================
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Segmented, SegmentedItem } from '@/components/ui/segmented'
import { Cta } from '@/blocks/_parts'
import { caseStudies, moreWork, type CaseStudy } from '@/data'
import { dur, easeExpo } from '@/lib/motion'

type TabKey = 'all' | 'case-studies' | 'live' | 'playground'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'case-studies', label: 'Case studies' },
  { key: 'live', label: 'Live projects' },
  { key: 'playground', label: 'Playground' },
]

/* Bento spans for the 4 case studies (md+ · 6-col grid) */
const CS_SPANS = [
  'md:col-span-4 md:row-span-2',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-3',
]

const cardMotion = {
  layout: true,
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: dur.slow, ease: easeExpo },
}

/* ---------- Case-study bento cell ---------- */
function CaseCell({ cs, span }: { cs: CaseStudy; span: string }) {
  return (
    <motion.div {...cardMotion} className={['group relative', span].join(' ')}>
      <Link to={`/case-study/${cs.slug}`} className="flex h-full flex-col">
        <div
          data-bento-target={cs.slug}
          className="relative min-h-[220px] flex-1 overflow-hidden rounded-none border border-opt-border-subtle bg-opt-surface-raised"
        >
          <img
            data-bento-cover={cs.slug}
            src={cs.cover}
            alt={cs.title}
            loading="lazy"
            style={{ objectPosition: cs.coverPos }}
            className="absolute inset-0 size-full object-cover transition-transform duration-[var(--opt-motion-slower)] [transition-timing-function:var(--opt-easing-expo)] group-hover:scale-[1.03]"
          />
          <span className="absolute left-3 top-3 border border-opt-border-subtle bg-opt-surface-base/85 px-2 py-0.5 text-[11px] font-semibold tracking-[0.06em] text-opt-text-secondary backdrop-blur-sm">
            {cs.index}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3 pt-4">
          <div className="min-w-0">
            <h3 className="text-[16px] font-medium leading-snug text-opt-text-heading">{cs.title}</h3>
            <p className="label mt-1">
              {cs.tag} · {cs.client} · {cs.year}
            </p>
          </div>
          <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-opt-text-secondary transition-colors group-hover:text-opt-text-heading">
            {cs.metric}
            <ArrowUpRight
              size={13}
              className="transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

/* ---------- Lighter text cell (more work / live projects) ---------- */
function MoreCell({ item }: { item: (typeof moreWork)[number] }) {
  return (
    <motion.div
      {...cardMotion}
      className="group flex min-h-[140px] flex-col justify-between border border-opt-border-subtle bg-opt-surface-raised p-5 md:col-span-2"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-medium text-opt-text-heading">{item.title}</h3>
        <span className="label shrink-0">{item.year}</span>
      </div>
      <div>
        <p className="text-[13px] text-opt-text-secondary">{item.note}</p>
        <p className="label mt-1.5">{item.tag}</p>
      </div>
    </motion.div>
  )
}

/* ---------- Playground teaser ---------- */
function PlaygroundCell() {
  return (
    <motion.div
      {...cardMotion}
      className="group md:col-span-2"
    >
      <Link
        to="/work"
        className="flex h-full min-h-[140px] flex-col justify-between border border-dashed border-opt-border-default bg-transparent p-5"
      >
        <h3 className="text-[15px] font-medium text-opt-text-heading">Playground</h3>
        <p className="text-[13px] text-opt-text-secondary">
          Shipped experiments from GitHub — Community League, SPOB, Spotifeed & more.
          <span className="ml-1 inline-flex items-center gap-1 font-semibold text-opt-text-heading">
            Browse <ArrowRight size={12} />
          </span>
        </p>
      </Link>
    </motion.div>
  )
}

export default function WorkGrid({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState<TabKey>('all')

  const showCases = tab === 'all' || tab === 'case-studies'
  const showMore = tab === 'all' || tab === 'live'
  const showPlayground = tab === 'all' || tab === 'playground'

  return (
    <section className={['container-opt py-opt-5xl', className].join(' ')}>
      {/* Header row */}
      <div className="mb-opt-2xl flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Selected work</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.4vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading">
            Work
          </h2>
        </div>
        <Segmented
          size="lg"
          value={tab}
          onValueChange={(v) => v && setTab(v as TabKey)}
          aria-label="Filter work"
        >
          {TABS.map((t) => (
            <SegmentedItem key={t.key} value={t.key}>
              {t.label}
            </SegmentedItem>
          ))}
        </Segmented>
      </div>

      {/* Bento */}
      <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-6">
        <AnimatePresence mode="popLayout">
          {showCases &&
            caseStudies.map((cs, i) => <CaseCell key={cs.slug} cs={cs} span={CS_SPANS[i] ?? 'md:col-span-2'} />)}
          {showMore && moreWork.map((m) => <MoreCell key={m.title} item={m} />)}
          {showPlayground && <PlaygroundCell key="playground" />}
        </AnimatePresence>
      </motion.div>

      {/* See all */}
      <div className="mt-opt-2xl flex justify-center">
        <Cta as="a" href="/work" variant="ghost" icon={<ArrowRight size={16} />}>
          See all work
        </Cta>
      </div>
    </section>
  )
}
