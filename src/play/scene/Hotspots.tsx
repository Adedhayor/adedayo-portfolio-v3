// ============================================================
// Hotspots — pulsing markers + mono labels (workstream B).
// Oversized invisible hit sphere per hotspot; drag-vs-tap
// discrimination via r3f's event.delta so orbiting never
// triggers an action. Hover: the marker springs up ~1.6× and
// the label brightens; sounds fire through the callbacks passed
// from PlayWorld (contexts are not relied on inside the Canvas).
// ============================================================
import { useCallback, useRef, useState } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import type { SoundRole } from '@/lib/sensory-ui'
import type { Hotspot, HotspotAction } from '../data/playground'
import type { PlayPalette } from '../hooks/usePlayColors'

const TAP_SLOP_PX = 6

function HotspotMarker({
  hotspot,
  palette,
  onAction,
  onHover,
}: {
  hotspot: Hotspot
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
  onHover: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const markerRef = useRef<THREE.Mesh>(null)

  // Spring the visible dot toward its hover scale.
  useFrame((_, delta) => {
    const marker = markerRef.current
    if (!marker) return
    const target = hovered ? 1.6 : 1
    const k = 1 - Math.exp(-12 * delta)
    const next = marker.scale.x + (target - marker.scale.x) * k
    marker.scale.setScalar(next)
  })

  return (
    <group position={hotspot.position}>
      {/* Visible marker */}
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color={hovered ? palette.textHeading : palette.yellow} />
      </mesh>
      {/* Oversized hit target */}
      <mesh
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          if (e.delta > TAP_SLOP_PX) return // drag, not a tap
          onAction(hotspot.action, hotspot.sound)
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          setHovered(true)
          onHover()
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
          setHovered(false)
        }}
      >
        <sphereGeometry args={[0.5, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Html center zIndexRange={[15, 0]} className="pointer-events-none select-none">
        <div className="flex translate-y-5 flex-col items-center gap-0.5 whitespace-nowrap text-center">
          <span
            className={hovered ? 'size-1.5 rounded-full' : 'size-1.5 animate-pulse rounded-full'}
            style={{ backgroundColor: hovered ? palette.textHeading : palette.yellow }}
          />
          <span
            className="font-opt-mono text-[11px] uppercase tracking-[0.16em] transition-opacity duration-200"
            style={{ color: palette.textHeading, opacity: hovered ? 1 : 0.85 }}
          >
            {hotspot.label}
          </span>
          {hotspot.kicker && (
            <span
              className="font-opt-mono text-[9px] uppercase tracking-[0.12em] transition-opacity duration-200"
              style={{ color: palette.textSecondary, opacity: hovered ? 1 : 0.7 }}
            >
              {hotspot.kicker}
            </span>
          )}
        </div>
      </Html>
    </group>
  )
}

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
  // Stable callback identity so markers don't re-render on parent churn.
  const handleHover = useCallback(() => onHover(), [onHover])

  return (
    <>
      {hotspots.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          palette={palette}
          onAction={onAction}
          onHover={handleHover}
        />
      ))}
    </>
  )
}
