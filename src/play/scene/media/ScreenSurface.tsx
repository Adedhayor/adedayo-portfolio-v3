// ============================================================
// ScreenSurface — picks VideoScreen or RiveScreen per-content so
// zone composition (ZonePlaceholder today, workstream A's real
// zones next) doesn't need to know the difference. Carry this
// import over wherever screens get composed.
// ============================================================
import type { HotspotAction, ScreenContent } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'
import VideoScreen from './VideoScreen'
import RiveScreen from './RiveScreen'

export default function ScreenSurface({
  content,
  palette,
  width,
  onAction,
}: {
  content: ScreenContent
  palette: PlayPalette
  width?: number
  onAction?: (action: HotspotAction) => void
}) {
  if (content.rive) {
    return <RiveScreen content={content} palette={palette} width={width} onAction={onAction} />
  }
  return <VideoScreen content={content} palette={palette} width={width} onAction={onAction} />
}
