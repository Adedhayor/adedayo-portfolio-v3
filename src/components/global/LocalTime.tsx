// ============================================================
// LocalTime — GLOBAL. Live Lagos (WAT) clock for the footer
// (BRIEF §3.4 / §6). Ticks once a minute; tabular numerals.
// ============================================================
import { useEffect, useState } from 'react'

function lagosTime() {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Lagos',
  }).format(new Date())
}

export default function LocalTime({ className = '' }: { className?: string }) {
  const [time, setTime] = useState(lagosTime)
  useEffect(() => {
    const tick = () => setTime(lagosTime())
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className={['font-opt-mono', className].join(' ')}>
      Lagos {time} WAT
    </span>
  )
}
