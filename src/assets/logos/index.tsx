// ============================================================
// Client logos — OFFICIAL brand assets (2026-07-15), never
// redrawn. Each SVG renders as a CSS mask filled with
// currentColor, so the strip stays monochrome and theme-aware
// regardless of the file's native fills. Entries without a src
// render as text only (no official vector collected yet).
// Sources: replikit.ai/brand · Lithium brand kit · digifigs.com
// · FOLIO _V2 exports (Vizible, Tabulerasa, Foundation HR).
// Vault copies: 08 — Portfolio/_assets/logos/.
// ============================================================
import lithium from './lithium.svg'
import vizible from './vizible.svg'
import tabulerasa from './tabulerasa.svg'
import foundationHr from './foundation-hr.svg'
import replikit from './replikit.svg'
// ?no-inline: under Vite's inline threshold, the raw data-URI breaks
// inside the CSS mask url() — force it to ship as a file instead.
import digifigs from './digifigs.svg?no-inline'

export type ClientLogo = {
  name: string
  /** official asset, used as a CSS-mask source; text-only when absent */
  src?: string
  /** rendered size in px, preserving the file's aspect ratio */
  w?: number
  h?: number
  /** show the name beside the mark (for mark-only assets) */
  showName?: boolean
}

export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'RepliKit', src: replikit, w: 105, h: 24 }, // 384×88 wordmark
  { name: 'RepliHaus' }, // text by request
  { name: 'Lithium Digital', src: lithium, w: 178, h: 24 }, // 416×56 wordmark
  { name: 'Vizible', src: vizible, w: 89, h: 24 }, // 149×40 lockup
  { name: 'Zilliqa' }, // no official vector collected yet
  { name: 'Tabulerasa', src: tabulerasa, w: 84, h: 26 }, // 103×32 lockup — bumped for optical parity
  { name: 'DigiFigs', src: digifigs, w: 19, h: 22, showName: true }, // 21×25 mark
  { name: 'Foundation HR', src: foundationHr, w: 167, h: 24 }, // 473×68 lockup
  { name: 'Westgate' }, // only a raster mark exists — text until vector lands
  { name: 'DirectTokunbo' }, // only a raster lockup exists — text until vector lands
]
