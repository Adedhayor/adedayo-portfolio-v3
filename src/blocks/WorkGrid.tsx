// ============================================================
// WorkGrid block — the bento work section (BRIEF §4.2).
// Tabs: All · Case studies · Live projects · Playground.
// One unified card style for every project (cover on a padded
// frame — no cropping — + title, meta, colored tags). Bento
// widths tile to full 6-col rows so nothing misaligns.
// ============================================================
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Segmented, SegmentedItem } from '@/components/ui/segmented'
import { Tag } from '@/components/ui/tag'
import { buttonVariants } from '@/components/ui/button'
import { caseStudies, moreWork, type CaseStudy } from '@/data'
import { dur, easeExpo } from '@/lib/motion'

type TabKey = 'all' | 'case-studies' | 'live'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'case-studies', label: 'Case studies' },
  { key: 'live', label: 'Live projects' },
]

/* The flagship case study — rendered large + horizontal to emphasise
   design-systems work (feedback #5). Everything else is a uniform
   col-span-2 vertical card. */
const FEATURED_SLUG = 'inkwell'

/* Decorative colored tags — random-but-stable per label (feedback B#3) */
const TAG_COLORS = ['accent', 'success', 'warning', 'danger'] as const
function tagColor(s: string): (typeof TAG_COLORS)[number] {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return TAG_COLORS[h % TAG_COLORS.length]
}
function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <Tag key={t} variant={tagColor(t)} size="sm">
          {t}
        </Tag>
      ))}
    </div>
  )
}

const cardMotion = {
  layout: true,
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: dur.slow, ease: easeExpo },
}

/* ---------- Unified project card — cohesive: cover flush on top,
   text in the same bordered shell; hover reveals a CTA over the image. */
type CardProps = {
  cover: string
  coverPos?: string
  title: string
  meta: string
  tags: string[]
  cta: string
  to?: string
  href?: string
}
function ProjectCard({ cover, coverPos, title, meta, tags, cta, to, href }: CardProps) {
  const hasDest = Boolean(to || href)
  const body = (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-opt-surface-low">
        <img
          src={cover}
          alt={title}
          loading="lazy"
          style={{ objectPosition: coverPos }}
          className="absolute inset-0 size-full object-cover transition-transform duration-[var(--opt-motion-slower)] [transition-timing-function:var(--opt-easing-expo)] group-hover:scale-[1.04]"
        />
        {hasDest && (
          <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition-opacity duration-[var(--opt-motion-base)] group-hover:opacity-100">
            <span className="m-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
              {cta}
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <h3 className="text-[17px] font-medium leading-snug text-opt-text-heading">{title}</h3>
          <p className="mt-1 text-[13px] text-opt-text-secondary">{meta}</p>
        </div>
        <TagRow tags={tags} />
      </div>
    </>
  )
  const shell =
    'group flex h-full flex-col overflow-hidden rounded-none border border-opt-border-subtle bg-opt-surface-raised transition-colors duration-[var(--opt-motion-base)] hover:border-opt-border-default'
  if (to) return <Link to={to} className={shell}>{body}</Link>
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={shell}>{body}</a>
  return <div className={shell}>{body}</div>
}

function CaseCell({ cs, span }: { cs: CaseStudy; span: string }) {
  return (
    <motion.div {...cardMotion} className={span}>
      <ProjectCard
        cover={cs.cover}
        coverPos={cs.coverPos}
        title={cs.title}
        meta={`${cs.client} · ${cs.year}`}
        tags={cs.tag.split('·').map((t) => t.trim())}
        cta="Read case study"
        to={`/case-study/${cs.slug}`}
      />
    </motion.div>
  )
}

/* Flagship — full-width, image + copy side by side. Controlled height
   (no towering aspect ratio), so it reads as the anchor of the section. */
function FeaturedCaseCell({ cs }: { cs: CaseStudy }) {
  return (
    <motion.div {...cardMotion} className="md:col-span-6">
      <Link
        to={`/case-study/${cs.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-none border border-opt-border-subtle bg-opt-surface-raised transition-colors duration-[var(--opt-motion-base)] hover:border-opt-border-default md:min-h-[360px] md:flex-row"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-opt-surface-low md:aspect-auto md:w-[56%]">
          <img
            src={cs.cover}
            alt={cs.title}
            loading="lazy"
            style={{ objectPosition: cs.coverPos }}
            className="absolute inset-0 size-full object-cover transition-transform duration-[var(--opt-motion-slower)] [transition-timing-function:var(--opt-easing-expo)] group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition-opacity duration-[var(--opt-motion-base)] group-hover:opacity-100">
            <span className="m-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
              Read case study
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-5 p-6 md:p-8">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-opt-text-secondary">
              Featured · Design system
            </span>
            <h3 className="mt-3 font-display text-[clamp(1.4rem,2.4vw,1.75rem)] font-medium leading-[1.1] text-opt-text-heading">
              {cs.title}
            </h3>
            <p className="mt-1 text-[13px] text-opt-text-secondary">{`${cs.client} · ${cs.year}`}</p>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.5] text-opt-text-secondary">{cs.blurb}</p>
          </div>
          <TagRow tags={cs.tag.split('·').map((t) => t.trim())} />
        </div>
      </Link>
    </motion.div>
  )
}

function MoreCell({ item }: { item: (typeof moreWork)[number] }) {
  return (
    <motion.div {...cardMotion} className="md:col-span-2">
      <ProjectCard
        cover={item.cover}
        title={item.title}
        meta={`${item.note} · ${item.year}`}
        tags={[item.tag]}
        cta="View project"
        href={item.url}
      />
    </motion.div>
  )
}

export default function WorkGrid({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState<TabKey>('all')

  const featured = caseStudies.find((cs) => cs.slug === FEATURED_SLUG)
  const rest = caseStudies.filter((cs) => cs.slug !== FEATURED_SLUG)

  const showCases = tab === 'all' || tab === 'case-studies'
  const showMore = tab === 'all' || tab === 'live'

  return (
    <section className={['container-opt py-opt-5xl', className].join(' ')}>
      {/* Header row */}
      <div className="mb-opt-2xl flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(2rem,4.4vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading">
          Selected work
        </h2>
        <Segmented size="lg" value={tab} onValueChange={(v) => v && setTab(v as TabKey)} aria-label="Filter work">
          {TABS.map((t) => (
            <SegmentedItem key={t.key} value={t.key}>
              {t.label}
            </SegmentedItem>
          ))}
        </Segmented>
      </div>

      {/* Bento — flagship spans the full row, the rest tile as col-span-2 */}
      <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <AnimatePresence mode="popLayout">
          {showCases && featured && <FeaturedCaseCell key={featured.slug} cs={featured} />}
          {showCases && rest.map((cs) => <CaseCell key={cs.slug} cs={cs} span="md:col-span-2" />)}
          {showMore && moreWork.map((m) => <MoreCell key={m.title} item={m} />)}
        </AnimatePresence>
      </motion.div>

      {/* See all */}
      <div className="mt-opt-2xl flex justify-center">
        <Link to="/work" className={buttonVariants({ variant: 'ghost', iconPosition: 'trailing' })}>
          See all work
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  )
}
