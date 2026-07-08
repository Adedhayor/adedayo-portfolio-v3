// ============================================================
// Loader — GLOBAL. The signature opening sequence (BRIEF §3.1).
// 1. Full-viewport overlay with an ambient ASCII field under it.
// 2. The B mark slides right while the "Adedayo" wordmark
//    reveals sliding left.
// 3. The lockup lifts toward the nav island as the whole overlay
//    scrolls up (100vh → 0) and hands off to the page.
// Plays once per session · skippable on click/keypress ·
// total ≤ 2.0s. Always plays (BRIEF §0.6 — motion is the
// experience).
// ============================================================
import { lazy, Suspense, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { useTheme } from 'next-themes'
import gsap from 'gsap'
import bLogo from '@/assets/b-logo.png'

// Lazy so the WebGL shader code-splits out of the initial bundle.
const ShaderBackdrop = lazy(() => import('@/components/global/ShaderBackdrop'))

const SESSION_KEY = 'opt-loader-seen'

export function loaderWillPlay() {
  try {
    return !sessionStorage.getItem(SESSION_KEY)
  } catch {
    return true
  }
}

export default function Loader({ onDone }: { onDone?: () => void }) {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'
  const [show, setShow] = useState(loaderWillPlay)
  const rootRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      if (!show || !rootRef.current) return
      const q = gsap.utils.selector(rootRef)

      const finish = () => {
        try {
          sessionStorage.setItem(SESSION_KEY, '1')
        } catch {
          /* private mode — fine */
        }
        setShow(false)
        onDone?.()
      }

      const tl = gsap.timeline({ onComplete: finish })
      tlRef.current = tl

      tl
        // B mark lands
        .fromTo(
          q('[data-loader-b]'),
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: 'expo.out' },
        )
        // B slides right · wordmark reveals sliding left
        .to(q('[data-loader-b]'), { x: 12, duration: 0.55, ease: 'expo.inOut' }, '+=0.1')
        .fromTo(
          q('[data-loader-word]'),
          { x: 48, opacity: 0, clipPath: 'inset(0 0 0 100%)' },
          { x: 0, opacity: 1, clipPath: 'inset(0 0 0 0%)', duration: 0.55, ease: 'expo.inOut' },
          '<',
        )
        // Hold the lockup
        .to({}, { duration: 0.3 })
        // Lockup lifts toward the island slot as the overlay scrolls up
        .to(q('[data-loader-lockup]'), {
          y: () => -(window.innerHeight / 2 - 44),
          scale: 0.42,
          opacity: 0,
          duration: 0.6,
          ease: 'expo.inOut',
        })
        .to(
          rootRef.current,
          { yPercent: -100, duration: 0.6, ease: 'expo.inOut' },
          '<+=0.12',
        )

      // Skippable — click or any key jumps to the end
      const skip = () => tlRef.current?.progress(1)
      window.addEventListener('pointerdown', skip, { once: true })
      window.addEventListener('keydown', skip, { once: true })
      return () => {
        window.removeEventListener('pointerdown', skip)
        window.removeEventListener('keydown', skip)
      }
    },
    { scope: rootRef, dependencies: [show] },
  )

  if (!show) return null

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[60] overflow-hidden bg-opt-surface-base"
    >
      {/* Paper mesh-gradient backdrop under the lockup (BRIEF §3.1) */}
      <Suspense fallback={null}>
        <ShaderBackdrop
          colors={dark ? ['#141420', '#2A2450', '#33552B', '#213152'] : ['#FBFBF9', '#E7ECFF', '#C8F169', '#DCE3FF']}
          speed={0.5}
          distortion={0.9}
          swirl={0.6}
          opacity={dark ? 0.85 : 0.7}
        />
      </Suspense>

      {/* The lockup */}
      <div data-loader-lockup className="relative z-10 flex h-full items-center justify-center">
        <div className="flex items-center gap-4">
          <span
            data-loader-word
            className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-none text-opt-text-heading opacity-0"
          >
            Adedayo
          </span>
          <img
            data-loader-b
            src={bLogo}
            alt=""
            className="size-[clamp(3rem,8vw,4.5rem)] rounded-none opacity-0"
          />
        </div>
      </div>
    </div>
  )
}
