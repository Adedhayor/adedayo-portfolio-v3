// ============================================================
// ZonePanel — OWNED BY THE GATE/HUD WORKSTREAM (E) for styling,
// focus-trap, and motion polish. Foundation version: functional
// blur-behind dialog over the canvas for panel-kind hotspots.
// ============================================================
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useSensoryUI } from '@/lib/sensory-ui'
import { usePlay } from '../PlayContext'
import { panels } from '../data/playground'
import { useHotspotAction } from '../useHotspotAction'

export default function ZonePanel() {
  const { activePanelId, closePanel } = usePlay()
  const { playSound } = useSensoryUI()
  const runAction = useHotspotAction()
  const panel = activePanelId ? panels[activePanelId] : null
  if (!panel) return null

  const close = () => {
    void playSound('overlay.close')
    closePanel()
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
      {/* Scrim — blur the world behind the dialog */}
      <button
        type="button"
        aria-label="Close panel"
        onClick={close}
        className="absolute inset-0 bg-black/20 backdrop-blur-[6px]"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={panel.heading}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-[420px] border border-opt-border-subtle bg-opt-surface-raised p-6 shadow-xl"
      >
        {panel.kicker && (
          <p className="font-opt-mono text-[11px] uppercase tracking-[0.14em] text-opt-text-secondary">
            {panel.kicker}
          </p>
        )}
        <h2 className="mt-2 font-display text-[24px] leading-tight text-opt-text-heading">
          {panel.heading}
        </h2>
        <p className="mt-3 text-[14px] leading-[1.55] text-opt-text-secondary">{panel.body}</p>
        {panel.links && panel.links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {panel.links.map((link) => (
              <button
                key={link.label}
                type="button"
                className="border border-opt-border-default px-3 py-1.5 font-opt-mono text-[11px] uppercase tracking-[0.12em] text-opt-text-heading hover:bg-opt-surface-low"
                onClick={() => {
                  closePanel()
                  runAction(link.action)
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-4 top-4 text-opt-text-secondary hover:text-opt-text-heading"
        >
          <X size={16} />
        </button>
      </motion.div>
    </div>
  )
}
