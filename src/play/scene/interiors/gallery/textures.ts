// ============================================================
// Gallery canvas textures — W2 (Wall of Arts).
// Procedural, palette-driven CanvasTextures: wood-plank floor,
// gallery caption plaques (title · tag), and the EXIT sign.
// Callers memoize per palette and dispose on unmount/change —
// none of these are created per frame.
// ============================================================
import * as THREE from 'three'
import type { PlayPalette } from '../../../hooks/usePlayColors'

const hex = (c: THREE.Color) => `#${c.getHexString()}`

/** Warm exit-sign glow — the palette has no green token, so a
    cyan→yellow blend leans it toward the classic emergency green
    while staying theme-safe. Shared by the sign texture + its lamp. */
export function exitGlowColor(palette: PlayPalette): THREE.Color {
  return new THREE.Color(palette.cyan).lerp(new THREE.Color(palette.yellow), 0.32)
}

/** Wood-plank floor. Vertical planks with per-board tonal variation,
    grain streaks and dark seams; tiled 3× so the boards read at scale. */
export function makePlankTexture(palette: PlayPalette): THREE.CanvasTexture {
  const S = 512
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!
  const ink = new THREE.Color(palette.ink)
  const wood = (t: number) => new THREE.Color(palette.coral).lerp(ink, t)

  ctx.fillStyle = hex(wood(0.55))
  ctx.fillRect(0, 0, S, S)

  const planks = 5
  const pw = S / planks
  for (let i = 0; i < planks; i++) {
    const shade = 0.5 + ((i * 37) % 5) / 5 * 0.12 // 0.50 .. 0.62, deterministic-ish
    const board = wood(shade)
    ctx.fillStyle = hex(board)
    ctx.fillRect(i * pw, 0, pw, S)

    // faint lengthwise grain
    ctx.strokeStyle = hex(board.clone().lerp(ink, 0.14))
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.22
    for (let g = 0; g < 6; g++) {
      const gx = i * pw + 6 + Math.random() * (pw - 12)
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.lineTo(gx + (Math.random() * 8 - 4), S)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // dark seam between boards
    ctx.fillStyle = hex(wood(0.8))
    ctx.fillRect(i * pw, 0, 2, S)
  }

  // a couple of board-end joints
  ctx.fillStyle = hex(wood(0.74))
  ctx.fillRect(0, Math.round(S * 0.5), S, 2)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  tex.anisotropy = 4
  return tex
}

/** Small gallery label plaque: bold title over a mono uppercase tag. */
export function makeLabelTexture(title: string, tag: string, palette: PlayPalette): THREE.CanvasTexture {
  const W = 460
  const H = 168
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = hex(new THREE.Color(palette.surfaceRaised))
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = hex(new THREE.Color(palette.borderDefault))
  ctx.lineWidth = 3
  ctx.strokeRect(1.5, 1.5, W - 3, H - 3)

  const pad = 28
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = hex(new THREE.Color(palette.textHeading))
  ctx.font = '600 46px system-ui, -apple-system, sans-serif'
  ctx.fillText(title, pad, 76)
  ctx.fillStyle = hex(new THREE.Color(palette.textSecondary))
  ctx.font = '28px ui-monospace, SFMono-Regular, Menlo, monospace'
  ctx.fillText(tag.toUpperCase(), pad, 128)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** Illuminated EXIT sign face — bright glow letters on a dark plate. */
export function makeExitTexture(palette: PlayPalette): THREE.CanvasTexture {
  const W = 320
  const H = 150
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const glow = exitGlowColor(palette)
  const plate = new THREE.Color(palette.ink).lerp(glow, 0.06)

  ctx.fillStyle = hex(plate)
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = hex(glow)
  ctx.lineWidth = 6
  ctx.strokeRect(5, 5, W - 10, H - 10)
  ctx.fillStyle = hex(glow)
  ctx.font = '700 92px system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('EXIT', W / 2, H / 2 + 6)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}
