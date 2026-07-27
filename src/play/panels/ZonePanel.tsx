// ============================================================
// ZonePanel — OWNED BY THE GATE/HUD WORKSTREAM (E).
// A small, precise index card floating over a blurred world —
// not a modal wall. Keeps the DOM dialog + blur-scrim approach,
// adds a hand-rolled focus trap (neutral initial focus, Tab
// cycling, focus restored to the opener on close) and a spring-in.
//
// Escape is owned by PlayHud's global handler (overlay.close +
// closePanel); we do NOT re-bind it here to avoid a double sting.
// ============================================================
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowUpRight, ArrowRight } from 'lucide-react'
import { useSensoryUI } from '@/lib/sensory-ui'
import { easeExpo } from '@/lib/motion'
import { usePlay } from '../PlayContext'
import { panels, type HotspotAction } from '../data/playground'
import { useHotspotAction } from '../useHotspotAction'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  )
}

function linkIcon(action: HotspotAction) {
  return action.kind === 'external' ? (
    <ArrowUpRight size={13} strokeWidth={2} />
  ) : (
    <ArrowRight size={13} strokeWidth={2} />
  )
}

export default function ZonePanel() {
  const { activePanelId, closePanel, reducedMotion } = usePlay()
  const { playSound } = useSensoryUI()
  const runAction = useHotspotAction()
  const panel = activePanelId ? panels[activePanelId] : null

  const dialogRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  // Focus trap — keyed on the open panel id. Capture the opener, move focus
  // into the dialog, cycle Tab within it, and restore focus on close.
  useEffect(() => {
    if (!activePanelId) return
    restoreRef.current = (document.activeElement as HTMLElement | null) ?? null

    const raf = requestAnimationFrame(() => {
      // Neutral initial focus on the dialog itself so no control reads as
      // pre-pressed; Tab then steps into the close button / links.
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

      // No focusables (or focus escaped the dialog) → keep it inside.
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
  }, [activePanelId])

  const close = () => {
    void playSound('overlay.close')
    closePanel()
  }

  return (
    <AnimatePresence>
      {panel && (
        <motion.div
          key={activePanelId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.22, ease: easeExpo }}
          className="absolute inset-0 z-20 flex items-center justify-center p-6"
        >
          {/* Scrim — blur the world behind. Click-to-close for pointers, kept
              out of the tab order (keyboard closes via the × or Escape). */}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close panel"
            onClick={close}
            className="absolute inset-0 cursor-default bg-black/25 backdrop-blur-[6px]"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={panel.heading}
            tabIndex={-1}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={
              reducedMotion
                ? { duration: 0.12 }
                : { type: 'spring', stiffness: 320, damping: 26, mass: 0.7 }
            }
            className="relative w-full max-w-[380px] rounded-none border border-opt-border-default bg-opt-surface-raised p-6 shadow-opt-md focus:outline-none"
          >
            {/* Lime tick — the one chromatic accent, tying gate → hud → panel. */}
            <span aria-hidden className="mb-4 block h-[2px] w-6 bg-opt-accent-lime-fill" />

            {panel.kicker && (
              <p className="label uppercase tracking-[0.14em] text-opt-text-secondary">
                {panel.kicker}
              </p>
            )}
            <h2 className="mt-2 font-display text-[26px] font-medium leading-[1.08] text-opt-text-heading">
              {panel.heading}
            </h2>
            <p className="mt-3 text-[14px] leading-[1.6] text-opt-text-secondary">{panel.body}</p>

            {panel.links && panel.links.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {panel.links.map((link) => (
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
                      {linkIcon(link.action)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute right-3 top-3 grid size-7 place-items-center rounded-none text-opt-text-secondary transition-colors duration-[var(--opt-motion-base)] hover:text-opt-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
            >
              <X size={16} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
