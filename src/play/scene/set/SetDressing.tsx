// ============================================================
// SetDressing — backdrop dome, ground, fog, lights (A).
// The sky is a vertical-gradient dome (dusk: warm horizon into
// deep blue-ink zenith); the ground is a radial-gradient canvas
// texture that fades into the fog so the disc has no hard edge.
// Screens are the light sources of the scene — accent points sit
// by each zone; the key light stays soft.
// ============================================================
import { useMemo } from 'react'
import * as THREE from 'three'
import type { PlayPalette } from '../../hooks/usePlayColors'
import { duskTones } from '../materials'

const SKY_VERT = /* glsl */ `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const SKY_FRAG = /* glsl */ `
uniform vec3 uHorizon;
uniform vec3 uZenith;
varying vec3 vWorldPosition;
void main() {
  float h = clamp(normalize(vWorldPosition).y * 1.4 + 0.12, 0.0, 1.0);
  gl_FragColor = vec4(mix(uHorizon, uZenith, pow(h, 0.8)), 1.0);
}
`

function Backdrop({ palette }: { palette: PlayPalette }) {
  const uniforms = useMemo(() => {
    const { horizon, zenith } = duskTones(palette)
    return {
      uHorizon: { value: horizon },
      uZenith: { value: zenith },
    }
  }, [palette])

  return (
    <mesh>
      <sphereGeometry args={[60, 24, 16]} />
      <shaderMaterial
        key={`${uniforms.uHorizon.value.getHexString()}-${uniforms.uZenith.value.getHexString()}`}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={SKY_VERT}
        fragmentShader={SKY_FRAG}
      />
    </mesh>
  )
}

function Ground({ palette }: { palette: PlayPalette }) {
  const texture = useMemo(() => {
    const { horizon, groundCenter } = duskTones(palette)
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, `#${groundCenter.getHexString()}`)
    gradient.addColorStop(0.72, `#${groundCenter.clone().lerp(horizon, 0.55).getHexString()}`)
    gradient.addColorStop(1, `#${horizon.getHexString()}`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [palette])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <circleGeometry args={[46, 48]} />
      <meshStandardMaterial map={texture} roughness={1} metalness={0} />
    </mesh>
  )
}

function Lights({ palette }: { palette: PlayPalette }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={[palette.cyan, palette.ink, 0.3]} />
      <directionalLight position={[6, 12, 5]} intensity={0.9} color={palette.surfaceRaised} />
      {/* Zone accents — screens feel like they light their corner */}
      <pointLight position={[0, 2.4, -0.4]} intensity={5} distance={9} color={palette.blue} />
      <pointLight position={[-7.4, 2.2, 0.4]} intensity={4} distance={8} color={palette.coral} />
      <pointLight position={[7.4, 2, 0.2]} intensity={4} distance={8} color={palette.cyan} />
    </>
  )
}

export default function SetDressing({ palette }: { palette: PlayPalette }) {
  const fogColor = useMemo(() => duskTones(palette).horizon, [palette])
  return (
    <>
      <fog attach="fog" args={[fogColor, 18, 48]} />
      <Backdrop palette={palette} />
      <Ground palette={palette} />
      <Lights palette={palette} />
    </>
  )
}
