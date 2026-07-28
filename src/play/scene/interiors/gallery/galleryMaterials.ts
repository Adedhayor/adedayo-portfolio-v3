// ============================================================
// Gallery materials — W2 (Wall of Arts). Local, palette-driven
// material set for the room + frames (materials.ts is owned by a
// sibling and read-only, so these live here). Memoized per palette
// and disposed on change / unmount, StrictMode-safe.
//
// NOTE: this Canvas has no environment map, so metalness is kept
// low — a high-metalness material with no IBL renders near-black.
// Frames read as metal via roughness + spotlight highlights.
// ============================================================
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import { mixColor } from '../../materials'
import { makePlankTexture } from './textures'

export type GalleryMaterials = {
  floor: THREE.MeshStandardMaterial
  wall: THREE.MeshStandardMaterial
  wallFar: THREE.MeshStandardMaterial
  ceiling: THREE.MeshStandardMaterial
  rail: THREE.MeshStandardMaterial
  skirt: THREE.MeshStandardMaterial
  mat: THREE.MeshStandardMaterial
  frameMetal: THREE.MeshStandardMaterial
  frameBox: THREE.MeshStandardMaterial
  frameClassic: THREE.MeshStandardMaterial
  doorFrame: THREE.MeshStandardMaterial
  doorPanel: THREE.MeshStandardMaterial
}

export function useGalleryMaterials(palette: PlayPalette): GalleryMaterials {
  const { materials, plank } = useMemo(() => {
    const std = (
      color: THREE.Color | string,
      opts: Partial<THREE.MeshStandardMaterialParameters> = {},
    ) =>
      new THREE.MeshStandardMaterial({
        color: color instanceof THREE.Color ? color : new THREE.Color(color),
        roughness: 0.85,
        metalness: 0.04,
        ...opts,
      })

    const ink = new THREE.Color(palette.ink)
    const gold = new THREE.Color(palette.yellow)
      .lerp(new THREE.Color(palette.coral), 0.4)
      .lerp(ink, 0.32)

    const plank = makePlankTexture(palette)

    const materials: GalleryMaterials = {
      // white base so the plank texture reads true
      floor: std('#ffffff', { map: plank, roughness: 0.72, metalness: 0.02 }),
      wall: std(mixColor(palette.surfaceRaised, palette.ink, 0.3), { roughness: 0.96 }),
      wallFar: std(mixColor(palette.surfaceRaised, palette.ink, 0.36), { roughness: 0.96 }),
      ceiling: std(mixColor(palette.ink, palette.blue, 0.1), { roughness: 1 }),
      rail: std(mixColor(palette.coral, palette.ink, 0.5), { roughness: 0.66, metalness: 0.12 }),
      skirt: std(mixColor(palette.coral, palette.ink, 0.6), { roughness: 0.82 }),
      mat: std(mixColor(palette.surfaceRaised, palette.ink, 0.05), { roughness: 0.9 }),
      frameMetal: std(mixColor(palette.borderDefault, palette.ink, 0.28), {
        roughness: 0.34,
        metalness: 0.3,
      }),
      frameBox: std(mixColor(palette.ink, palette.surfaceBase, 0.1), {
        roughness: 0.86,
        metalness: 0,
      }),
      frameClassic: std(gold, { roughness: 0.5, metalness: 0.25 }),
      doorFrame: std(mixColor(palette.coral, palette.ink, 0.46), { roughness: 0.8 }),
      doorPanel: std(mixColor(palette.ink, palette.blue, 0.14), { roughness: 0.95 }),
    }
    return { materials, plank }
  }, [palette])

  useEffect(
    () => () => {
      Object.values(materials).forEach((m) => m.dispose())
      plank.dispose()
    },
    [materials, plank],
  )

  return materials
}
