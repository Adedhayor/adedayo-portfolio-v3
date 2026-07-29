// ============================================================
// labMaterials — palette-driven material + texture set for the
// Chemistry Lab interior (W4). Self-contained (no shared
// WorldMaterials import, since scene/objects may be reshaped by
// the Outside stream): everything derives from usePlayColors via
// mixColor so the room follows theme flips. Materials are created
// transparent (opacity tweens never recompile shaders) and both
// the material set and the procedural floor texture are memoized
// per palette and disposed on change — StrictMode-safe.
// ============================================================
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import { mixColor } from '../../materials'

export type LabMaterials = {
  /** Dark epoxy bench top */
  benchTop: THREE.MeshStandardMaterial
  /** Under-cabinet body */
  cabinet: THREE.MeshStandardMaterial
  /** Cabinet door fronts (a touch lighter) */
  cabinetDoor: THREE.MeshStandardMaterial
  /** Steel — rods, ring stand, scale, knobs */
  metal: THREE.MeshStandardMaterial
  /** Wall shelf plank */
  shelf: THREE.MeshStandardMaterial
  /** Low-alpha tinted "glass" — bottles, flask, petri rim. White-ish
      base so per-instance instanceColor tints read correctly. */
  glass: THREE.MeshStandardMaterial
  /** Fume-hood frame */
  hood: THREE.MeshStandardMaterial
  /** Lamp shade (warm, lightly emissive) */
  lampShade: THREE.MeshStandardMaterial
  /** Emissive lamp bulb / glow disc */
  glow: THREE.MeshStandardMaterial
  /** Exit sign — emissive green-teal */
  exitSign: THREE.MeshStandardMaterial
  /** Station accents (match the Phase-1 echo language) */
  accentCyan: THREE.MeshStandardMaterial
  accentCoral: THREE.MeshStandardMaterial
  accentYellow: THREE.MeshStandardMaterial
  accentBlue: THREE.MeshStandardMaterial
  /** Liquids — accent colours, near-opaque */
  liquidBlue: THREE.MeshStandardMaterial
  liquidCyan: THREE.MeshStandardMaterial
}

export function useLabMaterials(palette: PlayPalette): LabMaterials {
  const materials = useMemo<LabMaterials>(() => {
    const make = (
      color: THREE.Color | string,
      opts: Partial<THREE.MeshStandardMaterialParameters> = {},
    ) =>
      new THREE.MeshStandardMaterial({
        color: color instanceof THREE.Color ? color : new THREE.Color(color),
        roughness: 0.85,
        metalness: 0.05,
        transparent: true,
        ...opts,
      })

    // Green-teal exit glow, mixed from palette (no green token exists).
    const exitGreen = mixColor(palette.cyan, palette.yellow, 0.34).lerp(
      new THREE.Color(palette.blue),
      0.12,
    )

    return {
      benchTop: make(mixColor(palette.ink, palette.surfaceRaised, 0.16), {
        roughness: 0.5,
        metalness: 0.1,
      }),
      cabinet: make(mixColor(palette.surfaceRaised, palette.ink, 0.34), { roughness: 0.8 }),
      cabinetDoor: make(mixColor(palette.surfaceRaised, palette.ink, 0.26), { roughness: 0.78 }),
      metal: make(palette.borderDefault, { roughness: 0.35, metalness: 0.6 }),
      shelf: make(mixColor(palette.surfaceRaised, palette.ink, 0.18), { roughness: 0.75 }),
      glass: make(palette.surfaceRaised, {
        roughness: 0.12,
        metalness: 0,
        opacity: 0.42,
        depthWrite: false,
      }),
      hood: make(mixColor(palette.surfaceRaised, palette.ink, 0.4), {
        roughness: 0.6,
        metalness: 0.2,
      }),
      lampShade: make(mixColor(palette.surfaceRaised, palette.yellow, 0.2), {
        roughness: 0.6,
        emissive: mixColor(palette.yellow, palette.ink, 0.3),
        emissiveIntensity: 0.35,
      }),
      glow: make(palette.yellow, {
        emissive: new THREE.Color(palette.yellow),
        emissiveIntensity: 1.4,
        roughness: 0.4,
      }),
      exitSign: make(new THREE.Color(palette.ink).lerp(exitGreen, 0.25), {
        emissive: exitGreen,
        emissiveIntensity: 1.5,
        roughness: 0.5,
      }),
      accentCyan: make(palette.cyan, { roughness: 0.55 }),
      accentCoral: make(palette.coral, { roughness: 0.55 }),
      accentYellow: make(palette.yellow, { roughness: 0.55, metalness: 0.2 }),
      accentBlue: make(palette.blue, { roughness: 0.55 }),
      liquidBlue: make(mixColor(palette.blue, palette.cyan, 0.35), {
        roughness: 0.25,
        opacity: 0.9,
      }),
      liquidCyan: make(mixColor(palette.cyan, palette.blue, 0.2), {
        roughness: 0.25,
        opacity: 0.85,
      }),
    }
  }, [palette])

  useEffect(
    () => () => {
      Object.values(materials).forEach((m) => m.dispose())
    },
    [materials],
  )

  return materials
}

/** Procedural tiled-floor texture — a single tile with a grout border,
    repeated across the floor. CanvasTexture built once per palette and
    disposed on change. Palette-driven (tile + grout colours). */
export function useTileTexture(palette: PlayPalette): THREE.CanvasTexture | null {
  const texture = useMemo<THREE.CanvasTexture | null>(() => {
    if (typeof document === 'undefined') return null
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const base = mixColor(palette.surfaceRaised, palette.ink, 0.28)
    const grout = mixColor(palette.ink, palette.surfaceRaised, 0.1)
    ctx.fillStyle = `#${base.getHexString()}`
    ctx.fillRect(0, 0, size, size)
    // Subtle sheen quadrant so tiles don't read dead-flat.
    const sheen = mixColor(palette.surfaceRaised, palette.ink, 0.2)
    ctx.fillStyle = `#${sheen.getHexString()}`
    ctx.globalAlpha = 0.35
    ctx.fillRect(size * 0.08, size * 0.08, size * 0.42, size * 0.42)
    ctx.globalAlpha = 1
    // Grout border.
    ctx.strokeStyle = `#${grout.getHexString()}`
    ctx.lineWidth = size * 0.05
    ctx.strokeRect(0, 0, size, size)

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(10, 8)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  }, [palette])

  useEffect(() => () => texture?.dispose(), [texture])

  return texture
}
