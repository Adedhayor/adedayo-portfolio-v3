// ============================================================
// CvViewer — GLOBAL. In-app résumé reader (2026-07-15): a
// full-screen overlay that renders the CV pages with pdf.js
// (lazy-loaded on first open, so it costs nothing until used —
// iframes can't render PDFs on mobile or headless browsers).
// Header strip: open in new tab / download / close. Optimus
// rules: sharp corners, ink scrim, token surfaces. ESC or scrim
// click closes; body scroll locks while open.
// ============================================================
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Download, FileText, X } from 'lucide-react'
import { profile } from '@/data'
import { dur, easeExpo } from '@/lib/motion'

const HEADER_ACTION =
  'grid size-8 cursor-pointer place-items-center rounded-none text-opt-text-secondary transition-colors duration-[var(--opt-motion-base)] hover:text-opt-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus'

type Props = { open: boolean; onClose: () => void }

export default function CvViewer({ open, onClose }: Props) {
  const pagesRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  /* ESC closes; page scroll locks behind the overlay. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  /* Render the document to canvases with pdf.js on open. */
  useEffect(() => {
    if (!open) return
    let cancelled = false
    setState('loading')
    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default
        const doc = await pdfjs.getDocument({ url: profile.resumeUrl }).promise
        const host = pagesRef.current
        if (cancelled || !host) return
        host.innerHTML = ''
        const hostWidth = host.clientWidth || 816
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i)
          const base = page.getViewport({ scale: 1 })
          // Fit the host width; oversample by devicePixelRatio for crispness.
          const scale = (hostWidth / base.width) * Math.min(window.devicePixelRatio || 1, 3)
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.width = '100%'
          canvas.style.height = 'auto'
          canvas.style.display = 'block'
          if (i > 1) canvas.style.borderTop = '1px solid var(--opt-border-subtle)'
          host.appendChild(canvas)
          if (cancelled) return
          await page.render({ canvas, viewport }).promise
        }
        if (!cancelled) setState('ready')
      } catch {
        if (!cancelled) setState('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur.base, ease: easeExpo }}
          role="dialog"
          aria-modal="true"
          aria-label="Adedayo Babalola — curriculum vitae"
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-8"
        >
          {/* Scrim — clicking it closes */}
          <button aria-label="Close CV" onClick={onClose} className="absolute inset-0 cursor-pointer bg-opt-ink/70 backdrop-blur-sm" />

          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: dur.base, ease: easeExpo }}
            className="relative flex h-full w-full max-w-[880px] flex-col overflow-hidden rounded-none border border-opt-border-default bg-opt-surface-raised"
          >
            {/* Header strip */}
            <div className="flex items-center justify-between gap-3 border-b border-opt-border-subtle px-4 py-2.5">
              <p className="inline-flex min-w-0 items-center gap-2 text-[13px] font-semibold text-opt-text-heading">
                <FileText size={14} strokeWidth={2} className="shrink-0" />
                <span className="truncate">Adedayo Babalola — CV</span>
              </p>
              <div className="flex shrink-0 items-center gap-0.5">
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" aria-label="Open CV in a new tab" className={HEADER_ACTION}>
                  <ArrowUpRight size={15} strokeWidth={2} />
                </a>
                <a href={profile.resumeUrl} download="Adedayo-Babalola-CV.pdf" aria-label="Download CV" className={HEADER_ACTION}>
                  <Download size={15} strokeWidth={2} />
                </a>
                <button onClick={onClose} aria-label="Close CV" className={HEADER_ACTION}>
                  <X size={15} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* The document — pdf.js canvases, scrollable */}
            <div className="relative flex-1 overflow-y-auto bg-opt-surface-low">
              {state === 'loading' && (
                <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[13px] text-opt-text-secondary">
                  Loading the CV…
                </p>
              )}
              {state === 'error' && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
                  <p className="text-[13px] text-opt-text-secondary">The in-app reader couldn’t load this document.</p>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-opt-text-heading"
                  >
                    Open the PDF directly <ArrowUpRight size={13} strokeWidth={2.5} />
                  </a>
                </div>
              )}
              <div ref={pagesRef} className="mx-auto max-w-[816px] shadow-sm" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
