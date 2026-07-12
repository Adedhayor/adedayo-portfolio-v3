// ============================================================
// FloatingContact → ChatWidget — GLOBAL (feedback #11, renamed
// Optimus in round E). A scripted chat box (inspiration:
// seanhalpin.xyz's Seán Bot). A square glass launcher bottom-right opens a chat
// panel with agent bubbles + quick-reply buttons; replies append
// the exchange, some with actions (book a call / email / see work).
// No backend — a friendly, on-brand front door. Optimus rules:
// sharp corners, Ink/Paper bubbles, glass surface, mono meta.
// ============================================================
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MessageSquare, X, Calendar, Mail, ArrowRight, Music, Sparkles, Camera, BookOpen, User } from 'lucide-react'
import { now, profile } from '@/data'
import { dur, easeExpo } from '@/lib/motion'
import bLogo from '@/assets/b-logo.png'

type Action = { label: string; href?: string; to?: string; icon: typeof Mail }
type Msg = { from: 'agent' | 'user'; text: string; actions?: Action[] }

const INTRO: Msg[] = [
  { from: 'agent', text: 'Hey 👋' },
  { from: 'agent', text: 'I’m Optimus — Adedayo’s alter ego. His design system is named after me.' },
  { from: 'agent', text: 'What brings you here today?' },
]

/* Surprise pool — "Surprise me" grabs one of these at random
   (round F #9): a case study, IG, the playlist, Substack, about,
   the playground… anything fun. */
const SURPRISES: Msg[] = [
  {
    from: 'agent',
    text: 'Dealer’s choice: the playground — shaders, sound, generative experiments.',
    actions: [{ label: 'Enter the playground', to: '/play', icon: Sparkles }],
  },
  {
    from: 'agent',
    text: 'Random pick: he shoots photos too — streets, people, random beauty.',
    actions: [{ label: 'optimus.randoms', href: profile.instagramPhotography, icon: Camera }],
  },
  {
    from: 'agent',
    text: 'Here’s what’s on repeat right now — Wizkid, Cruel Santino, Tems.',
    actions: [{ label: 'On repeat', href: now.listening.playlistUrl, icon: Music }],
  },
  {
    from: 'agent',
    text: 'Plot twist: he writes essays. This one’s a birthday letter to his mum.',
    actions: [{ label: 'Read on Notes', to: '/notes/for-my-27th-i-write-to-my-mum', icon: BookOpen }],
  },
  {
    from: 'agent',
    text: 'How about the story of this very site? Designed by him, built with Claude Code.',
    actions: [{ label: 'Building this portfolio', to: '/case-study/building-this-portfolio', icon: ArrowRight }],
  },
  {
    from: 'agent',
    text: 'Meet the human behind the pixels — engineer turned designer who ships.',
    actions: [{ label: 'About Adedayo', to: '/about', icon: User }],
  },
  {
    from: 'agent',
    text: 'Straight to the good stuff: a $5M+ staking platform, designed end to end.',
    actions: [{ label: 'Lithium staking', to: '/case-study/lithium-staking', icon: ArrowRight }],
  },
]

/* Quick replies → the scripted agent response for each. */
const REPLIES: { label: string; reply: Msg | (() => Msg) }[] = [
  {
    label: 'We’d like to hire you',
    reply: {
      from: 'agent',
      text: 'Love that. The fastest way in is a quick call — or just email me the details.',
      actions: [
        { label: 'Book a call', href: profile.calendly, icon: Calendar },
        { label: 'Email', href: `mailto:${profile.email}`, icon: Mail },
      ],
    },
  },
  {
    label: 'Show me the best work',
    reply: {
      from: 'agent',
      text: 'Start with the design-system work — the Property Panel redesign and Inkwell.',
      actions: [
        { label: 'Property Panel', to: '/case-study/property-panel', icon: ArrowRight },
        { label: 'Inkwell', to: '/case-study/inkwell', icon: ArrowRight },
      ],
    },
  },
  {
    label: 'Just saying hello!',
    reply: {
      from: 'agent',
      text: 'Hello! Thanks for stopping by 😄 Hope you enjoy the work.',
    },
  },
  {
    label: 'Surprise me ✨',
    reply: () => SURPRISES[Math.floor(Math.random() * SURPRISES.length)],
  },
  {
    label: 'What’s he listening to?',
    reply: {
      from: 'agent',
      text: 'Heavy rotation right now: Wizkid, Cruel Santino, Tems. The whole playlist is public —',
      actions: [{ label: 'On repeat', href: now.listening.playlistUrl, icon: Music }],
    },
  },
  {
    label: 'Got photos?',
    reply: {
      from: 'agent',
      text: 'He shoots too — streets, people, random beauty. That side lives on Instagram.',
      actions: [{ label: 'optimus.randoms', href: profile.instagramPhotography, icon: Camera }],
    },
  },
]

