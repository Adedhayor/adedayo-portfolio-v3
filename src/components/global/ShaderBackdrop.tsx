// ============================================================
// ShaderBackdrop — GLOBAL. A subtle Paper (WebGL) mesh-gradient
// backdrop (BRIEF §3.1 / §3.4 / feedback). Absolute-fills its
// positioned parent; decorative and non-interactive. Import this
// lazily (React.lazy) so the WebGL bundle code-splits out of the
// initial load. Placeholder until the in-house effects studio lands.
// ============================================================
import { MeshGradient } from '@paper-design/shaders-react'

type Props = {
  colors: string[]
  speed?: number
  distortion?: number
  swirl?: number
  opacity?: number
  className?: string
}

export default function ShaderBackdrop({
  colors,
  speed = 0.3,
  distortion = 0.8,
  swirl = 0.5,
  opacity = 1,
  className = '',
}: Props) {
  return (
    <div
      aria-hidden="true"
      style={{ opacity }}
      className={['pointer-events-none absolute inset-0 overflow-hidden', className].join(' ')}
    >
      <MeshGradient
        colors={colors}
        speed={speed}
        distortion={distortion}
        swirl={swirl}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
