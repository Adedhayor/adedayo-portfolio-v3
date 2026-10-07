import { useState } from 'react'
import type { CaseDetail } from '@/data'

/** A compact, keyboard-native walkthrough of the actual project artefacts. */
export default function CaseJourney({ detail }: { detail: CaseDetail }) {
  const frames = detail.sections.flatMap(section => section.figure ? [{ ...section.figure, heading: section.heading }] : [])
  const [selected, setSelected] = useState(0)
  if (frames.length < 2) return null
  const frame = frames[selected] ?? frames[0]
  return <section className="container-opt pb-opt-4xl" aria-label="Visual project walkthrough">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="label">Explore the work</p><h2 className="mt-2 text-opt-text-heading font-display text-3xl">A closer look.</h2></div><p className="text-sm text-opt-text-secondary">{selected+1} / {frames.length}</p></div>
    <div className="grid overflow-hidden border border-opt-border-subtle bg-opt-surface-raised lg:grid-cols-[260px_1fr]">
      <div className="flex flex-col border-b border-opt-border-subtle lg:border-r lg:border-b-0" aria-label="Choose a project view">{frames.map((item,index) => <button key={item.src} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`case-step p-5 text-left ${selected === index ? 'bg-opt-surface-low text-opt-text-heading' : 'text-opt-text-secondary'}`}><span className="mr-3 font-mono text-xs">0{index+1}</span>{item.heading}</button>)}</div>
      <figure className="p-4 md:p-6"><a href={frame.src} target="_blank" rel="noreferrer" aria-label={`Open full-size image: ${frame.caption}`}><img src={frame.src} alt={frame.caption} className="aspect-[16/10] w-full object-contain" /></a><figcaption className="mt-4 text-sm text-opt-text-secondary" aria-live="polite">{frame.caption} <span className="text-xs">Open image to inspect ↗</span></figcaption></figure>
    </div>
  </section>
}
