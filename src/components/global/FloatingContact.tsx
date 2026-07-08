// ============================================================
// FloatingContact — GLOBAL (BRIEF §4.7 / feedback #16).
// The ContactWidget rides the bottom of the viewport once the
// user scrolls past the hero, then disappears when the Contact
// section scrolls into view — where the docked widget takes over.
// ============================================================
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ContactWidget } from '@/blocks/_parts'
import { profile } from '@/data'
import { dur, easeExpo } from '@/lib/motion'

export default function FloatingContact() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const contact = document.querySelector('#contact')
    let contactVisible = false
    let scrolledPastHero = false
    const update = () => setShow(scrolledPastHero && !contactVisible)

    const onScroll = () => {
      scrolledPastHero = window.scrollY > window.innerHeight * 0.6
      update()
    }
    const io = contact
      ? new IntersectionObserver(
          ([e]) => {
            contactVisible = e.isIntersecting
            update()
          },
          { rootMargin: '0px 0px -25% 0px' },
        )
      : null
    if (contact && io) io.observe(contact)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 88, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 88, opacity: 0 }}
          transition={{ duration: dur.slow, ease: easeExpo }}
          className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4"
        >
          {/* Only the pill is interactive — the full-width band must not eat
              clicks meant for the footer beneath it. */}
          <ContactWidget email={profile.email} calendly={profile.calendly} className="pointer-events-auto" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
