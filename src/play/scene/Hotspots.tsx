// ============================================================
// Hotspots — OWNED BY THE CAMERA/INTERACTION WORKSTREAM (B).
// Foundation version: pulsing dot + mono label per hotspot, an
// oversized invisible hit sphere, hover/click sounds via the
// callbacks passed down from PlayWorld (contexts are not relied
// on inside the Canvas reconciler).
// ============================================================
import { useCallback } from 'react'
import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { SoundRole } from '@/lib/sensory-ui'
import type { Hotspot, HotspotAction } from '../data/playground'
import type { PlayPalette } from '../hooks/usePlayColors'

export default function Hotspots({
  hotspots,
  palette,
  onAction,
  onHover,
}: {
  hotspots: Hotspot[]
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
  onHover: () => void
}) {
  const setCursor = useCallback((value: string) => {
    document.body.style.cursor = value
  }, [])

  return (
    <>
      {hotspots.map((hotspot) => (
        <group key={hotspot.id} position={hotspot.position}>
          {/* Visible marker */}
          <mesh>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color={palette.yellow} />
          </mesh>
          {/* Oversized hit target */}
          <mesh
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation()
              onAction(hotspot.action, hotspot.sound)
            }}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation()
              setCursor('pointer')
              onHover()
            }}
            onPointerOut={() => setCursor('')}
          >
            <sphereGeometry args={[0.5, 10, 10]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <Html center zIndexRange={[15, 0]} className="pointer-events-none select-none">
            <div className="flex translate-y-5 flex-col items-center gap-0.5 whitespace-nowrap text-center">
              <span
                className="size-1.5 animate-pulse rounded-full"
                style={{ backgroundColor: palette.yellow }}
              />
              <span className="font-opt-mono text-[11px] uppercase tracking-[0.16em] text-opt-text-heading">
                {hotspot.label}
              </span>
              {hotspot.kicker && (
                <span className="font-opt-mono text-[9px] uppercase tracking-[0.12em] text-opt-text-secondary">
                  {hotspot.kicker}
                </span>
              )}
            </div>
          </Html>
        </group>
      ))}
    </>
  )
}
