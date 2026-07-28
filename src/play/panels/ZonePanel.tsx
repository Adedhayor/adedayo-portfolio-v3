// ============================================================
// ZonePanel — RETIRED as a component; kept as the mount point.
// Play.tsx is frozen and imports `@/play/panels/ZonePanel`, so
// this file stays put and simply re-exports the Phase-2 viewer.
// The real implementation lives in ./Lightbox.tsx (media pane +
// prev/next + CTA, plus the legacy experiment cards as text-only
// entries).
// ============================================================
export { default } from './Lightbox'
