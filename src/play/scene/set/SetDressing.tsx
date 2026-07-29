// ============================================================
// SetDressing — sky dome, ground, fog, key lighting + sky bodies
// for the outside world (W1, evolved from the Phase-1 dusk set).
//
// Everything time-of-day now flows through the shared `Env` (built
// once in Outside): the sky-dome uniforms, the fog colour, the
// ground tint and the key-light colour all point at the SAME
// mutating Colour instances, so a band tween retints them for
// free; the scalars (fog range, light intensities, sun/moon/star
// opacity) are copied in one small useFrame. Sun disc rides the
// day band, moon + instanced stars ride night, all cross-fading.
// ============================================================
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlayPalette } from '../../hooks/usePlayColors'
import type { Env } from '../outside/environment'

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

/** Sky dome — gradient shared with the env colours (mutated in place). */
function Backdrop({ env }: { env: Env }) {
  const uniforms = useMemo(
    () => ({ uHorizon: { value: env.horizon }, uZenith: { value: env.zenith } }),
    [env],
  )
  return (
    <mesh>
      <sphereGeometry args={[60, 24, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={SKY_VERT}
        fragmentShader={SKY_FRAG}
      />
    </mesh>
  )
}

/** A palette-independent radial vignette — center bright, rim sunk toward
    dark so the disc recedes into the fog. Tinted live by env.groundCenter. */
function Ground({ env }: { env: Env }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.72, '#bcbcbc')
    g.addColorStop(1, '#4a4a4a')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Share the ground tint with the env colour so it follows the band tween.
  useEffect(() => {
    if (matRef.current) matRef.current.color = env.groundCenter
  }, [env])
  useEffect(() => () => texture.dispose(), [texture])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <circleGeometry args={[46, 48]} />
      <meshStandardMaterial ref={matRef} map={texture} roughness={1} metalness={0} />
    </mesh>
  )
}

/** Ambient + hemi + a single key light. Colours/intensities ride the env. */
function Lights({ palette, env }: { palette: PlayPalette; env: Env }) {
  const ambient = useRef<THREE.AmbientLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const key = useRef<THREE.DirectionalLight>(null)

  useEffect(() => {
    if (key.current) key.current.color = env.keyColor
  }, [env])

  useFrame(() => {
    if (ambient.current) ambient.current.intensity = env.ambient
    if (hemi.current) hemi.current.intensity = env.hemi
    if (key.current) key.current.intensity = env.key
  })

  return (
    <>
      <ambientLight ref={ambient} intensity={env.ambient} />
      <hemisphereLight ref={hemi} args={[palette.cyan, palette.ink, env.hemi]} />
      <directionalLight ref={key} position={[6, 13, 4]} intensity={env.key} />
    </>
  )
}

/** Sun disc (day) / moon disc + instanced stars (night), cross-fading. */
function SkyBodies({ palette, env }: { palette: PlayPalette; env: Env }) {
  const sun = useRef<THREE.Mesh>(null)
  const sunMat = useRef<THREE.MeshBasicMaterial>(null)
  const moon = useRef<THREE.Mesh>(null)
  const moonMat = useRef<THREE.MeshBasicMaterial>(null)
  const stars = useRef<THREE.Points>(null)
  const starMat = useRef<THREE.PointsMaterial>(null)

  const starPositions = useMemo(() => {
    const N = 150
    const arr = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      // Upper hemisphere, just inside the 60-unit dome.
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 0.85 + 0.05)
      const r = 55
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.9 + 4
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [])

  useFrame(() => {
    if (sunMat.current) sunMat.current.opacity = env.sun
    if (sun.current) sun.current.visible = env.sun > 0.02
    if (moonMat.current) moonMat.current.opacity = env.moon
    if (moon.current) moon.current.visible = env.moon > 0.02
    if (starMat.current) starMat.current.opacity = env.stars
    if (stars.current) stars.current.visible = env.stars > 0.02
  })

  return (
    <>
      {/* Sun — warm, high, day only */}
      <mesh ref={sun} position={[15, 17, -26]} visible={false}>
        <sphereGeometry args={[2.1, 24, 24]} />
        <meshBasicMaterial
          ref={sunMat}
          color={new THREE.Color(palette.yellow).lerp(new THREE.Color(palette.surfaceRaised), 0.35)}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
          fog={false}
        />
      </mesh>
      {/* Moon — pale, opposite, night only */}
      <mesh ref={moon} position={[-13, 19, -28]} visible={false}>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial
          ref={moonMat}
          color={new THREE.Color(palette.surfaceRaised).lerp(new THREE.Color(palette.cyan), 0.25)}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
          fog={false}
        />
      </mesh>
      {/* Stars — instanced points, night only */}
      <points ref={stars} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={starMat}
          color={new THREE.Color(palette.surfaceRaised)}
          size={0.45}
          sizeAttenuation
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
          fog={false}
        />
      </points>
    </>
  )
}

export default function SetDressing({ palette, env }: { palette: PlayPalette; env: Env }) {
  const fogRef = useRef<THREE.Fog>(null)

  // Fog colour/range are copied per frame (3 floats) rather than
  // reference-shared: r3f may reconstruct a <fog> whose args diff on a
  // re-render, which would silently sever a shared Colour instance.
  useFrame(() => {
    const fog = fogRef.current
    if (!fog) return
    fog.color.copy(env.fogColor)
    fog.near = env.fogNear
    fog.far = env.fogFar
  })

  return (
    <>
      <fog ref={fogRef} attach="fog" args={[env.fogColor, env.fogNear, env.fogFar]} />
      <Backdrop env={env} />
      <Ground env={env} />
      <Lights palette={palette} env={env} />
      <SkyBodies palette={palette} env={env} />
    </>
  )
}
