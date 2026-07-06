// ============================================================
// Motion presets — Framer Motion variants timed to Optimus tokens.
// Keep every animation on this one rhythm (see design.md §6).
// GSAP/custom effects should mirror these curves.
// ============================================================
import type { Variants, Transition } from 'framer-motion'

// Signature ease-out expo, matching --opt-easing-expo.
export const easeExpo: Transition['ease'] = [0.16, 1, 0.3, 1]

// Durations (seconds) — mirror the CSS motion tokens.
export const dur = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  slower: 0.7,
} as const

/** Fade + rise. Default block-entrance. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: easeExpo } },
}

/** Container that staggers its children on enter. */
export const stagger = (gap = 0.06): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
})

/** Standard viewport reveal props for whileInView. */
export const revealOnce = {
  initial: 'hidden' as const,
  whileInView: 'show' as const,
  viewport: { once: true, margin: '-80px' },
}
