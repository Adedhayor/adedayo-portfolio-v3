// ============================================================
// Client logos — ORIGINAL monochrome wordmark treatments.
// These are placeholder marks (currentColor, theme-aware) — swap
// for official brand assets when available. Not reproductions of
// any trademarked logo; each mark is an original geometric glyph.
// ============================================================
import type { SVGProps, ReactElement } from 'react'

type MarkProps = SVGProps<SVGSVGElement>

function Mark({ children, ...p }: MarkProps & { children: React.ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true" {...p}>
      {children}
    </svg>
  )
}

// Lithium — stacked energy bars in a hex
const LithiumMark = (p: MarkProps) => (
  <Mark {...p}>
    <path d="M12 2 21 7v10l-9 5-9-5V7z" />
    <path d="M9 10h6M9 13h6" />
  </Mark>
)
// Vizible — an aperture/eye
const VizibleMark = (p: MarkProps) => (
  <Mark {...p}>
    <path d="M2 12 12 4l10 8-10 8z" />
    <path d="M9 12h6" />
  </Mark>
)
// Zilliqa — angular Z in a frame
const ZilliqaMark = (p: MarkProps) => (
  <Mark {...p}>
    <path d="M4 4h16v16H4z" />
    <path d="M8 8h8l-8 8h8" />
  </Mark>
)
// Tabulera — a data grid
const TabuleraMark = (p: MarkProps) => (
  <Mark {...p}>
    <path d="M3 4h18v16H3z" />
    <path d="M3 10h18M3 15h18M9 4v16" />
  </Mark>
)
// RepliHaus — a gabled frame (house)
const RepliHausMark = (p: MarkProps) => (
  <Mark {...p}>
    <path d="M4 10 12 3l8 7v11H4z" />
    <path d="M10 21v-6h4v6" />
  </Mark>
)

export type ClientLogo = { name: string; Mark: (p: MarkProps) => ReactElement }

export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'Lithium', Mark: LithiumMark },
  { name: 'Vizible', Mark: VizibleMark },
  { name: 'Zilliqa', Mark: ZilliqaMark },
  { name: 'Tabulera', Mark: TabuleraMark },
  { name: 'RepliHaus', Mark: RepliHausMark },
]
