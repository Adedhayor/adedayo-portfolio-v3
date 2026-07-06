// ============================================================
// TestimonialBand block — a big quote on a recessed surface.
// Wraps the Testimonial atom with section rhythm.
// ============================================================
import { motion } from 'framer-motion'
import { Quote } from '@/blocks/_parts'
import { riseIn, revealOnce } from '@/lib/motion'

type Props = {
  quote?: string
  name?: string
  role?: string
  avatar?: string
  className?: string
}

export default function TestimonialBand({
  quote = 'Working with Adedayo felt like gaining a design partner who truly understood our vision — he found the clarity in scope I could only have imagined.',
  name = 'Thomas Kelso',
  role = 'Founder, KYMA',
  avatar,
  className = '',
}: Props) {
  return (
    <section className={['bg-opt-surface-low', className].join(' ')}>
      <div className="container-opt py-opt-6xl">
        <motion.div variants={riseIn} {...revealOnce} className="mx-auto max-w-[52ch] text-center">
          <Quote quote={quote} name={name} role={role} avatar={avatar} className="mx-auto text-center" />
        </motion.div>
      </div>
    </section>
  )
}
