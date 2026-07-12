// ============================================================
// FooterWordmark block — v3 footer (BRIEF §3.4).
// Closing CTA + giant "Adedayo" wordmark. Default finish is the
// ChromaticMetal WebGL shader (liquid chrome + RGB split —
// feedback 2026-07-12, ref petermarc.com); the hover easter egg
// still shuffles through the CSS finishes. Below: links, then a
// centered © / Lagos / time strip and the build credit that
// flips to "Read the case study" on hover.
// Sits on ink in both themes. Wordmark drifts on scroll.
// ============================================================
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import { ContactWidget } from '@/blocks/_parts'
import LocalTime from '@/components/global/LocalTime'
import ChromaticMetal, { type MetalPalette } from '@/components/global/ChromaticMetal'
import { profile } from '@/data'
import { riseIn, revealOnce } from '@/lib/motion'
import { useWordmarkDrift } from '@/lib/gsap'

/* ---- The effects registry — every finish runs through the shader
   now (round E #7); the CSS sweeps remain as its no-WebGL fallback.
   TODO(owner): port these palettes into the effects studio. ---- */
const EFFECTS: { id: string; label: string; palette: MetalPalette }[] = [
  { id: 'chromatic-chrome', label: 'Chromatic chrome', palette: 'chrome' },
  { id: 'chromatic-gold', label: 'Chromatic gold', palette: 'gold' },
  { id: 'chromatic-holo', label: 'Chromatic holo', palette: 'holo' },
]

/* Shared responsive type for every wordmark finish */
const WORDMARK_TYPE =
  'whitespace-nowrap text-center font-display font-semibold leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,19vw,19rem)]'

const FOOTER_LINKS = [
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'GitHub', href: 'https://github.com/Adedhayor' },
  { label: 'X', href: profile.twitter },
  { label: 'Photography', href: profile.instagramPhotography },
  { label: 'Notes', href: '/notes' },
]

type Props = {
  headline?: string
  wordmark?: string
  className?: string
}

export default function FooterWordmark({
  headline = 'Have something complex that needs to feel simple? Let’s talk.',
  wordmark = 'Adedayo',
  className = '',
}: Props) {
  const scope = useWordmarkDrift(8)
  const [effect, setEffect] = useState(0)
  const [hovering, setHovering] = useState(false)

  return (
    <footer ref={scope} className={['relative overflow-hidden bg-opt-ink text-opt-paper', className].join(' ')}>
      {/* Closing CTA — centered, mirroring the hero (round E #9) */}
      <div className="container-opt pt-opt-6xl pb-opt-2xl">
        <motion.div variants={riseIn} {...revealOnce} className="flex flex-col items-center gap-opt-2xl text-center">
          <h2 className="max-w-[20ch] text-balance font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.02em]">
            {headline}
          </h2>
          <ContactWidget email={profile.email} calendly={profile.calendly} />
        </motion.div>
      </div>

      {/* Giant wordmark — chromatic shader, effect-cycling easter egg */}
      <div
        className="relative select-none px-4 pb-2"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div data-wordmark aria-hidden="true" className="will-change-transform">
          <ChromaticMetal text={wordmark} palette={EFFECTS[effect].palette} className={WORDMARK_TYPE} />
        </div>

        {/* Reset/shuffle — revealed on hover (always visible on touch) */}
        <button
          aria-label={`Change wordmark effect (current: ${EFFECTS[effect].label})`}
          onClick={() => setEffect((e) => (e + 1) % EFFECTS.length)}
          className={[
            'absolute bottom-4 left-4 z-10 grid size-10 cursor-pointer place-items-center rounded-none',
            'border border-white/15 bg-white/5 text-opt-paper/70 backdrop-blur-sm',
            'transition-all duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)]',
            'hover:text-opt-paper hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-paper/60',
            hovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 max-[767px]:opacity-100 max-[767px]:translate-y-0',
          ].join(' ')}
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Links · © · credit — BELOW the wordmark (round E #8), lifted
          above the drifting wordmark's transform layer. */}
      <div className="container-opt relative z-10 border-t border-white/10 py-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {FOOTER_LINKS.map((l) => {
            const internal = l.href.startsWith('/')
            const cls = 'link-underline text-[13px] text-opt-paper/70 transition-colors hover:text-opt-paper'
            return (
              <li key={l.label}>
                {internal ? (
                  <Link to={l.href} className={cls}>
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    target={l.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noreferrer"
                    className={cls}
                  >
                    {l.label}
                  </a>
                )}
              </li>
            )
          })}
        </ul>

        {/* © / live clock — the petermarc-style strip */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[13px] text-opt-paper/70">
          <span>© {new Date().getFullYear()}</span>
          <span aria-hidden="true">/</span>
          <LocalTime />
        </div>

        {/* Build credit — only the Claude Code half is the link: it's
            underlined and flips to the case-study CTA on hover (round
            F #8). "Designed by Adedayo" stays plain. */}
        <p className="mt-2 text-center text-[13px] text-opt-paper/70">
          Designed by Adedayo ·{' '}
          <Link
            to="/case-study/building-this-portfolio"
            className="group relative inline-block align-baseline transition-colors hover:text-opt-paper"
          >
            <span className="underline decoration-opt-paper/40 underline-offset-4 transition-opacity duration-[var(--opt-motion-base)] group-hover:opacity-0">
              Built with Claude Code
            </span>
            <span className="absolute inset-y-0 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap font-medium text-opt-paper underline decoration-opt-paper/40 underline-offset-4 opacity-0 transition-opacity duration-[var(--opt-motion-base)] group-hover:opacity-100">
              Read the case study <ArrowUpRight size={13} strokeWidth={2.5} />
            </span>
          </Link>
        </p>
      </div>
    </footer>
  )
}
