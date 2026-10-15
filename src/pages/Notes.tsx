// ============================================================
// Notes — /notes (feedback #9, formerly "Writing"). The essays
// index. Each links to an in-app reader (/notes/:slug) so people
// read here without leaving the site; the Substack link stays for
// subscribing. Content pre-fetched from the Substack RSS feed.
// ============================================================
import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import { ButtonLink } from '@/components/ui/button'
import { writing, substackUrl } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

const ShaderBackdrop = lazy(() => import('@/components/global/ShaderBackdrop'))

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
                Essays and resources — on building, movement, and the human side of the work.
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
          <Link
            to="/blog/tech-511"
            className="guide-teaser group relative mb-10 block min-h-[290px] overflow-hidden border border-opt-border-default bg-[#e99b68] p-4 text-opt-text-heading md:p-6"
          >
            <Suspense
              fallback={
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(120deg,#ffd8a8,#7795ff,#d5f26a)]"
                />
              }
            >
              <ShaderBackdrop
                colors={['#FFD8A8', '#EF835F', '#7896FF', '#D8F46C']}
                speed={0.14}
                distortion={0.58}
                swirl={0.32}
                opacity={0.82}
              />
            </Suspense>
            <div className="relative z-[1] grid min-h-[242px] items-center gap-8 border border-white/25 bg-opt-surface-raised/92 p-8 backdrop-blur-[4px] md:grid-cols-2 md:p-10">
              <div>
                <span className="font-mono text-xs tracking-widest">A RESOURCE BASE / TECH_511</span>
                <p className="mt-5 font-display text-4xl">the guide.</p>
              </div>
              <div>
                <h2 className="font-display text-2xl">Learning to look, think, make, and keep going.</h2>
                <p className="mt-3 max-w-[52ch] text-opt-text-secondary">
                  The resources I’d keep close if I were starting over as a designer. Five sections to explore at your own pace.
                </p>
                <span className="link-underline mt-5 inline-block text-sm font-semibold">Open the guide →</span>
              </div>
            </div>
          </Link>
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
                    aria-hidden="true"
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
