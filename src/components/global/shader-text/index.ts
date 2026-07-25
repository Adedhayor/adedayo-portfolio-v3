// ============================================================
// Wordmark finish registry. Each entry is a self-contained WebGL2
// shader (see types.ts). The six liquid-metal entries share one
// shader with different palettes; Aurora is a distinct shader
// (FoldGradient) — the first of what can be several. The footer
// easter egg cycles this array in order.
// ============================================================
import type { Finish } from './types'
import { liquidMetalFinish } from './liquidMetal'
import { foldGradientFinish } from './foldGradient'

export type { Finish }
export { default as ShaderText } from './ShaderText'

export const FINISHES: Finish[] = [
  liquidMetalFinish('chromatic-chrome', 'Chromatic chrome', 'chrome'),
  liquidMetalFinish('chromatic-gold', 'Chromatic gold', 'gold'),
  liquidMetalFinish('chromatic-holo', 'Chromatic holo', 'holo'),
  liquidMetalFinish('chromatic-molten', 'Molten', 'molten'),
  liquidMetalFinish('chromatic-aqua', 'Aqua', 'aqua'),
  liquidMetalFinish('chromatic-oilslick', 'Oil slick', 'oilslick'),
  foldGradientFinish,
]
