// ============================================================
// CaseStudy — /case-study/:slug (BRIEF §5). One template, all
// content from data.ts. Reads like the notes pages (feedback
// 2026-07-12): a single centered 68ch column — tagline →
// overview (role/client/year/deliverables) → narrative sections
// with figures → outcomes → next case study.
// NDA-fenced studies (cs.nda) ask for a password before the
// content renders; unlock persists for the session.
// ============================================================
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Lock, Hammer, MessageCircle } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { checkNdaPassword, isNdaUnlocked, unlockNda, NDA_HINT, NDA_ERROR } from '@/lib/nda'
import { caseStudies, caseDetails, nextCaseStudy, profile } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

/* Above-the-fold blocks animate on mount, not whileInView — the
   viewport observer can miss elements already in view right after a
   route change, leaving them at opacity 0 (round E: "empty section"
   on /case-study/lighthouse-ds). */
const revealOnMount = { initial: 'hidden' as const, animate: 'show' as const }

/* Beat between a correct password and the content showing — reads as
   the vault opening rather than an instant swap (round G: 4–5s). */
const NDA_REVEAL_DELAY_MS = 4500

/* The nav island's oscillating dot · square · triangle, borrowed as
   the unlock loading animation. */
function OscLoader() {
  return (
    <div className="flex min-h-[200px] items-center justify-center gap-[9px] text-opt-text-secondary" role="status" aria-label="Unlocking">
      <svg className="nav-osc" style={{ animationDelay: '0ms' }} width="8" height="8" viewBox="0 0 7 7">
        <circle cx="3.5" cy="3.5" r="3.5" fill="currentColor" />
      </svg>
      <svg className="nav-osc" style={{ animationDelay: '-600ms' }} width="8" height="8" viewBox="0 0 7 7">
        <rect width="7" height="7" fill="currentColor" />
      </svg>
      <svg className="nav-osc" style={{ animationDelay: '-1200ms' }} width="9" height="8" viewBox="0 0 8 7">
        <polygon points="4,0 8,7 0,7" fill="currentColor" />
      </svg>
    </div>
  )
}

