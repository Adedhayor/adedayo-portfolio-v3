// ============================================================
// LocalTime — GLOBAL. Dual clock for the footer (BRIEF §3.4 / §6,
// §11 resolved 2026-07-07): the VISITOR's own local time first,
// then Adedayo's Lagos (WAT). If the visitor is already in Lagos,
// collapses to a single reading. Ticks each minute; tabular nums.
// ============================================================
import { useEffect, useState } from 'react'

const LAGOS_TZ = 'Africa/Lagos'

function fmt(timeZone?: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    ...(timeZone ? { timeZone } : {}),
  }).format(new Date())
}

function read() {
  const visitorTz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return {
    visitor: fmt(),
    lagos: fmt(LAGOS_TZ),
    inLagos: visitorTz === LAGOS_TZ,
  }
}

export default function LocalTime({ className = '' }: { className?: string }) {
  const [t, setT] = useState(read)
  useEffect(() => {
    const tick = () => setT(read())
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className={['font-opt-mono', className].join(' ')}>
      {t.inLagos ? (
        <>Lagos {t.lagos} WAT</>
      ) : (
        <>
          Your time {t.visitor} · Lagos {t.lagos} WAT
        </>
      )}
    </span>
  )
}
