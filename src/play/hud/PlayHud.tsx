// ============================================================
// PlayHud — OWNED BY THE GATE/HUD WORKSTREAM (E).
// The world's chrome, in the site's own voice: frosted radius-0
// chips, mono micro-labels. Top-left back/breadcrumb, top-right
// mute + grid escape hatch, bottom-left zones index (focuses a
// zone via the shared dispatcher), bottom-center overview hint.
// The container is pointer-events-none; only the controls opt in.
//
// Behaviour contracts (frozen): Escape → panel first (overlay.close
// + closePanel) else focused (navigation.backward + goOverview);
// mute stings interaction.toggle on UNMUTE only; grid stings
// navigation.tab then exits to the 2D grid.
// ============================================================
import { useEffect } from 'react'
import { ArrowLeft, Volume2, VolumeX, Grid2x2 } from 'lucide-react'
import { useSensoryUI } from '@/lib/sensory-ui'
import { usePlay } from '../PlayContext'
import { getZone, zones } from '../data/playground'
import { useHotspotAction } from '../useHotspotAction'

// Frosted chip idiom — mirrors the site chrome (NavIsland's glass, radius-0,
// mono labels) but tuned to read over the dusk world. Built from the same
// glass tokens so hover/focus states stay under our control.
const chip =
  'pointer-events-auto inline-flex items-center gap-1.5 rounded-none border border-opt-border-subtle bg-opt-glass-bg px-3 py-2 font-opt-mono text-[11px] uppercase tracking-[0.14em] text-opt-text-heading shadow-opt-glass backdrop-blur-md transition-colors duration-[var(--opt-motion-base)] ease-[var(--opt-easing-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus'
const chipButton = `${chip} hover:border-opt-border-default hover:bg-opt-surface-raised/60`

// Zone index labels — short forms of the zone titles ("The Lab" → "LAB").
const zoneNav = zones.map((z) => ({
  id: z.id,
  label: z.title.replace(/^the\s+/i, '').toUpperCase(),
}))

export default function PlayHud({ onExitToGrid }: { onExitToGrid: () => void }) {
  const { phase, focusedZoneId, activePanelId, muted, setMuted, goOverview, closePanel } = usePlay()
  const { playSound } = useSensoryUI()
  const runAction = useHotspotAction()
  const inWorld = phase === 'overview' || phase === 'focused'

  // Escape: close the panel first, then drop focus back to overview.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (activePanelId) {
        void playSound('overlay.close')
        closePanel()
      } else if (phase === 'focused') {
        void playSound('navigation.backward')
        goOverview()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activePanelId, phase, closePanel, goOverview, playSound])

  if (!inWorld) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* Top-left: back / breadcrumb */}
      <div className="absolute left-4 top-4 flex items-center gap-2">
        {phase === 'focused' && focusedZoneId ? (
          <button
            type="button"
            className={chipButton}
            onClick={() => {
              void playSound('navigation.backward')
              goOverview()
            }}
          >
            <ArrowLeft size={12} /> {getZone(focusedZoneId).title}
          </button>
        ) : (
          <span className={`${chip} text-opt-text-heading`}>The Yard</span>
        )}
      </div>

      {/* Top-right: mute + grid escape hatch */}
      <div className="absolute right-4 top-4 flex items-center gap-2">
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
        <button
          type="button"
          className={chipButton}
          aria-label="Switch to grid view"
          onClick={() => {
            void playSound('navigation.tab')
            onExitToGrid()
          }}
        >
          <Grid2x2 size={12} /> Grid
        </button>
      </div>

      {/* Bottom-left: zones index — jump the camera between zones. Mirrors the
          site nav's active/rest states; the focused zone is highlighted. */}
      <nav
        aria-label="Zones"
        className="pointer-events-auto absolute bottom-4 left-4 flex flex-col gap-0.5 rounded-none border border-opt-border-subtle bg-opt-glass-bg p-1.5 shadow-opt-glass backdrop-blur-md"
      >
        <span className="px-2 pb-0.5 pt-1 font-opt-mono text-[9px] uppercase tracking-[0.24em] text-opt-text-placeholder">
          Zones
        </span>
        {zoneNav.map((z) => {
          const active = focusedZoneId === z.id
          return (
            <button
              key={z.id}
              type="button"
              aria-current={active ? 'true' : undefined}
              onClick={() => runAction({ kind: 'focus', zoneId: z.id })}
              className="group flex items-center gap-2 rounded-none px-2 py-1 text-left font-opt-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-[var(--opt-motion-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
            >
              <span
                aria-hidden
                className={[
                  'inline-block size-1.5 transition-colors duration-[var(--opt-motion-base)]',
                  active
                    ? 'bg-opt-accent-lime-fill'
                    : 'bg-opt-text-placeholder/50 group-hover:bg-opt-text-secondary',
                ].join(' ')}
              />
              <span
                className={
                  active
                    ? 'text-opt-text-heading'
                    : 'text-opt-text-secondary group-hover:text-opt-text-heading'
                }
              >
                {z.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Bottom-center hint (overview only) */}
      {phase === 'overview' && (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-opt-mono text-[11px] uppercase tracking-[0.14em] text-opt-text-secondary">
          Drag to look · tap a label to go closer
        </p>
      )}
    </div>
  )
}