/* ---------- NDA gate — password wall for fenced studies (direct links) ---------- */
function NdaGate({ title, onUnlock }: { title: string; onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (checkNdaPassword(value)) {
      unlockNda()
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <motion.div variants={stagger(0.08)} {...revealOnMount} className="mx-auto max-w-[68ch]">
      <motion.div
        variants={riseIn}
        className="mt-opt-3xl border border-opt-border-subtle bg-opt-surface-raised p-8 md:p-10"
      >
        <span className="grid size-10 place-items-center border border-opt-border-subtle bg-opt-surface-low text-opt-text-secondary">
          <Lock size={16} strokeWidth={2} />
        </span>
        <h2 className="mt-5 font-display text-[22px] font-medium leading-snug text-opt-text-heading">
          Members only, sorry.
        </h2>
        <p className="mt-2 max-w-[46ch] text-[14px] leading-[1.55] text-opt-text-secondary">
          {title} is client work under NDA — the good stuff needs a key.
        </p>
        <form onSubmit={submit} className="mt-opt-xl flex max-w-[420px] items-start gap-opt-sm">
          <div className="flex-1">
            <Input
              type="password"
              placeholder="Password"
              aria-label="Case study password"
              aria-describedby="nda-hint"
              shellClassName="w-full"
              value={value}
              state={error ? 'error' : undefined}
              onChange={(e) => {
                setValue(e.target.value)
                setError(false)
              }}
            />
            {error ? (
              <p className="mt-2 text-[12px] text-opt-accent-danger-fg" role="alert">
                {NDA_ERROR}
              </p>
            ) : (
              <p id="nda-hint" className="mt-2 text-[12px] text-opt-text-secondary">
                {NDA_HINT}{' '}
                <a
                  href={`https://wa.me/${profile.whatsapp}?text=Hey%20Adedayo%20—%20may%20I%20have%20the%20case-study%20password%3F`}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline inline-flex items-center gap-1 font-medium text-opt-text-heading"
                >
                  <MessageCircle size={12} strokeWidth={2.5} /> Text me
                </a>
              </p>
            )}
          </div>
          <Button type="submit" variant="primary">
            Unlock
          </Button>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Coming-soon note — for studies being rewritten ---------- */
function ComingSoon({ title }: { title: string }) {
  return (
    <motion.div variants={stagger(0.08)} {...revealOnMount} className="mx-auto max-w-[68ch]">
      <motion.div
        variants={riseIn}
        className="mt-opt-3xl border border-opt-border-subtle bg-opt-surface-raised p-8 md:p-10"
      >
        <span className="grid size-10 place-items-center border border-opt-border-subtle bg-opt-surface-low text-opt-text-secondary">
          <Hammer size={16} strokeWidth={2} />
        </span>
        <h2 className="mt-5 font-display text-[22px] font-medium leading-snug text-opt-text-heading">
          Still on the workbench.
        </h2>
        <p className="mt-2 max-w-[46ch] text-[14px] leading-[1.55] text-opt-text-secondary">
          {title} is being rewritten so every detail is accurate. Check back soon — or nudge me
          and I’ll tell you the story in person.
        </p>
        <div className="mt-5">
          <Button type="button" variant="secondary" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const cs = caseStudies.find((c) => c.slug === slug)
  const detail = slug ? caseDetails[slug] : undefined
  const [unlocked, setUnlocked] = useState(isNdaUnlocked)
  const [unlocking, setUnlocking] = useState(false)
  if (!cs || !detail) return <Navigate to="/" replace />
  const next = nextCaseStudy(cs.slug)
  const locked = Boolean(cs.nda) && !unlocked
  const comingSoon = Boolean(cs.comingSoon)

  /* Correct password → a short three-dots beat, then the content. */
  const handleUnlock = () => {
    setUnlocking(true)
    window.setTimeout(() => {
      setUnlocking(false)
      setUnlocked(true)
    }, NDA_REVEAL_DELAY_MS)
  }

  return (
    <div className="min-h-screen">
      <PageFrame />
      <NavIsland />

      <main className="relative z-[1]">
        {/* Masthead */}
        <section data-section="Work" className="container-opt pt-40 pb-opt-3xl">
          <motion.div variants={stagger(0.08)} {...revealOnMount} className="mx-auto max-w-[68ch]">
            <motion.div variants={riseIn}>
              <Link
                to="/#work"
                className="link-underline inline-flex items-center gap-1.5 text-[13px] font-medium text-opt-text-secondary"
              >
                <ArrowLeft size={13} /> All work
              </Link>
            </motion.div>
            <motion.p variants={riseIn} className="mt-6 text-[13px] text-opt-text-secondary">
              {cs.tag} · {cs.client} · {cs.year}
            </motion.p>
            <motion.h1
              variants={riseIn}
              className="mt-4 max-w-[22ch] font-display text-[clamp(2.25rem,5.5vw,var(--opt-font-size-h1))] leading-[1.02] text-opt-text-heading"
            >
              {cs.title}
            </motion.h1>
            <motion.p
              variants={riseIn}
              className="mt-6 text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary"
            >
              {detail.tagline}
            </motion.p>
          </motion.div>
        </section>

        {comingSoon ? (
          <section className="container-opt pb-opt-6xl">
            <ComingSoon title={cs.title} />
          </section>
        ) : unlocking ? (
          <section className="container-opt pb-opt-6xl">
            <OscLoader />
          </section>
        ) : locked ? (
          <section className="container-opt pb-opt-6xl">
            <NdaGate title={cs.title} onUnlock={handleUnlock} />
          </section>
        ) : (
          <>
            {/* Cover */}
            <section className="container-opt pb-opt-3xl">
              <motion.img
                variants={riseIn}
                {...revealOnMount}
                src={cs.cover}
                alt={cs.title}
                className="mx-auto w-full max-w-[68ch] rounded-none border border-opt-border-subtle"
              />
            </section>

            {/* Meta strip */}
            <section className="container-opt pb-opt-4xl">
              <div className="mx-auto max-w-[68ch]">
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
                <p className="mt-opt-2xl text-[var(--opt-font-size-lead)] leading-[1.55] text-opt-text-secondary">
                  {detail.overview}
                </p>
              </div>
            </section>

            {/* Narrative sections — understand → design → test → land */}
            {detail.sections.map((s) => (
              <section key={s.heading} className="container-opt pb-opt-4xl">
                <motion.div variants={stagger(0.08)} {...revealOnce} className="mx-auto max-w-[68ch]">
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
                      className="mt-5 text-[16px] leading-[1.6] text-opt-text-secondary"
                    >
                      {p}
                    </motion.p>
                  ))}
                  {s.list && (
                    <motion.ul variants={riseIn} className="mt-5 space-y-2.5">
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
                className="mx-auto grid max-w-[68ch] grid-cols-1 border-y border-opt-border-default sm:grid-cols-3"
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
          </>
        )}

        {/* Next case study */}
        <section className="container-opt pb-opt-5xl">
          <div className="mx-auto max-w-[68ch]">
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
          </div>
        </section>
      </main>

      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
