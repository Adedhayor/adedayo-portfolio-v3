// ============================================================
// Lightbox — the /play viewer. Evolved from ZonePanel: same
// focus trap, blur scrim, lime tick and spring-in, sized up into
// a media viewer.
//
// Two kinds of entry share the shell:
//  • SCREEN  — `activePanelId === 'lightbox:<screenId>'`. The
//    screen is found across every place's interior.screens; its
//    sibling set (the same room's screens) drives ←/→ prev-next,
//    wrapping. Its own muted looping <video> plays here (DOM side,
//    independent of the 3D videoPool); poster/rive fall back.
//  • PANEL   — a legacy experiment id present in `panels[id]`
//    (the lab stations). Text-only, single item, no arrows.
//
// Sound: opening already played `overlay.open` (the dispatcher),
// so we don't replay it. Steps play `navigation.tab`; × / scrim
// play `overlay.close`. Escape is owned by PlayHud's single global
// handler (it closes via the same overlay.close + closePanel), so
// we do NOT bind Escape here — avoids a double sting.
// ============================================================
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSensoryUI } from '@/lib/sensory-ui'
import { easeExpo } from '@/lib/motion'
import { usePlay } from '../PlayContext'
import { places, panels, type ScreenContent, type PlayPanel, type HotspotAction } from '../data/playground'
import { lightboxPanelId, useHotspotAction } from '../useHotspotAction'
import { screenMeta } from './screenMeta'

const LIGHTBOX_PREFIX = 'lightbox:'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  )
}

// ------------------------------------------------------------
// Entry resolution — pure, so the arrow-key effect can recompute
// the sibling set from the id without stale closures.
// ------------------------------------------------------------
type ScreenEntry = { kind: 'screen'; screen: ScreenContent; siblings: ScreenContent[]; index: number }
type PanelEntry = { kind: 'panel'; id: string; panel: PlayPanel }
type Entry = ScreenEntry | PanelEntry

function resolveEntry(activePanelId: string | null): Entry | null {
  if (!activePanelId) return null
  if (activePanelId.startsWith(LIGHTBOX_PREFIX)) {
    const screenId = activePanelId.slice(LIGHTBOX_PREFIX.length)
    for (const place of places) {
      const siblings = place.interior.screens
      const index = siblings.findIndex((s) => s.id === screenId)
      if (index !== -1) return { kind: 'screen', screen: siblings[index], siblings, index }
    }
    return null
  }
  const panel = panels[activePanelId]
  return panel ? { kind: 'panel', id: activePanelId, panel } : null
}

function ctaFor(action: HotspotAction): { label: string; icon: 'up' | 'right' } | null {
  if (action.kind === 'external') return { label: 'View project', icon: 'up' }
  if (action.kind === 'route') return { label: 'Read case study', icon: 'right' }
  return null
}

// ------------------------------------------------------------
// Media pane — the screen's own muted looping video (DOM side),
// poster fallback, rive placeholder note, else a title card.
// ------------------------------------------------------------
function MediaPane({ screen }: { screen: ScreenContent }) {
  const [aw, ah] = screen.aspect ?? [16, 10]
  const frame =
    'relative w-[min(70vw,820px)] max-w-[820px] max-h-[68vh] overflow-hidden border border-opt-border-default bg-opt-surface-low'
  const style = { aspectRatio: `${aw} / ${ah}` }

  if (screen.video) {
    return (
      <div className={frame} style={style}>
        <video
          key={screen.video}
          className="h-full w-full object-cover"
          src={screen.video}
          poster={screen.poster}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
        />
      </div>
    )
  }
  if (screen.poster) {
    return (
      <div className={frame} style={style}>
        <img className="h-full w-full object-cover" src={screen.poster} alt={screen.title} />
      </div>
    )
  }
  // Rive / no-media → a mono note (SVG posters would be fine here too, but
  // these entries carry none). Interactive pieces live on the wall in 3D.
  const note = screen.rive ? 'Interactive piece — view it on the wall' : 'Preview coming soon'
  return (
    <div className={`${frame} grid place-items-center`} style={style}>
      <p className="px-6 text-center font-opt-mono text-[11px] uppercase tracking-[0.16em] text-opt-text-secondary">
        {note}
      </p>
    </div>
  )
}

