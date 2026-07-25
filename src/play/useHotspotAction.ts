// ============================================================
// useHotspotAction — the one dispatcher for HotspotActions.
// Plays the action's sound role, then routes/focuses/opens.
// Shared by the 3D hotspots, screens, panels, and the sr-only
// accessibility list so every path sounds and behaves the same.
// ============================================================
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSensoryUI, type SoundRole } from '@/lib/sensory-ui'
import { soundForAction, type HotspotAction } from './data/playground'
import { usePlay } from './PlayContext'

export function useHotspotAction() {
  const navigate = useNavigate()
  const { focusZone, openPanel } = usePlay()
  const { playSound } = useSensoryUI()

  return useCallback(
    (action: HotspotAction, sound?: SoundRole) => {
      void playSound(sound ?? soundForAction(action))
      switch (action.kind) {
        case 'focus':
          focusZone(action.zoneId)
          break
        case 'route':
          navigate(action.to)
          break
        case 'external':
          window.open(action.href, '_blank', 'noopener,noreferrer')
          break
        case 'panel':
          openPanel(action.panelId)
          break
      }
    },
    [playSound, focusZone, openPanel, navigate],
  )
}
