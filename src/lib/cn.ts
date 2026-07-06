import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Mirrors src/styles/tokens.css @theme inline. Keep in sync.
// Without this, tailwind-merge can't distinguish text-opt-md (font-size) from
// text-opt-neutral-0 (color) and strips one — silently breaking the design system.

const RK_FONT_SIZES = [
  "opt-xs", "opt-sm", "opt-md", "opt-lg", "opt-xl", "opt-2xl",
  // Optimus editorial display scale
  "opt-body", "opt-lead", "opt-h3", "opt-h2", "opt-h1", "opt-display",
];
const RK_FONT_WEIGHTS = ["opt-regular", "opt-medium", "opt-semibold"];
const RK_FONT_FAMILIES = ["opt-sans", "opt-mono", "opt-display"];
const RK_RADII = ["opt-sm", "opt-md", "opt-lg", "opt-xl", "opt-full"];
const RK_SHADOWS = ["opt-xs", "opt-sm", "opt-md"];
const RK_DURATIONS = ["opt-instant", "opt-fast", "opt-default", "opt-slow"];
const RK_EASINGS = ["opt-standard", "opt-linear"];
const RK_SPACING = [
  "opt-micro", "opt-xs", "opt-sm", "opt-md", "opt-lg", "opt-xl", "opt-2xl",
  "opt-3xl", "opt-4xl", "opt-5xl", "opt-6xl",
];

const RK_COLORS = [
  // Brand
  "opt-ink", "opt-paper",
  // Neutral (public 12 + code-only intermediates)
  "opt-neutral-0", "opt-neutral-50", "opt-neutral-100", "opt-neutral-200",
  "opt-neutral-300", "opt-neutral-400", "opt-neutral-500", "opt-neutral-600",
  "opt-neutral-700", "opt-neutral-750", "opt-neutral-800", "opt-neutral-850",
  "opt-neutral-875", "opt-neutral-900", "opt-neutral-950", "opt-neutral-1000",
  // Red (destructive only)
  "opt-red-50", "opt-red-100", "opt-red-400", "opt-red-500", "opt-red-600", "opt-red-700",
  // Brand accents
  "opt-yellow-100", "opt-yellow-500", "opt-yellow-700",
  "opt-cyan-100", "opt-cyan-500", "opt-cyan-700",
  "opt-blue-100", "opt-blue-500", "opt-blue-700",
  // Status
  "opt-green-100", "opt-green-500", "opt-green-700",
  "opt-amber-100", "opt-amber-500", "opt-amber-700",
  "opt-coral-100", "opt-coral-500", "opt-coral-700",
  // Semantic — surfaces / borders / text / interactive / accents
  "opt-surface-base", "opt-surface-low", "opt-surface-raised", "opt-surface-overlay",
  "opt-border-subtle", "opt-border-default", "opt-border-focus",
  "opt-text-heading", "opt-text-primary", "opt-text-secondary",
  "opt-text-placeholder", "opt-text-link",
  "opt-interactive-active-fill", "opt-interactive-hover-fill",
  "opt-interactive-pressed-fill", "opt-interactive-ghost-hover",
  "opt-interactive-disabled-fill", "opt-interactive-selection",
  "opt-accent-info-bg", "opt-accent-info-fill", "opt-accent-info-fg",
  "opt-accent-success-bg", "opt-accent-success-fill", "opt-accent-success-fg",
  "opt-accent-warning-bg", "opt-accent-warning-fill", "opt-accent-warning-fg",
  "opt-accent-danger-bg", "opt-accent-danger-fill", "opt-accent-danger-fg",
  // Optimus accent + glass
  "opt-lime-100", "opt-lime-500", "opt-lime-700",
  "opt-accent-lime-bg", "opt-accent-lime-fill", "opt-accent-lime-fg",
  "opt-glass-bg", "opt-glass-border",
];

// Tailwind-merge v3 theme keys (singular, per the package's `fromTheme()` calls):
//   color, text, font, font-weight, radius, shadow, ease, spacing
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: RK_COLORS,
      text: RK_FONT_SIZES,
      font: RK_FONT_FAMILIES,
      "font-weight": RK_FONT_WEIGHTS,
      radius: RK_RADII,
      shadow: RK_SHADOWS,
      ease: RK_EASINGS,
      spacing: RK_SPACING,
    },
    classGroups: {
      // duration-opt-* isn't theme-driven in default tw-merge; teach it our scale
      duration: [{ duration: RK_DURATIONS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
