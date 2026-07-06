// ============================================================
// ProjectGrid block — "Latest Projects". Section header + a grid
// of ProjectCards + a View-all action. Content-driven.
// ============================================================
import { motion } from 'framer-motion'
import { ProjectCard } from '@/blocks/_parts'
import { Cta } from '@/blocks/_parts'
import { ArrowRight } from 'lucide-react'
import { caseStudies, type CaseStudy } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

type Props = {
  title?: string
  projects?: CaseStudy[]
  showViewAll?: boolean
  className?: string
}

export default function ProjectGrid({
  title = 'Latest Projects',
  projects = caseStudies.slice(0, 4),
  showViewAll = true,
  className = '',
}: Props) {
  return (
    <section className={['container-opt py-opt-5xl', className].join(' ')}>
      <div className="mb-opt-2xl flex items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(2rem,4.4vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading">
          {title}
        </h2>
      </div>

      <motion.div
        variants={stagger(0.08)}
        {...revealOnce}
        className="grid grid-cols-1 gap-x-6 gap-y-opt-2xl sm:grid-cols-2 lg:grid-cols-2"
      >
        {projects.map((p) => (
          <motion.div key={p.slug} variants={riseIn}>
            <ProjectCard name={p.title} type={p.tag} cover={p.cover} coverPos={p.coverPos} href={`#/work/${p.slug}`} />
          </motion.div>
        ))}
      </motion.div>

      {showViewAll && (
        <div className="mt-opt-2xl flex justify-center">
          <Cta as="a" href="#work" variant="ghost" icon={<ArrowRight size={16} />}>
            View all projects
          </Cta>
        </div>
      )}
    </section>
  )
}
