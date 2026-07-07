// ============================================================
// Scatter-to-bento — the signature scroll choreography
// (BRIEF §4.1). Floating hero images scrub along the scroll
// into their matching work-grid cells, then hand off to the
// cell's real cover. Desktop (md+) only — on mobile the grid
// simply owns its covers.
// Always plays (BRIEF §0.6 — motion is the experience).
// ============================================================
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Document position via the offsetParent chain — transform-proof. */
function docPos(el: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y }
}

/**
 * Attach to a wrapper that contains BOTH the hero ([data-hero],
 * [data-scatter] images) and the work grid ([data-bento-target],
 * [data-bento-cover] keyed by slug).
 */
export function useScatterToBento<T extends HTMLElement = HTMLDivElement>() {
  const scope = useRef<T>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const hero = root.querySelector<HTMLElement>('[data-hero]')
      if (!hero) return

      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        const imgs = gsap.utils.toArray<HTMLElement>('[data-scatter]', root)

        for (const img of imgs) {
          // Initial tilt comes from data-rotate (GSAP owns the transform)
          gsap.set(img, {
            rotation: parseFloat(img.dataset.rotate ?? '0'),
            transformOrigin: 'top left',
          })

          const slug = img.dataset.scatter
          const target = slug
            ? root.querySelector<HTMLElement>(`[data-bento-target="${slug}"]`)
            : null

          if (!target) {
            // Decorative — drift up and dissolve as the hero scrolls out
            gsap.to(img, {
              yPercent: -60,
              opacity: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: hero,
                start: 'center center',
                end: 'bottom top',
                scrub: 0.4,
              },
            })
            continue
          }

          const cover = root.querySelector<HTMLElement>(`[data-bento-cover="${slug}"]`)
          if (cover) gsap.set(cover, { opacity: 0 })

          // The scrub — corner-to-corner translate + non-uniform scale
          gsap.to(img, {
            x: () => docPos(target).x - docPos(img).x,
            y: () => docPos(target).y - docPos(img).y,
            scaleX: () => target.offsetWidth / img.offsetWidth,
            scaleY: () => target.offsetHeight / img.offsetHeight,
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'center center',
              endTrigger: target,
              end: 'center 60%',
              scrub: 0.35,
              invalidateOnRefresh: true,
            },
          })

          // Handoff — floating image ⇄ the cell's real cover
          ScrollTrigger.create({
            trigger: target,
            start: 'center 62%',
            onEnter: () => {
              gsap.to(img, { opacity: 0, duration: 0.2, overwrite: 'auto' })
              if (cover) gsap.to(cover, { opacity: 1, duration: 0.25, overwrite: 'auto' })
            },
            onLeaveBack: () => {
              gsap.to(img, { opacity: 1, duration: 0.2, overwrite: 'auto' })
              if (cover) gsap.to(cover, { opacity: 0, duration: 0.2, overwrite: 'auto' })
            },
          })
        }
      })

      return () => mm.revert()
    },
    { scope },
  )

  return scope
}
