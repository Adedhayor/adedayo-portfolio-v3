import { useState } from 'react'
const steps = [
  { title: 'Paper', label: 'Set the direction', text: 'Explore tone and visual direction on the canvas. Make the decisions that should guide the components.' },
  { title: 'Claude', label: 'Build with AI', text: 'Translate that direction into working components, keeping the design intent close to the implementation.' },
  { title: 'Storybook', label: 'Check the behaviour', text: 'Try component states and interactions before moving them into a product.' },
  { title: 'GitHub', label: 'Use and maintain', text: 'Version the system and carry it into products. Feed what those products teach you back into the library.' },
]
export default function SystemWorkflow() {
 const [active,setActive] = useState(0)
 return <section className="container-opt pb-opt-4xl" aria-label="Inkwell workflow"><p className="label mb-5">An interactive map of the workflow</p><div className="grid border border-opt-border-default sm:grid-cols-4">{steps.map((step,index) => <button type="button" key={step.title} aria-pressed={active===index} onClick={() => setActive(index)} className={`case-step border-opt-border-subtle p-6 text-left sm:border-r ${active===index ? 'bg-opt-surface-low' : 'bg-opt-surface-raised'}`}><span className="label">0{index+1} {index<3 ? '→' : '↺'}</span><span className="mt-3 block text-opt-text-heading font-display text-2xl">{step.title}</span></button>)}</div><div className="border-x border-b border-opt-border-default p-8" aria-live="polite"><h2 className="text-opt-text-heading font-display text-2xl">{steps[active].label}</h2><p className="mt-3 max-w-[60ch] leading-relaxed text-opt-text-secondary">{steps[active].text}</p></div></section>
}
