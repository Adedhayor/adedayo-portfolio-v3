// ============================================================
// NoteReader — /notes/:slug. The in-app reader (feedback #9): the
// full essay renders here, pre-fetched from the Substack RSS feed,
// so people never have to leave the site to read. The original
// Substack link stays available at the foot for subscribing.
// ============================================================
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, ArrowRight } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import { getNote, writing } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

export default function NoteReader() {
  const { slug } = useParams<{ slug: string }>()
  const note = slug ? getNote(slug) : undefined
  if (!note) return <Navigate to="/notes" replace />
  const { meta, body } = note

  const idx = writing.findIndex((w) => w.slug === meta.slug)
  const next = writing[(idx + 1) % writing.length]

  return (
    <div className="min-h-screen">
      <PageFrame />
      <NavIsland />
      <main className="relative z-[1]">
        {/* Masthead */}
        <article data-section="Notes" className="container-opt pt-40 pb-opt-4xl">
          <motion.div variants={stagger(0.08)} {...revealOnce} className="mx-auto max-w-[68ch]">
            <motion.div variants={riseIn}>
              <Link
                to="/notes"
                className="link-underline inline-flex items-center gap-1.5 text-[13px] font-medium text-opt-text-secondary"
              >
                <ArrowLeft size={13} /> Notes
              </Link>
            </motion.div>
            <motion.p variants={riseIn} className="mt-6 text-[13px] text-opt-text-secondary">
              {meta.date} · {meta.readTime} read
            </motion.p>
            <motion.h1
              variants={riseIn}
              className="mt-3 font-display text-[clamp(2rem,4.6vw,var(--opt-font-size-h1))] leading-[1.06] text-opt-text-heading"
            >
              {meta.title}
            </motion.h1>

            {/* Body — pre-fetched, cleaned Substack HTML */}
            {body ? (
              <motion.div
                variants={riseIn}
                className="prose-notes mt-opt-2xl"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : (
              <motion.p variants={riseIn} className="mt-opt-2xl text-[16px] leading-[1.6] text-opt-text-secondary">
                {meta.excerpt} — the full essay lives on Substack for now.
              </motion.p>
            )}

            {/* Original source */}
            <motion.div variants={riseIn} className="mt-opt-3xl border-t border-opt-border-default pt-6">
              <a
                href={meta.url}
                target="_blank"
                rel="noreferrer"
                className="link-underline inline-flex items-center gap-1.5 text-[14px] font-medium text-opt-text-heading"
              >
                Read the original on Substack <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </motion.div>
        </article>

        {/* Next essay */}
        <section className="container-opt pb-opt-5xl">
          <div className="mx-auto max-w-[68ch]">
            <Link to={`/notes/${next.slug}`} className="group block border border-opt-border-subtle p-8">
              <p className="label">Next essay</p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <h2 className="font-display text-[clamp(1.4rem,3vw,2rem)] leading-[1.1] text-opt-text-heading">
                  {next.title}
                </h2>
                <ArrowRight
                  size={22}
                  className="shrink-0 text-opt-text-secondary transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:translate-x-1"
                />
              </div>
            </Link>
          </div>
        </section>
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
