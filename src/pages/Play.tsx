import { ArrowUpRight } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'

const experiments = [
  {
    title: 'Bayse',
    type: 'Prediction markets · Interface exploration',
    description: 'A redesign exploring how prediction markets present choices, prices, and possibilities.',
    url: 'https://v0-bayse-prediction-market-redesign.vercel.app/',
    className: 'yard-bayse',
    mark: <ArrowUpRight aria-hidden="true" size={128} strokeWidth={1.1} />,
    caption: 'What happens next?',
  },
  {
    title: 'Effects Studio',
    type: 'Motion · Visuals · Sound',
    description: 'A studio for exploring shaders, patterns, and the sound of an interface.',
    url: 'https://effects-studio.adedayobabalola.com/?tab=sounds',
    className: 'yard-effects',
    mark: '◉',
    caption: 'See it. Hear it. Adjust it.',
  },
  {
    title: 'DirecTokunbo',
    type: 'Automotive marketplace · Live build',
    description: 'A clearer way to browse and source quality vehicles from China for Nigerian buyers.',
    url: 'https://directokunbo.adedayobabalola.com/',
    className: 'yard-directokunbo',
    mark: 'D',
    caption: 'Source with confidence.',
  },
]

type Experiment = (typeof experiments)[number]

function ExperimentBody({ item, index }: { item: Experiment; index: number }) {
  return (
    <>
      <div aria-hidden="true" className={`yard-art ${item.className}`}>
        <span className="yard-mark">{item.mark}</span>
        <span className="yard-caption">{item.caption}</span>
      </div>
      <div className="p-6">
        <p className="text-xs text-opt-text-secondary">0{index + 1} / {item.type}</p>
        <h2 className="mt-3 flex justify-between gap-3 font-display text-2xl text-opt-text-heading">
          {item.title}
          <ArrowUpRight size={20} aria-hidden="true" />
        </h2>
        <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-opt-text-secondary">{item.description}</p>
        <span className="mt-5 inline-block text-xs font-semibold">Open experiment ↗</span>
      </div>
    </>
  )
}

export default function Play() {
  return (
    <div className="min-h-screen">
      <PageFrame />
      <NavIsland />
      <main data-section="Play" className="container-opt relative z-[1] pt-40 pb-opt-5xl">
        <h1 className="font-display text-[clamp(3rem,7vw,5rem)] leading-none text-opt-text-heading">Playground.</h1>
        <p className="mt-5 max-w-[48ch] text-lg text-opt-text-secondary">
          Small experiments, live builds, and things made to figure something out. Come in. Try something.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {experiments.map((item, index) => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="yard-card group overflow-hidden border border-opt-border-subtle bg-opt-surface-raised"
            >
              <ExperimentBody item={item} index={index} />
            </a>
          ))}
        </div>
      </main>
      <FooterWordmark />
    </div>
  )
}
