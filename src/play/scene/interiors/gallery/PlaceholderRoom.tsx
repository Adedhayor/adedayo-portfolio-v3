// ============================================================
// Wall of Arts (gallery interior) — W2 OWNS THIS FILE.
// W0 placeholder: the shared room shell fed the gallery place.
// Replace with the real gallery (frames, captions, spots, picture
// rail) — keep the same props so PlayWorld's mount stays stable.
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import { getPlace, type HotspotAction } from '../../../data/playground'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import PlaceholderRoomShell from '../PlaceholderRoomShell'

export default function GalleryRoom({
  palette,
  onAction,
}: {
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
}) {
  return <PlaceholderRoomShell place={getPlace('gallery')} palette={palette} onAction={onAction} />
}
