// ============================================================
// Wordmark finish registry. Each entry is a self-contained WebGL2
// shader (see types.ts). Nine families now: hand-rolled liquid-metal
// bands (three palettes), FoldGradient satin light-sheets (Aurora /
// Ember / Nebula), and six finishes ported from the
// @paper-design/shaders library — Prism (MeshGradient), Mercury
// (LiquidMetal), Plasma (Warp), Quartz (Voronoi), Vapor (SmokeRing),
// Tide (Waves), Litho (HalftoneDots), and Frost (loosely, FlutedGlass)
// — which is what tips the set from "mostly metal" toward a real mix
// of materials: liquid, satin, mesh, energy, crystal, smoke, water,
// print, and glass. The footer easter egg cycles this array at
// random.
// ============================================================
import type { Finish } from './types'
import { liquidMetalFinish } from './liquidMetal'
import { auroraFinish, emberFinish, nebulaFinish } from './foldGradient'
import { prismFinish } from './meshGradientLib'
import { mercuryFinish } from './liquidMetalLib'
import { plasmaFinish } from './warpLib'
import { quartzFinish } from './voronoiLib'
import { vaporFinish } from './smokeRingLib'
import { tideFinish } from './wavesLib'
import { lithoFinish } from './halftoneDotsLib'
import { frostFinish } from './flutedGlassLib'

export type { Finish }
export { default as ShaderText } from './ShaderText'

// Metal (hand-rolled + library) + paper-shader + library-material
// finishes. The easter egg picks from these at random
// (FooterWordmark), so order is not meaningful.
export const FINISHES: Finish[] = [
  liquidMetalFinish('chromatic-chrome', 'Chromatic chrome', 'chrome'),
  liquidMetalFinish('chromatic-gold', 'Chromatic gold', 'gold'),
  liquidMetalFinish('chromatic-holo', 'Chromatic holo', 'holo'),
  mercuryFinish,
  auroraFinish,
  emberFinish,
  nebulaFinish,
  prismFinish,
  plasmaFinish,
  quartzFinish,
  vaporFinish,
  tideFinish,
  lithoFinish,
  frostFinish,
]
