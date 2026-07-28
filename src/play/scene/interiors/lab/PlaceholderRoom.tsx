// ============================================================
// Chemistry Lab (lab interior) — W4 OWNS THIS FILE.
// W0 placeholder: the shared room shell fed the lab place. The
// experiment-station hotspots (place.interior.hotspots → panels)
// render through PlayWorld's shared Hotspots layer, so panels
// still open here. Replace with the real bench + three stations +
// the Effects Studio "fume hood" screen — keep the same props.
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import { getPlace, type HotspotAction } from '../../../data/playground'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import PlaceholderRoomShell from '../PlaceholderRoomShell'

export default function LabRoom({
  palette,
  onAction,
}: {
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
}) {
  return <PlaceholderRoomShell place={getPlace('lab')} palette={palette} onAction={onAction} />
}
