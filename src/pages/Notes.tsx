// ============================================================
// Notes — /notes (feedback #9, formerly "Writing"). The essays
// index. Each links to an in-app reader (/notes/:slug) so people
// read here without leaving the site; the Substack link stays for
// subscribing. Content pre-fetched from the Substack RSS feed.
// ============================================================
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import { ButtonLink } from '@/components/ui/button'
import { writing, substackUrl } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

export default function Notes() {
  return (
    <div className="min-h-screen">
      <PageFrame />
      <NavIsland />
      <main className="relative z-[1]">
        <section data-section="Notes" className="container-opt pt-40 pb-opt-2xl">
          <Link
            to="/"
            className="link-underline inline-flex items-center gap-1.5 text-[13px] font-medium text-opt-text-secondary"
          >
            <ArrowLeft size={13} /> Home
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[clamp(2.5rem,6vw,var(--opt-font-size-h1))] leading-[1.02] text-opt-text-heading">
                Notes.
              </h1>
              <p className="mt-4 max-w-[48ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary">
                Personal essays — on building, movement, and the human side of the work.
                Read them right here; subscribe if you’d like new ones in your inbox.
              </p>
            </div>
            <ButtonLink
              href={substackUrl}
              target="_blank"
              rel="noreferrer"
              variant="ghost"
              size="compact"
              trailingIcon={<ArrowUpRight size={14} strokeWidth={2.5} />}
            >
              Subscribe on Substack
            </ButtonLink>
          </div>
        </section>

        <section className="container-opt pb-opt-6xl">
          <motion.ul variants={stagger(0.07)} {...revealOnce} className="border-t border-opt-border-default">
            {writing.map((w) => (
              <motion.li key={w.slug} variants={riseIn}>
                <Link
                  to={`/notes/${w.slug}`}
                  className="group grid grid-cols-1 gap-2 border-b border-opt-border-subtle py-6 md:grid-cols-[132px_1fr_auto] md:items-baseline md:gap-8"
                >
                  <span className="text-[13px] text-opt-text-secondary">
                    {w.date} · {w.readTime}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-[clamp(1.25rem,2.4vw,1.6rem)] leading-[1.2] text-opt-text-heading transition-colors group-hover:text-opt-text-secondary">
                      {w.title}
                    </h2>
                    <p className="mt-2 max-w-[62ch] text-[14px] leading-[1.55] text-opt-text-secondary">{w.excerpt}</p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="hidden shrink-0 text-opt-text-secondary transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:translate-x-1 group-hover:text-opt-text-heading md:block"
                  />
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </section>
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
