// ============================================================
// FooterWordmark block — v3 footer (BRIEF §3.4).
// Closing CTA + giant "Adedayo" wordmark. Default finish is the
// ChromaticMetal WebGL shader (liquid chrome + RGB split —
// feedback 2026-07-12, ref petermarc.com); the hover easter egg
// still shuffles through the CSS finishes. Below: links, then a
// centered © / Lagos / time strip and the case-study credit that
// reveals "Built with Claude Code" on hover.
// Sits on ink in both themes. Wordmark drifts on scroll.
// ============================================================
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Camera, RotateCcw, Rss } from 'lucide-react'
import { siDribbble, siGithub } from 'simple-icons'
import '@/footer.css'
import { ContactWidget } from '@/blocks/_parts'
import LocalTime from '@/components/global/LocalTime'
import { ShaderText, FINISHES } from '@/components/global/shader-text'
import { profile } from '@/data'
import { showWordmarkShuffle } from '@/lib/release'
import { riseIn, revealOnce } from '@/lib/motion'
import { useWordmarkDrift } from '@/lib/gsap'
import { usePlaySound } from '@/lib/sensory-ui'

function Github() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg>
}

function Dribbble() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={siDribbble.path} /></svg>
}

function Linkedin() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 9h4v12H3zm6 0h4v1.7c.8-1.3 2-2 3.7-2 3.3 0 4.3 2.1 4.3 5.4V21h-4v-6.1c0-1.6-.3-2.8-1.9-2.8-1.7 0-2.1 1.3-2.1 2.8V21H9z" /></svg>
}

function XIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 3h4l12 18h-4zM20 3 4 21" /></svg>
}

/* The wordmark finishes live in the shader-text registry — six
   liquid-metal palettes + Aurora (a distinct FoldGradient shader
   ported from Effects Studio). The easter egg cycles them in order. */

/* Shared responsive type for every wordmark finish */
const WORDMARK_TYPE =
  'whitespace-nowrap text-center font-display font-semibold leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,19vw,19rem)]'

const FOOTER_LINKS = [
  { label: 'LinkedIn', href: profile.linkedin, icon: Linkedin },
  { label: 'GitHub', href: 'https://github.com/Adedhayor', icon: Github },
  { label: 'Dribbble', href: profile.dribbble, icon: Dribbble },
  { label: 'X', href: profile.twitter, icon: XIcon },
  { label: 'Photography', href: profile.instagramPhotography, icon: Camera },
  { label: 'Notes', href: '/notes', icon: Rss },
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
  // Easter-egg reward: a synthesized chime (from the ported Effects
  // Studio sensory-ui packs) on every finish-shuffle. Respects mute,
  // volume, and prefers-reduced-motion via the provider.
  const { play: playShuffle } = usePlaySound({ sound: 'notification.success' })

  const shuffleEffect = () => {
    playShuffle()
    setEffect((current) => {
      if (FINISHES.length < 2) return current
      let next = current
      while (next === current) next = Math.floor(Math.random() * FINISHES.length)
      return next
    })
  }

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
          <ShaderText text={wordmark} finish={FINISHES[effect]} className={WORDMARK_TYPE} />
        </div>

        {/* Reset/shuffle — revealed on hover (always visible on touch).
            Live everywhere since Effects Studio shipped (release.ts). */}
        {showWordmarkShuffle && (
          <button
            type="button"
            aria-label={`Change wordmark effect. Current effect: ${FINISHES[effect].label}`}
            title="Change wordmark effect"
            onClick={shuffleEffect}
            className={[
              'absolute bottom-4 left-4 z-10 grid size-10 cursor-pointer place-items-center border border-white/20 bg-black/30 text-opt-paper/80 backdrop-blur-sm',
              'transition-[transform,opacity,color,border-color,background-color] duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)]',
              'hover:border-white/40 hover:bg-black/50 hover:text-opt-paper active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-paper/60',
              hovering ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0 max-[767px]:translate-y-0 max-[767px]:opacity-100',
            ].join(' ')}
          >
            <RotateCcw size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Links · © · credit — BELOW the wordmark (round E #8), lifted
          above the drifting wordmark's transform layer. */}
      <div className="container-opt relative z-10 border-t border-white/10 py-6">
        <ul className="flex flex-wrap justify-center gap-2">
          {FOOTER_LINKS.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              {href.startsWith('/') ? (
                <Link to={href} aria-label={label} title={label} className="social-icon"><Icon size={20} aria-hidden="true" /></Link>
              ) : (
                <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className="social-icon"><Icon size={20} aria-hidden="true" /></a>
              )}
            </li>
          ))}
        </ul>

        {/* © / live clock — the petermarc-style strip */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[13px] text-opt-paper/70">
          <span>© {new Date().getFullYear()}</span>
          <span aria-hidden="true">/</span>
          <LocalTime />
        </div>

        {/* Build credit — the case-study link reveals the build note on
            hover or keyboard focus. "Designed by Adedayo" stays plain. */}
        <p className="mt-2 text-center text-[13px] text-opt-paper/70">
          Designed by Adedayo ·{' '}
          <Link
            to="/case-study/building-this-portfolio"
            className="group relative inline-block align-baseline transition-colors duration-150 hover:text-opt-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            aria-label="Read the case study for this portfolio. Built with Claude Code."
          >
            <span className="underline decoration-opt-paper/40 underline-offset-4 transition-opacity duration-[var(--opt-motion-base)] group-hover:opacity-0 group-focus-visible:opacity-0">
              Read the case study
            </span>
            <span className="absolute inset-y-0 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap font-medium text-opt-paper underline decoration-opt-paper/40 underline-offset-4 opacity-0 transition-opacity duration-[var(--opt-motion-base)] group-hover:opacity-100 group-focus-visible:opacity-100">
              Built with Claude Code <ArrowUpRight size={13} strokeWidth={2.5} aria-hidden="true" />
            </span>
          </Link>
        </p>
      </div>
    </footer>
  )
}
