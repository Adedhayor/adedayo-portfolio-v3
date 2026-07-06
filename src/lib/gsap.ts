// ============================================================
// GSAP + ScrollTrigger helpers for Optimus scroll effects.
// Token-timed, and fully disabled under prefers-reduced-motion.
// Effects are forked in over time; keep them on the same rhythm.
// ============================================================
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Horizontal drift for the giant footer wordmark — it slides as the
 * footer scrolls through the viewport. No-op under reduced motion.
 */
export function useWordmarkDrift(distance = 12) {
  const scope = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = scope.current?.querySelector('[data-wordmark]')
      if (!el) return
      gsap.fromTo(
        el,
        { xPercent: -distance },
        {
          xPercent: distance,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    },
    { scope },
  )
  return scope
}

/**
 * Subtle vertical parallax — element drifts up slightly as you scroll
 * past it. Used for hero display text. No-op under reduced motion.
 */
export function useParallax(selector = '[data-parallax]', y = -40) {
  const scope = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = scope.current?.querySelector(selector)
      if (!el) return
      gsap.to(el, {
        y,
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope },
  )
  return scope
}