export default function Lightbox() {
  const { activePanelId, openPanel, closePanel, reducedMotion } = usePlay()
  const { playSound } = useSensoryUI()
  const runAction = useHotspotAction()

  const entry = resolveEntry(activePanelId)
  const isOpen = entry !== null
  const canStep = entry?.kind === 'screen' && entry.siblings.length > 1

  const dialogRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  const swipeStart = useRef<number | null>(null)

  // Focus trap — keyed on OPEN (not the active id), so stepping through the
  // sibling set never re-captures the opener or restores focus mid-browse.
  // The opener is caught once on open; focus is restored to it on close.
  useEffect(() => {
    if (!isOpen) return
    restoreRef.current = (document.activeElement as HTMLElement | null) ?? null

    const raf = requestAnimationFrame(() => {
      // Neutral initial focus on the dialog itself — no control reads as
      // pre-pressed; Tab then steps into the chrome.
      dialogRef.current?.focus()
    })

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const root = dialogRef.current
      if (!root) return
      const focusables = getFocusable(root)
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (focusables.length === 0 || !root.contains(active)) {
        e.preventDefault()
        ;(first ?? root).focus()
        return
      }
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey, true)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey, true)
      restoreRef.current?.focus?.()
    }
  }, [isOpen])

  // ←/→ prev-next across the sibling set — resolved fresh from the id so the
  // closure is never stale. Bound only while a multi-item screen set is open.
  useEffect(() => {
    if (!activePanelId) return
    const e = resolveEntry(activePanelId)
    if (!e || e.kind !== 'screen' || e.siblings.length <= 1) return
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return
      ev.preventDefault()
      const dir = ev.key === 'ArrowLeft' ? -1 : 1
      const next = e.siblings[(e.index + dir + e.siblings.length) % e.siblings.length]
      void playSound('navigation.tab')
      openPanel(lightboxPanelId(next.id))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activePanelId, openPanel, playSound])

  if (!entry) {
    // Keep AnimatePresence mounted so the exit transition can play.
    return <AnimatePresence />
  }

  const step = (dir: -1 | 1) => {
    if (entry.kind !== 'screen' || entry.siblings.length <= 1) return
    const next = entry.siblings[(entry.index + dir + entry.siblings.length) % entry.siblings.length]
    void playSound('navigation.tab')
    openPanel(lightboxPanelId(next.id))
  }

  const close = () => {
    void playSound('overlay.close')
    closePanel()
  }

  // Swipe on touch — ~40px horizontal threshold; left → next, right → prev.
  const onPointerDown = (e: React.PointerEvent) => {
    swipeStart.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeStart.current == null) return
    const dx = e.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(dx) < 40) return
    step(dx < 0 ? 1 : -1)
  }

  // Per-entry caption + heading + optional CTA.
  const heading = entry.kind === 'screen' ? entry.screen.title : entry.panel.heading
  const meta = entry.kind === 'screen' ? screenMeta(entry.screen.title) : { kicker: entry.panel.kicker, blurb: entry.panel.body }
  const kicker = meta.kicker
  const blurb = meta.blurb
  const screenCta = entry.kind === 'screen' && entry.screen.action ? ctaFor(entry.screen.action) : null
  const contentKey = entry.kind === 'screen' ? entry.screen.id : entry.id

  const arrowBtn =
    'pointer-events-auto grid size-9 shrink-0 place-items-center rounded-none border border-opt-border-default bg-opt-surface-raised/70 text-opt-text-secondary transition-colors duration-[var(--opt-motion-base)] hover:bg-opt-surface-low hover:text-opt-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus'

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0.12 : 0.22, ease: easeExpo }}
        className="absolute inset-0 z-30 flex items-center justify-center p-6"
      >
        {/* Scrim — blur the world behind; click-to-close for pointers, out of
            the tab order (keyboard closes via × or Escape). */}
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close viewer"
          onClick={close}
          className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[6px]"
        />

        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={heading}
          tabIndex={-1}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          transition={
            reducedMotion ? { duration: 0.12 } : { type: 'spring', stiffness: 320, damping: 28, mass: 0.7 }
          }
          className="relative flex max-h-[90vh] w-auto max-w-[94vw] flex-col rounded-none border border-opt-border-default bg-opt-surface-raised p-5 shadow-opt-md focus:outline-none"
        >
          {/* Lime tick — the one chromatic accent tying gate → hud → viewer. */}
          <span aria-hidden className="mb-3 block h-[2px] w-6 bg-opt-accent-lime-fill" />

          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute right-3 top-3 z-10 grid size-7 place-items-center rounded-none text-opt-text-secondary transition-colors duration-[var(--opt-motion-base)] hover:text-opt-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
          >
            <X size={16} />
          </button>

          {/* Media row — prev/next chrome flanks the media pane. Text entries
              (legacy panels) skip the media pane entirely. */}
          <div className="flex items-center gap-2 md:gap-3">
            {canStep && (
              <button type="button" aria-label="Previous" className={arrowBtn} onClick={() => step(-1)}>
                <ChevronLeft size={18} />
              </button>
            )}

            {entry.kind === 'screen' && (
              <div onPointerDown={onPointerDown} onPointerUp={onPointerUp} className="touch-pan-y">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={contentKey}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                    transition={{ duration: reducedMotion ? 0.1 : 0.18, ease: easeExpo }}
                  >
                    <MediaPane screen={entry.screen} />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {canStep && (
              <button type="button" aria-label="Next" className={arrowBtn} onClick={() => step(1)}>
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          {/* Caption + CTA — sized to the media pane, left-aligned. */}
          <div
            className={
              entry.kind === 'screen'
                ? 'mx-auto mt-4 w-[min(70vw,820px)] max-w-[820px]'
                : 'mt-1 w-[min(88vw,420px)] max-w-[420px]'
            }
          >
            {kicker && (
              <p className="label uppercase tracking-[0.14em] text-opt-text-secondary">{kicker}</p>
            )}
            <h2 className="mt-1.5 font-display text-[24px] font-medium leading-[1.1] text-opt-text-heading">
              {heading}
            </h2>
            {blurb && (
              <p className="mt-2.5 text-[14px] leading-[1.6] text-opt-text-secondary">{blurb}</p>
            )}

            {/* CTA — screen action (VIEW PROJECT ↗ / READ CASE STUDY →) … */}
            {screenCta && entry.kind === 'screen' && entry.screen.action && (
              <div className="mt-4">
                <button
                  type="button"
                  className="group inline-flex items-center gap-1.5 rounded-none border border-opt-border-default px-3 py-1.5 font-opt-mono text-[11px] uppercase tracking-[0.12em] text-opt-text-heading transition-colors duration-[var(--opt-motion-base)] hover:bg-opt-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
                  onClick={() => {
                    const action = entry.screen.action!
                    closePanel()
                    runAction(action)
                  }}
                >
                  {screenCta.label}
                  <span className="text-opt-text-secondary transition-transform duration-[var(--opt-motion-base)] group-hover:translate-x-0.5 group-hover:text-opt-text-heading">
                    {screenCta.icon === 'up' ? <ArrowUpRight size={13} strokeWidth={2} /> : <ArrowRight size={13} strokeWidth={2} />}
                  </span>
                </button>
              </div>
            )}

            {/* … or the legacy panel's onward links. */}
            {entry.kind === 'panel' && entry.panel.links && entry.panel.links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.panel.links.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    className="group inline-flex items-center gap-1.5 rounded-none border border-opt-border-default px-3 py-1.5 font-opt-mono text-[11px] uppercase tracking-[0.12em] text-opt-text-heading transition-colors duration-[var(--opt-motion-base)] hover:bg-opt-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
                    onClick={() => {
                      closePanel()
                      runAction(link.action)
                    }}
                  >
                    {link.label}
                    <span className="text-opt-text-secondary transition-transform duration-[var(--opt-motion-base)] group-hover:translate-x-0.5 group-hover:text-opt-text-heading">
                      {link.action.kind === 'external' ? (
                        <ArrowUpRight size={13} strokeWidth={2} />
                      ) : (
                        <ArrowRight size={13} strokeWidth={2} />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
