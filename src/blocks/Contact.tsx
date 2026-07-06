// ============================================================
// Contact block — responsive. Left: heading + widget. Right: form
// built from the ported Optimus FormField + Input. Stacks < 900px.
// Scaffold — copy/handlers wired later.
// ============================================================
import { motion } from 'framer-motion'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Cta } from '@/blocks/_parts'
import { ContactWidget } from '@/blocks/_parts'
import { ArrowUpRight } from 'lucide-react'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

type Props = {
  eyebrow?: string
  title?: string
  lead?: string
  email?: string
  calendly?: string
  className?: string
}

export default function Contact({
  eyebrow = 'Contact',
  title = 'Let’s build something clear.',
  lead = 'Tell me about the product, the problem, or the deadline. I read every message.',
  email = 'dayo@replikit.ai',
  calendly = 'https://calendly.com/adedayobabalola/30min',
  className = '',
}: Props) {
  return (
    <section id="contact" className={['container-opt py-opt-6xl', className].join(' ')}>
      <motion.div
        variants={stagger(0.08)}
        {...revealOnce}
        className="grid grid-cols-1 gap-opt-4xl lg:grid-cols-2 lg:gap-opt-2xl"
      >
        {/* Left — intro + widget */}
        <motion.div variants={riseIn}>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading">
            {title}
          </h2>
          <p className="mt-4 max-w-[42ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary">
            {lead}
          </p>
          <div className="mt-opt-2xl">
            <ContactWidget email={email} calendly={calendly} />
          </div>
        </motion.div>

        {/* Right — form (scaffold) */}
        <motion.form
          variants={riseIn}
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-opt-lg"
        >
          <div className="grid grid-cols-1 gap-opt-lg sm:grid-cols-2">
            <FormField label="Name">
              <Input placeholder="Your name" />
            </FormField>
            <FormField label="Email">
              <Input type="email" placeholder="you@company.com" />
            </FormField>
          </div>
          <FormField label="Company" help="Optional">
            <Input placeholder="Where you work" />
          </FormField>
          <FormField label="Project">
            <Input placeholder="A sentence on what you need" />
          </FormField>
          <div className="pt-opt-sm">
            <Cta type="submit" variant="solid" caps icon={<ArrowUpRight size={15} />} className="w-full sm:w-auto">
              Send message
            </Cta>
          </div>
        </motion.form>
      </motion.div>
    </section>
  )
}
