// ============================================================
// Silhouettes — 2–3 distant cut-out panels far behind the yard
// (W1). Flat canvas-texture silhouettes (rolling hills, a little
// skyline with a water tower, a tree/roof ridge) parked on the
// far ring at r≈40–44. Parallax-cheap: just alpha-cut planes,
// drawn in a dark blued ink so they read against every sky band.
// They sit beyond the fog's far plane, so the material opts OUT
// of fog (fog would flatten them to pure sky) and fakes the
// atmospheric sink with a fixed sub-1 opacity instead.
//
// The `backdropPanels` data seam in playground.ts is left empty on
// purpose — the composition is pure scene code (the contract is
// frozen post-W0), so nothing here touches the data layer.
// ============================================================
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { PlayPalette } from '../../hooks/usePlayColors'
import { mixColor } from '../materials'

type SilhouetteKind = 'hills' | 'town' | 'ridge'

function makeSilhouette(kind: SilhouetteKind, color: THREE.Color): THREE.CanvasTexture {
  const w = 512
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = `#${color.getHexString()}`

  if (kind === 'hills') {
    ctx.beginPath()
    ctx.moveTo(0, h)
    ctx.lineTo(0, 190)
    ctx.quadraticCurveTo(130, 148, 258, 186)
    ctx.quadraticCurveTo(390, 224, 512, 172)
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fill()
  } else if (kind === 'town') {
    // Row of blocky rooflines.
    const tops = [204, 168, 190, 150, 178, 158, 196]
    const seg = w / tops.length
    tops.forEach((top, i) => {
      ctx.fillRect(i * seg, top, seg - 5, h - top)
      // Pitched roof on a couple of them.
      if (i % 2 === 0) {
        ctx.beginPath()
        ctx.moveTo(i * seg, top)
        ctx.lineTo(i * seg + (seg - 5) / 2, top - 22)
        ctx.lineTo(i * seg + seg - 5, top)
        ctx.closePath()
        ctx.fill()
      }
    })
    // Water tower.
    ctx.fillRect(372, 96, 8, 70) // legs
    ctx.fillRect(408, 96, 8, 70)
    ctx.fillRect(360, 74, 66, 30) // tank
    ctx.beginPath()
    ctx.moveTo(360, 74)
    ctx.lineTo(393, 56)
    ctx.lineTo(426, 74)
    ctx.closePath()
    ctx.fill()
  } else {
    // Jagged tree/roof ridge.
    ctx.beginPath()
    ctx.moveTo(0, h)
    ctx.lineTo(0, 200)
    for (let x = 0; x <= w; x += 32) {
      const peak = 168 + Math.sin(x * 0.05) * 24 + (x % 64 === 0 ? -26 : 10)
      ctx.lineTo(x + 16, peak)
      ctx.lineTo(x + 32, 200)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

type Panel = { kind: SilhouetteKind; position: [number, number, number]; width: number; rotationY: number }

const PANELS: Panel[] = [
  { kind: 'hills', position: [-24, 5.5, -40], width: 30, rotationY: 0.28 },
  { kind: 'town', position: [6, 5.5, -44], width: 34, rotationY: 0 },
  { kind: 'ridge', position: [28, 5.5, -41], width: 28, rotationY: -0.3 },
]

function SilhouettePanel({ panel, color }: { panel: Panel; color: THREE.Color }) {
  const texture = useMemo(() => makeSilhouette(panel.kind, color), [panel.kind, color])
  useEffect(() => () => texture.dispose(), [texture])
  const height = panel.width * (256 / 512)
  return (
    <mesh position={panel.position} rotation={[0, panel.rotationY, 0]}>
      <planeGeometry args={[panel.width, height]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} opacity={0.85} fog={false} />
    </mesh>
  )
}

export default function Silhouettes({ palette }: { palette: PlayPalette }) {
  // Dark, slightly blued so the cut-outs read against dusk/day and melt into
  // the ink sky at night.
  const color = useMemo(() => mixColor(palette.ink, palette.blue, 0.35), [palette])
  return (
    <group>
      {PANELS.map((panel) => (
        <SilhouettePanel key={panel.kind} panel={panel} color={color} />
      ))}
    </group>
  )
}
