import type { CSSProperties } from 'react'
import bLogo from '@/assets/b-logo.png'

const SIGNAL_DOTS = [
  [1, 1], [1, 2], [1, 3], [1, 4],
  [2, 4], [3, 4], [4, 4], [4, 3],
  [4, 2], [4, 1], [3, 1], [2, 1],
] as const

type DotStyle = CSSProperties & {
  '--route-loader-step': number
}

export default function RouteLoader({ label = 'Loading page' }: { label?: string }) {
  return (
    <div className="route-loader" role="status" aria-live="polite" aria-atomic="true">
      <div className="route-loader__signal" aria-hidden="true">
        <img src={bLogo} alt="" className="route-loader__mark" />
        {SIGNAL_DOTS.map(([row, column], step) => (
          <span
            key={`${row}-${column}`}
            className="route-loader__dot"
            style={{
              gridRow: row,
              gridColumn: column,
              '--route-loader-step': step,
            } as DotStyle}
          />
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}
