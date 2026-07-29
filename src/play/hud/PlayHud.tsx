// ============================================================
// PlayHud — the world's chrome in the site's own voice: frosted
// radius-0 chips, mono micro-labels. The container is
// pointer-events-none; only the controls opt in.
//
// Phase-2 relayout (W5):
//  • top-left  — back chip ("← OUTSIDE" indoors → exit) / "The Yard".
//  • top-centre — the location dropdown (TopNavMenu), which absorbs
//    the old bottom-left zones index AND the grid escape hatch.
//  • top-right — sun/moon time-of-day chip + mute.
//  • bottom-centre — the drag/enter hint, outside only.
//
// Escape order (this global handler): lightbox/panel open → close
// it (overlay.close + closePanel); else indoors → exit; else
// nothing. The dropdown's own Escape is stopped inside TopNavMenu
// so it never reaches here. The HUD dips out while `transitioning`
// so the door swap reads clean (no dip under reduced motion —
// goTo never sets `transitioning` there).
// ============================================================
import { useEffect } from 'react'
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import { useSensoryUI } from '@/lib/sensory-ui'
import { usePlay } from '../PlayContext'
import { useHotspotAction } from '../useHotspotAction'
import TopNavMenu from './TopNavMenu'
import TimeOfDayChip from './TimeOfDayChip'

// Frosted chip idiom — mirrors the site chrome (NavIsland's glass, radius-0,
// mono labels) but tuned to read over the dusk world.
const chip =
  'pointer-events-auto inline-flex items-center gap-1.5 rounded-none border border-opt-border-subtle bg-opt-glass-bg px-3 py-2 font-opt-mono text-[11px] uppercase tracking-[0.14em] text-opt-text-heading shadow-opt-glass backdrop-blur-md transition-colors duration-[var(--opt-motion-base)] ease-[var(--opt-easing-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus'
const chipButton = `${chip} hover:border-opt-border-default hover:bg-opt-surface-raised/60 disabled:cursor-not-allowed disabled:opacity-50`

export default function PlayHud({ onExitToGrid }: { onExitToGrid: () => void }) {
  const { phase, location, transitioning, activePanelId, muted, setMuted, closePanel } = usePlay()
  const { playSound } = useSensoryUI()
  const runAction = useHotspotAction()
  const inWorld = phase === 'live'
  const indoors = location !== 'outside'

  // Escape: close the lightbox/panel first, else (if indoors) exit to outside.
  // The dropdown's Escape is stopped inside TopNavMenu, so it never lands here.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (activePanelId) {
        void playSound('overlay.close')
        closePanel()
      } else if (location !== 'outside') {
        runAction({ kind: 'exit' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activePanelId, location, closePanel, playSound, runAction])

  if (!inWorld) return null

  return (
    <div
      className={[
        'pointer-events-none absolute inset-0 z-20 transition-opacity duration-[var(--opt-motion-slow)]',
        transitioning ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      {/* Top-left: back / breadcrumb */}
      <div className="absolute left-4 top-4 flex items-center gap-2">
        {indoors ? (
          <button
            type="button"
            className={chipButton}
            disabled={transitioning}
            onClick={() => runAction({ kind: 'exit' })}
          >
            <ArrowLeft size={12} /> Outside
          </button>
        ) : (
          <span className={`${chip} text-opt-text-heading`}>The Yard</span>
        )}
      </div>

      {/* Top-centre: the location dropdown (also holds grid + exit playground) */}
      <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
        <TopNavMenu triggerClass={chipButton} onExitToGrid={onExitToGrid} />
      </div>

      {/* Top-right: time-of-day + mute */}
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <TimeOfDayChip className={chipButton} />
        <button
          type="button"
          className={chipButton}
          aria-pressed={muted}
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
          onClick={() => {
            const next = !muted
            setMuted(next)
            // Sting on unmute only — muting should go quiet immediately.
            if (!next) void playSound('interaction.toggle')
          }}
        >
          {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </button>
      </div>

      {/* Bottom-center hint (outside only) */}
      {!indoors && (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-opt-mono text-[11px] uppercase tracking-[0.14em] text-opt-text-secondary">
          Drag to look · tap a door to go inside
        </p>
      )}
    </div>
  )
}
