// ============================================================
// WorldZones — composes the four zones of The Yard (A). Builds
// the shared palette-driven material set once and threads it,
// plus onAction / reducedMotion, into each zone. This is what
// PlayWorld renders in place of the foundation placeholders.
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import type { HotspotAction } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'
import { useWorldMaterials } from '../materials'
import LabZone from './LabZone'
import TvWallZone from './TvWallZone'
import DeskZone from './DeskZone'
import YardZone from './YardZone'

export default function WorldZones({
  palette,
  onAction,
  reducedMotion,
}: {
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
  reducedMotion: boolean
}) {
  const mats = useWorldMaterials(palette)
  return (
    <>
      <LabZone palette={palette} mats={mats} onAction={onAction} reducedMotion={reducedMotion} />
      <TvWallZone palette={palette} mats={mats} onAction={onAction} />
      <DeskZone palette={palette} mats={mats} onAction={onAction} />
      <YardZone palette={palette} mats={mats} reducedMotion={reducedMotion} />
    </>
  )
}
