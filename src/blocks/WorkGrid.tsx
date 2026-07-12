// ============================================================
// WorkGrid block — the bento work section (BRIEF §4.2).
// Case studies only — live projects & experiments moved to the
// /work page (feedback 2026-07-12 #9). One unified card style —
// Recoleta titles, a mini summary on every card, content-hugging
// height. Spans vary (2/4 · 4/2 · 3/3) so it reads as a true
// bento. NDA-fenced studies navigate to the detail page, which
// asks for the password inline (round F #1 — no modal). Home
// shows a curated FIVE (round F #3); the rest live on /work.
// ============================================================
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Tag } from '@/components/ui/tag'
import { buttonVariants } from '@/components/ui/button'
import { isNdaUnlocked } from '@/lib/nda'
import { caseStudies, type CaseStudy } from '@/data'
import { dur, easeExpo } from '@/lib/motion'

/* The flagship case study — rendered large + horizontal to emphasise
   design-systems work (feedback #5). It's the one passworded study
   shown on the home page. */
const FEATURED_SLUG = 'inkwell'

/* The home selection — five studies, one of them passworded (round
   F #3). Everything else lives on /work. */
const HOME_SLUGS = [FEATURED_SLUG, 'lithium-staking', 'lighthouse-ds', 'zilliqa-migration', 'tabulerasa']

/* Bento rhythm for the non-featured cards — 6-col grid, rows of
   2+4 / 4+2 (round E #5/#6: small card left, large right on the
   first row). Anything past the pattern goes full-width. */
const BENTO_SPANS = [
  'md:col-span-2',
  'md:col-span-4',
  'md:col-span-4',
  'md:col-span-2',
]
const bentoSpan = (i: number) => BENTO_SPANS[i] ?? 'md:col-span-6'

/* Decorative colored tags — random-but-stable per label (feedback B#3) */
const TAG_COLORS = ['accent', 'success', 'warning', 'danger'] as const
function tagColor(s: string): (typeof TAG_COLORS)[number] {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return TAG_COLORS[h % TAG_COLORS.length]
}
function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
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

/* ---------- Unified project card — cover flush on top, text in the
   same bordered shell; hover reveals a CTA over the image. Height
   hugs its content (round E #4). */
type CardProps = {
  cover: string
  coverPos?: string
  title: string
  meta: string
  blurb?: string
  tags: string[]
  cta: string
  to?: string
  href?: string
  locked?: boolean
  /** Stretch to the grid row so every card in a uniform grid is the
      same height, tags pinned to the bottom (round G — /work). */
  fill?: boolean
  onClick?: (e: React.MouseEvent) => void
}
export function ProjectCard({ cover, coverPos, title, meta, blurb, tags, cta, to, href, locked, fill, onClick }: CardProps) {
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
              {locked && <Lock size={12} strokeWidth={2.5} />}
              {cta}
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </span>
          </div>
        )}
      </div>
      <div className={fill ? 'flex flex-1 flex-col p-5' : 'p-5'}>
        <h3 className="font-display text-[19px] font-medium leading-snug text-opt-text-heading">{title}</h3>
        <p className="mt-1 text-[13px] text-opt-text-secondary">{meta}</p>
        {blurb && <p className="mt-2.5 text-[13px] leading-[1.5] text-opt-text-secondary">{blurb}</p>}
        <div className={fill ? 'mt-auto' : undefined}>
          <TagRow tags={tags} />
        </div>
      </div>
    </>
  )
  const shell = [
    'group flex flex-col overflow-hidden rounded-none border border-opt-border-subtle bg-opt-surface-raised transition-colors duration-[var(--opt-motion-base)] hover:border-opt-border-default',
    fill ? 'h-full' : '',
  ].join(' ')
  if (to)
    return (
      <Link to={to} onClick={onClick} className={shell}>
        {body}
      </Link>
    )
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={shell}>
        {body}
      </a>
    )
  return <div className={shell}>{body}</div>
}

function CaseCell({ cs, span }: { cs: CaseStudy; span: string }) {
  const locked = Boolean(cs.nda) && !isNdaUnlocked()
  return (
    <motion.div {...cardMotion} className={span}>
      <ProjectCard
        cover={cs.cover}
        coverPos={cs.coverPos}
        title={cs.title}
        meta={`${cs.client} · ${cs.year}`}
        blurb={cs.blurb}
        tags={cs.tag.split('·').map((t) => t.trim())}
        cta="Read case study"
        to={`/case-study/${cs.slug}`}
        locked={locked}
      />
    </motion.div>
  )
}

/* Flagship — full-width, image + copy side by side. */
function FeaturedCaseCell({ cs }: { cs: CaseStudy }) {
  const locked = Boolean(cs.nda) && !isNdaUnlocked()
  return (
    <motion.div {...cardMotion} className="md:col-span-6">
      <Link
        to={`/case-study/${cs.slug}`}
        className="group flex flex-col overflow-hidden rounded-none border border-opt-border-subtle bg-opt-surface-raised transition-colors duration-[var(--opt-motion-base)] hover:border-opt-border-default md:min-h-[360px] md:flex-row"
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
              {locked && <Lock size={12} strokeWidth={2.5} />}
              Read case study
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-5 p-6 md:p-8">
          <div>
            <h3 className="font-display text-[clamp(1.4rem,2.4vw,1.75rem)] font-medium leading-[1.1] text-opt-text-heading">
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

export default function WorkGrid({ className = '' }: { className?: string }) {
  const featured = caseStudies.find((cs) => cs.slug === FEATURED_SLUG)
  const rest = HOME_SLUGS.slice(1)
    .map((slug) => caseStudies.find((cs) => cs.slug === slug))
    .filter((cs): cs is CaseStudy => Boolean(cs))

  return (
    <section className={['container-opt py-opt-5xl', className].join(' ')}>
      {/* Header row */}
      <div className="mb-opt-2xl flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(2rem,4.4vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading">
          Selected work
        </h2>
      </div>

      {/* Bento — flagship spans the full row, the rest alternate widths */}
      <motion.div layout className="grid grid-cols-1 items-start gap-4 md:grid-cols-6">
        <AnimatePresence mode="popLayout">
          {featured && <FeaturedCaseCell key={featured.slug} cs={featured} />}
          {rest.map((cs, i) => (
            <CaseCell key={cs.slug} cs={cs} span={bentoSpan(i)} />
          ))}
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
