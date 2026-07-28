// ============================================================
// Workspace (desk interior) — W3 OWNS THIS FILE.
// W0 placeholder: the shared room shell fed the workspace place.
// Replace with the real room (desk/chair/laptop + the monitor
// case-study carousel) — keep the same props so PlayWorld's mount
// stays stable.
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import { getPlace, type HotspotAction } from '../../../data/playground'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import PlaceholderRoomShell from '../PlaceholderRoomShell'

export default function WorkspaceRoom({
  palette,
  onAction,
}: {
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
}) {
  return <PlaceholderRoomShell place={getPlace('workspace')} palette={palette} onAction={onAction} />
}
