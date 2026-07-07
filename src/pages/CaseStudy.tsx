// ============================================================
// CaseStudy — /case-study/:slug (BRIEF §5). One template, four
// instances, all content from data.ts. Structure: tagline →
// overview (role/client/year/deliverables) → narrative sections
// with figures → outcomes → next case study.
// ============================================================
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import { caseStudies, caseDetails, nextCaseStudy } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const cs = caseStudies.find((c) => c.slug === slug)
  const detail = slug ? caseDetails[slug] : undefined
  if (!cs || !detail) return <Navigate to="/" replace />
  const next = nextCaseStudy(cs.slug)

  return (
    <div className="min-h-screen">
      <PageFrame />
      <NavIsland />

      <main className="relative z-[1]">
        {/* Masthead */}
        <section data-section="Work" className="container-opt pt-40 pb-opt-3xl">
          <motion.div variants={stagger(0.08)} {...revealOnce}>
            <motion.div variants={riseIn}>
              <Link
                to="/#work"
                className="link-underline inline-flex items-center gap-1.5 text-[13px] font-medium text-opt-text-secondary"
              >
                <ArrowLeft size={13} /> All work
              </Link>
            </motion.div>
            <motion.p variants={riseIn} className="eyebrow mt-6">
              {cs.index} · {cs.tag} · {cs.client} · {cs.year}
            </motion.p>
            <motion.h1
              variants={riseIn}
              className="mt-4 max-w-[22ch] font-display text-[clamp(2.25rem,5.5vw,var(--opt-font-size-h1))] leading-[1.02] text-opt-text-heading"
            >
              {cs.title}
            </motion.h1>
            <motion.p
              variants={riseIn}
              className="mt-6 max-w-[58ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary"
            >
              {detail.tagline}
            </motion.p>
          </motion.div>
        </section>

        {/* Cover */}
        <section className="container-opt pb-opt-3xl">
          <motion.img
            variants={riseIn}
            {...revealOnce}
            src={cs.cover}
            alt={cs.title}
            className="w-full rounded-none border border-opt-border-subtle"
          />
        </section>

        {/* Meta strip */}
        <section className="container-opt pb-opt-4xl">
          <div className="grid grid-cols-2 gap-6 border-y border-opt-border-default py-6 md:grid-cols-4">
            <div>
              <p className="label mb-1.5">Role</p>
              <p className="text-[14px] text-opt-text-heading">{cs.role}</p>
            </div>
            <div>
              <p className="label mb-1.5">Client</p>
              <p className="text-[14px] text-opt-text-heading">{cs.client}</p>
            </div>
            <div>
              <p className="label mb-1.5">Year</p>
              <p className="text-[14px] text-opt-text-heading">{cs.year}</p>
            </div>
            <div>
              <p className="label mb-1.5">Deliverables</p>
              <p className="text-[14px] text-opt-text-heading">{detail.deliverables.join(' · ')}</p>
            </div>
          </div>
          <p className="mt-opt-2xl max-w-[62ch] text-[var(--opt-font-size-lead)] leading-[1.55] text-opt-text-secondary">
            {detail.overview}
          </p>
        </section>

        {/* Narrative sections — understand → design → test → land */}
        {detail.sections.map((s) => (
          <section key={s.heading} className="container-opt pb-opt-4xl">
            <motion.div variants={stagger(0.08)} {...revealOnce}>
              <motion.h2
                variants={riseIn}
                className="max-w-[24ch] font-display text-[clamp(1.6rem,3vw,var(--opt-font-size-h3))] leading-[1.12] text-opt-text-heading"
              >
                {s.heading}
              </motion.h2>
              {s.body.map((p) => (
                <motion.p
                  key={p.slice(0, 24)}
                  variants={riseIn}
                  className="mt-5 max-w-[62ch] text-[16px] leading-[1.6] text-opt-text-secondary"
                >
                  {p}
                </motion.p>
              ))}
              {s.list && (
                <motion.ul variants={riseIn} className="mt-5 max-w-[62ch] space-y-2.5">
                  {s.list.map((item) => (
                    <li key={item.slice(0, 24)} className="flex gap-3 text-[15px] leading-[1.55] text-opt-text-secondary">
                      <span className="mt-[9px] size-1.5 shrink-0 bg-opt-text-placeholder" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </motion.ul>
              )}
              {s.figure && (
                <motion.figure variants={riseIn} className="mt-opt-2xl">
                  <img
                    src={s.figure.src}
                    alt={s.figure.caption}
                    loading="lazy"
                    className="w-full rounded-none border border-opt-border-subtle"
                  />
                  <figcaption className="label mt-3">{s.figure.caption}</figcaption>
                </motion.figure>
              )}
            </motion.div>
          </section>
        ))}

        {/* Outcomes */}
        <section className="container-opt pb-opt-5xl">
          <motion.div
            variants={stagger(0.08)}
            {...revealOnce}
            className="grid grid-cols-1 border-y border-opt-border-default sm:grid-cols-3"
          >
            {detail.outcomes.map((o) => (
              <motion.div
                key={o.label}
                variants={riseIn}
                className="border-b border-opt-border-subtle p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <p className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none text-opt-text-heading">
                  {o.value}
                </p>
                <p className="label mt-2">{o.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Next case study */}
        <section className="container-opt pb-opt-5xl">
          <Link to={`/case-study/${next.slug}`} className="group block border border-opt-border-subtle p-8">
            <p className="label">Next case study</p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] text-opt-text-heading">
                {next.title}
              </h2>
              <ArrowRight
                size={22}
                className="shrink-0 text-opt-text-secondary transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:translate-x-1"
              />
            </div>
          </Link>
        </section>
      </main>

      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
