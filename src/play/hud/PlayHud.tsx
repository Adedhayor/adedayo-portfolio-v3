// ============================================================
// PlayHud — OWNED BY THE GATE/HUD WORKSTREAM (E) for styling.
// Foundation version: functional chrome only — back-to-overview,
// mute toggle, grid-view escape hatch, zone breadcrumb, and the
// Escape-key handling (panel first, then unfocus).
// ============================================================
import { useEffect } from 'react'
import { ArrowLeft, Volume2, VolumeX, Grid2x2 } from 'lucide-react'
import { useSensoryUI } from '@/lib/sensory-ui'
import { usePlay } from '../PlayContext'
import { getZone } from '../data/playground'

export default function PlayHud({ onExitToGrid }: { onExitToGrid: () => void }) {
  const { phase, focusedZoneId, activePanelId, muted, setMuted, goOverview, closePanel } = usePlay()
  const { playSound } = useSensoryUI()
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

  const chip =
    'pointer-events-auto flex items-center gap-1.5 border border-opt-border-subtle bg-opt-surface-raised/85 px-3 py-2 font-opt-mono text-[11px] uppercase tracking-[0.12em] text-opt-text-heading backdrop-blur-sm transition-colors hover:border-opt-border-default'

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* Top-left: back / breadcrumb */}
      <div className="absolute left-4 top-4 flex items-center gap-2">
        {phase === 'focused' && focusedZoneId ? (
          <button
            type="button"
            className={chip}
            onClick={() => {
              void playSound('navigation.backward')
              goOverview()
            }}
          >
            <ArrowLeft size={12} /> {getZone(focusedZoneId).title}
          </button>
        ) : (
          <span className={chip}>The Yard</span>
        )}
      </div>

      {/* Top-right: mute + grid escape hatch */}
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <button
          type="button"
          className={chip}
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
          className={chip}
          aria-label="Switch to grid view"
          onClick={() => {
            void playSound('navigation.tab')
            onExitToGrid()
          }}
        >
          <Grid2x2 size={12} /> Grid
        </button>
      </div>

      {/* Bottom hint */}
      {phase === 'overview' && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-opt-mono text-[11px] uppercase tracking-[0.14em] text-opt-text-secondary">
          Drag to look · tap a label to go closer
        </p>
      )}
    </div>
  )
}
