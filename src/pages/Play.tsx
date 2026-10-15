import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
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
    mark: '↗',
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
          <Link
            to="/play/world"
            className="yard-feature group relative grid min-h-[360px] overflow-hidden border border-[#6d5747] bg-[#201d1d] text-[#fff8ec] md:col-span-2 md:grid-cols-[1.15fr_0.85fr]"
          >
            <div aria-hidden="true" className="yard-feature-art relative min-h-[280px] overflow-hidden">
              <span className="yard-feature-orbit yard-feature-orbit-a" />
              <span className="yard-feature-orbit yard-feature-orbit-b" />
              <span className="yard-feature-core" />
            </div>
            <div className="relative flex flex-col justify-end border-t border-white/15 p-8 md:border-t-0 md:border-l md:p-10">
              <h2 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-none">The Yard.</h2>
              <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-[#fff8ec]/75">
                An explorable Three.js field where the practice gets stranger, more tactile, and more playful.
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                Enter the field <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

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
