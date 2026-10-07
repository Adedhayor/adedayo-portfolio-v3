import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Lock } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import { isNdaUnlocked } from '@/lib/nda'
import { caseStudies, moreWork, type CaseStudy, type MoreWorkItem } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

const CASE_STUDY_SENTENCES: Record<string, string> = {
  'inkwell':
    'At RepliHaus, I built a neutral-first design system in Storybook to keep a dense professional editor calm, consistent, and easier to extend.',
  'property-panel':
    'I researched 11 creative tools and rebuilt an overloaded property panel as a clearer, semantic-first inspector.',
  'lithium-staking':
    'For Lithium Digital, I simplified multi-network staking into one clear experience for a platform managing more than $5M in on-chain value.',
  'lighthouse-ds':
    'With design, marketing, and engineering at Vizible Labs, I created a shared system that connected the product and the brand.',
  'zilliqa-migration':
    'I designed the step-by-step journey for moving staked ZIL to the new EVM network and introducing lit-ZIL liquid staking.',
  'tabulerasa':
    'I turned a complex legal workflow into a modular brief builder and collaboration space for solo lawyers and larger firms.',
  'westgate':
    'For Westgate, I designed the end-to-end shopping journey for a nationwide electronics retailer across discovery, cart, and checkout.',
  'apeere-iyi':
    'I translated an architectural studio’s spaces, materials, and point of view into a focused digital portfolio.',
  'building-this-portfolio':
    'I designed and built this portfolio as an editorial system with its own components, interactive experiments, and AI-assisted workflow.',
}

const SMALL_PROJECT_SENTENCES: Record<string, string> = {
  'eMonie':
    'I created responsive, mobile-first fintech pages that helped increase engagement by 40%.',
  'eBank Group':
    'I built a modular web system that made eBank Group’s products easier to understand and its stories easier to scan.',
  'Nukodes':
    'I am shaping a bookkeeping product for web and mobile; the work is still private.',
  'PostPaddy':
    'I supported PostPaddy’s early launch through responsive improvements and QA collaboration, helping it reach 2K+ active users.',
}

const HIDDEN_WORK_PAGE_PROJECTS = new Set(['Nukodes', 'eMonie', 'eBank Group'])

type WorkEntry = {
  key: string
  title: string
  year: string
  meta: string
  sentence: string
  cover: string
  coverPos?: string
  href?: string
  external?: boolean
  locked?: boolean
  comingSoon?: boolean
}

function caseStudyEntry(study: CaseStudy): WorkEntry {
  const locked = Boolean(study.nda) && !isNdaUnlocked()
  return {
    key: study.slug,
    title: study.title,
    year: study.year,
    meta: [study.role, study.tag.replaceAll(' · ', ' / ')].filter(Boolean).join(' · '),
    sentence: CASE_STUDY_SENTENCES[study.slug] ?? study.blurb,
    cover: study.cover,
    coverPos: study.coverPos,
    href: `/case-study/${study.slug}`,
    locked,
    comingSoon: study.comingSoon,
  }
}

function smallProjectEntry(project: MoreWorkItem): WorkEntry {
  return {
    key: project.title,
    title: project.title,
    year: project.year,
    meta: project.tag,
    sentence: SMALL_PROJECT_SENTENCES[project.title] ?? project.note,
    cover: project.cover,
    href: project.url,
    external: Boolean(project.url),
    comingSoon: !project.url,
  }
}

function actionLabel(entry: WorkEntry) {
  if (entry.locked) return 'Private case study'
  if (entry.comingSoon) return entry.href ? 'Case study in progress' : 'Coming soon'
  return entry.external ? 'Visit project' : 'Read case study'
}

function WorkRow({ entry, index }: { entry: WorkEntry; index: number }) {
  const content = (
    <>
      <span className="font-mono text-[11px] tracking-[0.12em] text-opt-text-secondary">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="relative col-start-2 aspect-[16/10] min-w-0 overflow-hidden bg-opt-surface-sunken md:col-start-auto md:aspect-[8/5]">
        <img
          src={entry.cover}
          alt=""
          loading={index > 1 ? 'lazy' : 'eager'}
          style={{ objectPosition: entry.coverPos ?? 'center' }}
          className="size-full object-cover transition-transform duration-[var(--opt-motion-slower)] [transition-timing-function:var(--opt-easing-expo)] motion-safe:group-hover:scale-[1.025]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border border-black/5"
        />
      </div>
      <div className="col-start-2 min-w-0 md:col-start-auto">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="font-display text-[clamp(1.15rem,1.8vw,1.65rem)] leading-[1.12] text-opt-text-heading">
            {entry.title}
          </h2>
          {entry.year && (
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-opt-text-secondary">
              {entry.year}
            </span>
          )}
        </div>
        <p className="mt-3 max-w-[70ch] text-[15px] leading-[1.65] text-opt-text-primary">
          {entry.sentence}
        </p>
        <p className="mt-3 text-[12px] text-opt-text-secondary">{entry.meta}</p>
      </div>
      <span className="col-start-2 flex items-center gap-2 text-[13px] font-semibold text-opt-text-heading md:col-start-auto md:justify-self-end">
        {entry.locked && <Lock size={13} aria-hidden="true" />}
        {actionLabel(entry)}
        {entry.external ? (
          <ArrowUpRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        ) : entry.href ? (
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:translate-x-1"
          />
        ) : null}
      </span>
    </>
  )

  const classes =
    'group grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 gap-y-4 border-b border-opt-border-subtle px-3 py-6 transition-colors duration-[var(--opt-motion-fast)] [transition-timing-function:var(--opt-easing-expo)] hover:bg-opt-surface-raised focus-visible:bg-opt-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-opt-text-heading md:grid-cols-[36px_176px_minmax(0,1fr)_auto] md:items-center md:gap-6 md:px-4 md:py-6'

  if (!entry.href) {
    return <div className={classes}>{content}</div>
  }

  if (entry.external) {
    return <a href={entry.href} target="_blank" rel="noreferrer" className={classes}>{content}</a>
  }

  return <Link to={entry.href} className={classes}>{content}</Link>
}

export default function Work() {
  const entries = [
    ...caseStudies.map(caseStudyEntry),
    ...moreWork.filter((project) => !HIDDEN_WORK_PAGE_PROJECTS.has(project.title)).map(smallProjectEntry),
  ]
    .sort((a, b) => {
      return (Number(b.year) || 0) - (Number(a.year) || 0)
    })

  return (
    <div className="min-h-screen">
      <PageFrame />
      <NavIsland />
      <main className="relative z-[1]">
        <section data-section="Work" className="container-opt pt-40 pb-opt-3xl">
          <motion.div variants={stagger(0.08)} {...revealOnce}>
            <motion.h1
              variants={riseIn}
              className="font-display text-[clamp(3rem,7vw,var(--opt-font-size-h1))] leading-none text-opt-text-heading"
            >
              Work.
            </motion.h1>
            <motion.p
              variants={riseIn}
              className="mt-5 max-w-[52ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary"
            >
              Product work, systems, websites, and case studies from the last five years.
            </motion.p>
          </motion.div>
        </section>

        <section className="container-opt pb-opt-6xl" aria-label="Project index">
          <motion.ol variants={stagger(0.045)} {...revealOnce} className="border-t border-opt-border-default">
            {entries.map((entry, index) => (
              <motion.li key={entry.key} variants={riseIn}>
                <WorkRow entry={entry} index={index} />
              </motion.li>
            ))}
          </motion.ol>
        </section>
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