function Bubble({ m }: { m: Msg }) {
  const isAgent = m.from === 'agent'
  return (
    <div className={['flex', isAgent ? 'justify-start' : 'justify-end'].join(' ')}>
      <div
        className={[
          'max-w-[80%] px-3.5 py-2.5 text-[14px] leading-[1.45]',
          isAgent
            ? 'border border-opt-border-subtle bg-opt-surface-low text-opt-text-primary'
            : 'bg-opt-ink text-opt-paper',
        ].join(' ')}
      >
        {m.text}
        {m.actions && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {m.actions.map((a) =>
              a.to ? (
                <Link
                  key={a.label}
                  to={a.to}
                  className="inline-flex items-center gap-1 border border-opt-border-default bg-opt-surface-raised px-2.5 py-1.5 text-[12px] font-medium text-opt-text-heading transition-colors hover:border-opt-border-focus/40"
                >
                  <a.icon size={12} strokeWidth={2.5} /> {a.label}
                </Link>
              ) : (
                <a
                  key={a.label}
                  href={a.href}
                  target={a.href?.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 border border-opt-border-default bg-opt-surface-raised px-2.5 py-1.5 text-[12px] font-medium text-opt-text-heading transition-colors hover:border-opt-border-focus/40"
                >
                  <a.icon size={12} strokeWidth={2.5} /> {a.label}
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function FloatingContact() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>(INTRO)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep the transcript pinned to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, open])

  // Escape closes the panel (keyboard parity with the close button).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const send = (r: (typeof REPLIES)[number]) => {
    const reply = typeof r.reply === 'function' ? r.reply() : r.reply
    setMsgs((m) => [...m, { from: 'user', text: r.label }, reply])
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: dur.base, ease: easeExpo }}
            className="glass pointer-events-auto flex h-[26rem] w-[min(88vw,22rem)] flex-col overflow-hidden rounded-none"
            role="dialog"
            aria-label="Chat with Optimus"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-opt-border-subtle px-4 py-3">
              <img src={bLogo} alt="" className="size-7 rounded-none" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-opt-text-heading">Optimus</p>
                <p className="flex items-center gap-1.5 text-[11px] text-opt-text-secondary">
                  <span className="size-1.5 bg-opt-accent-lime-fill" aria-hidden="true" /> Usually replies instantly
                </p>
              </div>
              <button
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-none text-opt-text-secondary transition-colors hover:text-opt-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
              >
                <X size={15} />
              </button>
            </div>

            {/* Transcript */}
            <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}
            </div>

            {/* Quick replies */}
            <div className="flex flex-wrap gap-1.5 border-t border-opt-border-subtle p-3">
              {REPLIES.map((r) => (
                <button
                  key={r.label}
                  onClick={() => send(r)}
                  className="cursor-pointer border border-opt-border-default bg-opt-surface-raised px-2.5 py-1.5 text-[12px] font-medium text-opt-text-primary transition-colors hover:border-opt-border-focus/40 hover:text-opt-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <button
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="glass pointer-events-auto flex h-12 cursor-pointer items-center gap-2 rounded-none px-4 text-opt-text-heading transition-colors [transition-timing-function:var(--opt-easing-expo)] hover:border-opt-border-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
      >
        {open ? <X size={17} /> : <MessageSquare size={17} />}
        <span className="text-[13px] font-semibold">{open ? 'Close' : 'Chat'}</span>
      </button>
    </div>
  )
}
