// ============================================================
// TopNavMenu — the top-centre location dropdown (replaces the old
// bottom-left zones index). Label = the current location; the
// glass menu lists OUTSIDE · WALL OF ARTS · WORKSPACE · LAB, a
// divider, then GRID VIEW and EXIT PLAYGROUND.
//
// Sound: `interaction.subtle` on open. Place picks run through the
// shared dispatcher as enter/exit so the door stings match a 3D
// door click; GRID VIEW plays `navigation.tab`; EXIT PLAYGROUND
// routes home with a `navigation.backward` sting (same as the yard
// gate). Selections no-op while `transitioning`.
//
// Escape closes the menu and is STOPPED here so it never bubbles
// into PlayHud's global Escape (which would also exit indoors).
// ============================================================
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Grid2x2, LogOut } from 'lucide-react'
import { useSensoryUI } from '@/lib/sensory-ui'
import { dur, easeExpo } from '@/lib/motion'
import { usePlay } from '../PlayContext'
import type { PlayLocation } from '../data/playground'
import { useHotspotAction } from '../useHotspotAction'

const LOCATION_LABEL: Record<PlayLocation, string> = {
  outside: 'OUTSIDE',
  gallery: 'WALL OF ARTS',
  workspace: 'WORKSPACE',
  lab: 'LAB',
}
const PLACES: PlayLocation[] = ['outside', 'gallery', 'workspace', 'lab']

const menuItem =
  'flex w-full items-center gap-2 rounded-none px-3 py-2 text-left font-opt-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-[var(--opt-motion-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-opt-border-focus disabled:cursor-not-allowed disabled:opacity-40'

export default function TopNavMenu({
  triggerClass,
  onExitToGrid,
}: {
  triggerClass: string
  onExitToGrid: () => void
}) {
  const { location, transitioning, reducedMotion } = usePlay()
  const { playSound } = useSensoryUI()
  const runAction = useHotspotAction()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = (restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  const toggleOpen = () => {
    if (transitioning) return
    if (open) {
      closeMenu(false)
    } else {
      void playSound('interaction.subtle')
      setOpen(true)
    }
  }

  // Outside click closes (Escape is handled on the wrapper so it can be
  // stopped from bubbling into the HUD's global handler).
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [open])

  // Move focus into the menu on open (keyboard users); mouse users just click.
  useEffect(() => {
    if (!open) return
    const raf = requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    })
    return () => cancelAnimationFrame(raf)
  }, [open])

  const choosePlace = (id: PlayLocation) => {
    if (transitioning) return
    closeMenu(false)
    if (id === location) return // already here — no veil, no sting
    runAction(id === 'outside' ? { kind: 'exit' } : { kind: 'enter', placeId: id })
  }

  const chooseGrid = () => {
    closeMenu(false)
    void playSound('navigation.tab')
    onExitToGrid()
  }

  const chooseExit = () => {
    closeMenu(false)
    // Home route, but with the yard-gate's backward sting instead of the
    // default route confirm — leaving the world, not navigating within it.
    runAction({ kind: 'route', to: '/' }, 'navigation.backward')
  }

  // Escape closes the menu and is STOPPED here (wrapper covers focus on the
  // trigger OR a menu item) so it never bubbles into PlayHud's global Escape.
  const onWrapperKeyDown = (e: React.KeyboardEvent) => {
    if (open && e.key === 'Escape') {
      e.stopPropagation()
      closeMenu()
    }
  }

  // Roving focus among menu items.
  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return
    e.preventDefault()
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
    if (items.length === 0) return
    const i = items.indexOf(document.activeElement as HTMLElement)
    let next = i
    if (e.key === 'ArrowDown') next = i < 0 ? 0 : (i + 1) % items.length
    else if (e.key === 'ArrowUp') next = i <= 0 ? items.length - 1 : i - 1
    else if (e.key === 'Home') next = 0
    else next = items.length - 1
    items[next]?.focus()
  }

  return (
    <div ref={rootRef} onKeyDown={onWrapperKeyDown} className="relative flex flex-col items-center">
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={transitioning}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault()
            toggleOpen()
          }
        }}
      >
        {LOCATION_LABEL[location]}
        <ChevronDown size={12} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label="Go to"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: dur.fast, ease: easeExpo }}
            onKeyDown={onMenuKeyDown}
            className="glass pointer-events-auto absolute top-[calc(100%+8px)] w-[188px] rounded-none p-1"
          >
            {PLACES.map((id) => {
              const active = location === id
              return (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  aria-current={active ? 'true' : undefined}
                  disabled={transitioning}
                  onClick={() => choosePlace(id)}
                  className={`${menuItem} ${active ? 'text-opt-text-heading' : 'text-opt-text-secondary hover:bg-opt-surface-raised/60 hover:text-opt-text-heading'}`}
                >
                  <span
                    aria-hidden
                    className={[
                      'inline-block size-1.5 shrink-0',
                      active ? 'bg-opt-accent-lime-fill' : 'bg-opt-text-placeholder/50',
                    ].join(' ')}
                  />
                  {LOCATION_LABEL[id]}
                </button>
              )
            })}

            <div aria-hidden className="my-1 h-px bg-opt-border-subtle" />

            <button
              type="button"
              role="menuitem"
              onClick={chooseGrid}
              className={`${menuItem} text-opt-text-secondary hover:bg-opt-surface-raised/60 hover:text-opt-text-heading`}
            >
              <Grid2x2 size={12} className="shrink-0" />
              Grid view
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={chooseExit}
              className={`${menuItem} text-opt-text-secondary hover:bg-opt-surface-raised/60 hover:text-opt-text-heading`}
            >
              <LogOut size={12} className="shrink-0" />
              Exit playground
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
