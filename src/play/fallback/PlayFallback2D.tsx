// ============================================================
// PlayFallback2D — the former flat /play page, now the world's
// 2D fallback (WebGL failure, reduced-motion first visit, or
// user preference). OWNED BY THE FALLBACK/PERF WORKSTREAM (F)
// for polish. Content still pulls moreWork + labs from data.
// ============================================================
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Boxes } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import { Tag } from '@/components/ui/tag'
import { usePlaySound } from '@/lib/sensory-ui'
import { moreWork, labs } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

/* Side builds from GitHub that haven't shipped yet — mirrors the
   tv-wall's spotifeed / family-tree screens in the 3D world. */
const upcoming: { title: string; blurb: string; tag: string; url?: string }[] = [
  {
    title: 'Spotifeed',
    blurb: 'A Spotify side build, private while it comes together — it lands here when it ships.',
    tag: 'GitHub · in the shop',
  },
  {
    title: 'Family Tree',
    blurb: 'An interactive family tree. The source is up on GitHub while the deployed demo takes shape.',
    tag: 'GitHub · in the shop',
    url: 'https://github.com/Adedhayor/family-tree',
  },
]

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

export default function PlayFallback2D({ onEnterWorld }: { onEnterWorld?: () => void }) {
  // App-wide provider (main.tsx); degrades silently when audio is off.
  const { play: playEnterSound } = usePlaySound({ sound: 'navigation.forward' })
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
          {onEnterWorld && (
            <button
              type="button"
              onClick={() => {
                playEnterSound()
                onEnterWorld()
              }}
              className="mt-8 inline-flex items-center gap-2 border border-opt-border-default px-4 py-2.5 font-opt-mono text-[12px] uppercase tracking-[0.12em] text-opt-text-heading transition-colors hover:bg-opt-surface-low"
            >
              <Boxes size={14} /> Enter the world
            </button>
          )}
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
        <section className="container-opt pb-opt-4xl">
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

        {/* Upcoming — side builds still in the shop */}
        <section className="container-opt pb-opt-6xl">
          <p className="label mb-opt-lg">Upcoming</p>
          <motion.div
            variants={stagger(0.07)}
            {...revealOnce}
            className="grid grid-cols-1 border-t border-opt-border-default sm:grid-cols-2 lg:grid-cols-3"
          >
            {upcoming.map((item) => {
              const body = (
                <>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="inline-flex items-center gap-1.5 text-[16px] font-medium text-opt-text-heading">
                      {item.title}
                      {item.url && (
                        <ArrowUpRight
                          size={13}
                          strokeWidth={2.5}
                          className="text-opt-text-secondary transition-transform duration-[var(--opt-motion-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      )}
                    </h3>
                    <span className="shrink-0 text-[12px] text-opt-text-secondary">Soon</span>
                  </div>
                  <p className="mt-2 text-[14px] leading-[1.55] text-opt-text-secondary">{item.blurb}</p>
                  <span className="mt-3 inline-block text-[12px] uppercase tracking-[0.08em] text-opt-text-placeholder">
                    {item.tag}
                  </span>
                </>
              )
              return (
                <motion.div
                  key={item.title}
                  variants={riseIn}
                  className="border-b border-opt-border-subtle sm:border-r sm:last:border-r-0"
                >
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="group block p-6">
                      {body}
                    </a>
                  ) : (
                    <div className="p-6">{body}</div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </section>
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
