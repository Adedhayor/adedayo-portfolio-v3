// ============================================================
// FooterWordmark block — v3 footer (BRIEF §3.4).
// Closing CTA + giant "Adedayo" wordmark with a metallic effect
// (played with in the effects studio). Easter egg: hovering the
// wordmark reveals a shuffle control that cycles the effect —
// chrome → gold → holo. Plus links, Lagos time, availability.
// Sits on ink in both themes. Wordmark drifts on scroll.
// ============================================================
import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { ContactWidget } from '@/blocks/_parts'
import LocalTime from '@/components/global/LocalTime'
import { profile } from '@/data'
import { riseIn, revealOnce } from '@/lib/motion'
import { useWordmarkDrift } from '@/lib/gsap'

/* ---- The effects registry — fork new finishes in over time ---- */
const EFFECTS = [
  { id: 'chrome', label: 'Chrome', cls: 'wordmark-metal wordmark-metal--chrome' },
  { id: 'gold', label: 'Gold', cls: 'wordmark-metal wordmark-metal--gold' },
  { id: 'holo', label: 'Holographic', cls: 'wordmark-metal wordmark-metal--holo' },
] as const

const FOOTER_LINKS = [
  { label: 'Email', href: `mailto:${profile.email}` },
  { label: 'Calendly', href: profile.calendly },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'GitHub', href: 'https://github.com/Adedhayor' },
  { label: 'X', href: profile.twitter },
  { label: 'Instagram', href: profile.instagram },
  { label: 'Photography', href: profile.instagramPhotography },
  { label: 'Substack', href: profile.substack },
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
      {/* Closing CTA */}
      <div className="container-opt pt-opt-6xl pb-opt-2xl">
        <motion.div variants={riseIn} {...revealOnce} className="flex flex-col items-start gap-opt-2xl">
          <h2 className="max-w-[20ch] font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.02em]">
            {headline}
          </h2>
          <ContactWidget email={profile.email} calendly={profile.calendly} />
        </motion.div>
      </div>

      {/* Links · time · availability */}
      <div className="container-opt flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-white/10 py-6">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {FOOTER_LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer"
                className="link-underline text-[13px] text-opt-paper/70 transition-colors hover:text-opt-paper"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-5 text-[13px] text-opt-paper/70">
          <LocalTime />
          <span>© {new Date().getFullYear()} Adedayo Babalola</span>
        </div>
      </div>

      {/* Giant wordmark — metallic, effect-cycling easter egg */}
      <div
        className="relative select-none px-4 pb-6"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div
          data-wordmark
          aria-hidden="true"
          className={[
            'whitespace-nowrap text-center font-display font-semibold leading-[0.85] tracking-[-0.03em]',
            'text-[clamp(3.5rem,19vw,19rem)] will-change-transform',
            EFFECTS[effect].cls,
          ].join(' ')}
        >
          {wordmark}
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
    </footer>
  )
}
