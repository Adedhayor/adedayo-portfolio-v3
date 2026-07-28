// ============================================================
// useHotspotAction — the one dispatcher for HotspotActions.
// Plays the action's sound role, then routes / enters / exits /
// opens. Shared by the 3D hotspots, screens, panels, and the
// sr-only accessibility list so every path sounds and behaves
// the same.
//
// enter/exit run the door-veil transition via goTo; lightbox
// opens the viewer modal — stubbed here as a panel id the W5
// Lightbox will own (`lightbox:<screenId>`).
// ============================================================
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSensoryUI, type SoundRole } from '@/lib/sensory-ui'
import { soundForAction, type HotspotAction } from './data/playground'
import { usePlay } from './PlayContext'

/** Panel id the lightbox stub opens under. W5 replaces the stub with the
    real viewer keyed on this same convention. */
export const lightboxPanelId = (screenId: string) => `lightbox:${screenId}`

export function useHotspotAction() {
  const navigate = useNavigate()
  const { goTo, openPanel } = usePlay()
  const { playSound } = useSensoryUI()

  return useCallback(
    (action: HotspotAction, sound?: SoundRole) => {
      void playSound(sound ?? soundForAction(action))
      switch (action.kind) {
        case 'route':
          navigate(action.to)
          break
        case 'external':
          window.open(action.href, '_blank', 'noopener,noreferrer')
          break
        case 'panel':
          openPanel(action.panelId)
          break
        case 'enter':
          goTo(action.placeId)
          break
        case 'exit':
          goTo('outside')
          break
        case 'lightbox':
          openPanel(lightboxPanelId(action.screenId))
          break
      }
    },
    [playSound, goTo, openPanel, navigate],
  )
}
