// ============================================================
// Contact block — responsive. Left: heading + direct channels
// (email · WhatsApp · call · LinkedIn). Right: a working form that
// composes an email via mailto (feedback B#6 — it now actually
// reaches Adedayo; no silent scaffold). Stacks < 900px.
// ============================================================
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Calendar, Link2, ArrowUpRight } from 'lucide-react'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { profile } from '@/data'
import { riseIn, stagger, revealOnce } from '@/lib/motion'

type Props = {
  title?: string
  lead?: string
  email?: string
  calendly?: string
  className?: string
}

type Channel = { label: string; href: string; Icon: typeof Mail }

export default function Contact({
  title = 'Let’s build something clear.',
  lead = 'Tell me about the product, the problem, or the deadline — the form below emails me directly, or reach me on any channel.',
  email = profile.email,
  calendly = profile.calendly,
  className = '',
}: Props) {
  const [form, setForm] = useState({ name: '', email: '', company: '', project: '' })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = `Portfolio enquiry${form.name ? ` — ${form.name}` : ''}`
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.company ? `Company: ${form.company}` : '',
      '',
      form.project,
    ]
      .filter((l) => l !== '')
      .join('\n')
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const channels: Channel[] = [
    { label: 'Email', href: `mailto:${email}`, Icon: Mail },
    ...(profile.whatsapp
      ? [{ label: 'WhatsApp', href: `https://wa.me/${profile.whatsapp}`, Icon: MessageCircle } as Channel]
      : []),
    { label: 'Book a call', href: calendly, Icon: Calendar },
    { label: 'LinkedIn', href: profile.linkedin, Icon: Link2 },
  ]

  return (
    <section id="contact" className={['container-opt py-opt-6xl', className].join(' ')}>
      <motion.div
        variants={stagger(0.08)}
        {...revealOnce}
        className="grid grid-cols-1 gap-opt-4xl lg:grid-cols-2 lg:gap-opt-2xl"
      >
        {/* Left — intro + direct channels */}
        <motion.div variants={riseIn}>
          <h2 className="font-display text-[clamp(2rem,5vw,var(--opt-font-size-h2))] leading-[1.04] text-opt-text-heading">
            {title}
          </h2>
          <p className="mt-4 max-w-[42ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary">
            {lead}
          </p>
          <div className="mt-opt-2xl flex flex-col gap-2.5">
            {channels.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer"
                className="group inline-flex w-fit items-center gap-3 text-[15px] text-opt-text-primary transition-colors hover:text-opt-text-heading"
              >
                <span className="grid size-9 shrink-0 place-items-center border border-opt-border-default bg-opt-surface-raised text-opt-text-secondary transition-colors group-hover:border-opt-border-focus/40 group-hover:text-opt-text-heading">
                  <Icon size={16} />
                </span>
                {label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right — working form (composes an email via mailto) */}
        <motion.form variants={riseIn} onSubmit={onSubmit} className="flex flex-col gap-opt-lg">
          <div className="grid grid-cols-1 gap-opt-lg sm:grid-cols-2">
            <FormField label="Name">
              <Input placeholder="Your name" value={form.name} onChange={set('name')} />
            </FormField>
            <FormField label="Email">
              <Input type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} />
            </FormField>
          </div>
          <FormField label="Company" help="Optional">
            <Input placeholder="Where you work" value={form.company} onChange={set('company')} />
          </FormField>
          <FormField label="Project">
            <Input placeholder="A sentence on what you need" value={form.project} onChange={set('project')} />
          </FormField>
          <div className="pt-opt-sm">
            <Button
              type="submit"
              variant="primary"
              trailingIcon={<ArrowUpRight size={14} strokeWidth={2.5} />}
              className="w-full sm:w-auto"
            >
              Send message
            </Button>
          </div>
        </motion.form>
      </motion.div>
    </section>
  )
}
