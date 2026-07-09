// ============================================================
// Play — /play (feedback #6, Sean's /fun). Everything that isn't
// a formal case study: side projects, live builds, and small
// experiments made to figure something out. Pulls the real
// moreWork projects + the labs experiments from data.
// ============================================================
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import { Tag } from '@/components/ui/tag'
import { moreWork, labs } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

/* Project card — cover + meta. Links out when a URL exists. */
function ProjectCard({ item }: { item: (typeof moreWork)[number] }) {
  const body = (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-opt-surface-low">
        <img
          src={item.cover}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-[var(--opt-motion-slower)] [transition-timing-function:var(--opt-easing-expo)] group-hover:scale-[1.04]"
        />
        {item.url && (
          <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition-opacity duration-[var(--opt-motion-base)] group-hover:opacity-100">
            <span className="m-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
              View project <ArrowUpRight size={14} strokeWidth={2.5} />
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <h3 className="text-[17px] font-medium leading-snug text-opt-text-heading">{item.title}</h3>
          <p className="mt-1 text-[13px] text-opt-text-secondary">
            {item.note} · {item.year}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Tag variant="accent" size="sm">
            {item.tag}
          </Tag>
        </div>
      </div>
    </>
  )
  const shell =
    'group flex h-full flex-col overflow-hidden rounded-none border border-opt-border-subtle bg-opt-surface-raised transition-colors duration-[var(--opt-motion-base)] hover:border-opt-border-default'
  return item.url ? (
    <a href={item.url} target="_blank" rel="noreferrer" className={shell}>
      {body}
    </a>
  ) : (
    <div className={shell}>{body}</div>
  )
}

export default function Play() {
  return (
    <div className="min-h-screen">
      <PageFrame />
      <NavIsland />
      <main className="relative z-[1]">
        {/* Masthead */}
        <section data-section="Play" className="container-opt pt-40 pb-opt-2xl">
          <Link
            to="/"
            className="link-underline inline-flex items-center gap-1.5 text-[13px] font-medium text-opt-text-secondary"
          >
            <ArrowLeft size={13} /> Home
          </Link>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,var(--opt-font-size-h1))] leading-[1.02] text-opt-text-heading">
            Play.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary">
            Side projects, live builds, and small experiments — the things I made to figure
            something out, learn a tool, or just because they were fun.
          </p>
        </section>

        {/* Projects */}
        <section className="container-opt pb-opt-4xl">
          <p className="label mb-opt-lg">Projects</p>
          <motion.div
            variants={stagger(0.07)}
            {...revealOnce}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {moreWork.map((item) => (
              <motion.div key={item.title} variants={riseIn}>
                <ProjectCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Experiments */}
        <section className="container-opt pb-opt-6xl">
          <p className="label mb-opt-lg">Experiments</p>
          <motion.div
            variants={stagger(0.07)}
            {...revealOnce}
            className="grid grid-cols-1 border-t border-opt-border-default sm:grid-cols-2 lg:grid-cols-3"
          >
            {labs.map((lab) => (
              <motion.div
                key={lab.title}
                variants={riseIn}
                className="border-b border-opt-border-subtle p-6 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[16px] font-medium text-opt-text-heading">{lab.title}</h3>
                  <span className="shrink-0 text-[12px] text-opt-text-secondary">{lab.year}</span>
                </div>
                <p className="mt-2 text-[14px] leading-[1.55] text-opt-text-secondary">{lab.blurb}</p>
                <span className="mt-3 inline-block text-[12px] uppercase tracking-[0.08em] text-opt-text-placeholder">
                  {lab.tag}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
