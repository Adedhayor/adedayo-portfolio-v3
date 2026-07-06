import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Status / count / presence label. Three intensities (soft / solid / outlined)
 * × five semantic roles (neutral / info / success / warning / danger).
 *
 * Soft is the default — quiet enough for tables and lists.
 * Solid earns its bigger footprint by being rare (one or two per screen).
 * Outlined fades into the page when the badge is just a label, not a signal.
 */
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center flex-shrink-0",
    "font-opt-semibold",
    "select-none whitespace-nowrap",
    "transition-colors duration-opt-fast ease-opt-standard",
  ],
  {
    variants: {
      intensity: {
        soft: "",
        solid: "text-opt-neutral-0",
        outlined: "bg-transparent border-[1px]",
      },
      role: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        danger: "",
        // Extended palette — supports tagging
        gray: "",
        red: "",
        coral: "",
        amber: "",
        yellow: "",
        green: "",
        cyan: "",
        blue: "",
        ink: "",
      },
      size: {
        xs: "h-[16px] rounded-[3px] px-[5px] text-[10px] leading-[12px] tracking-[0.04em]",
        sm: "h-[20px] rounded-opt-md px-opt-xs text-[11px] leading-[14px] tracking-[0.04em]",
        md: "h-[24px] rounded-opt-md px-opt-sm text-[12px] leading-[16px] tracking-[0.04em]",
        lg: "h-[28px] rounded-opt-md px-opt-sm text-[13px] leading-[18px] tracking-[0.04em]",
      },
    },
    compoundVariants: [
      // ─── SOFT × semantic roles ────────────────────────────────
      // Neutral follows the theme: light pill + ink text on :root, dark pill +
      // light text under .dark. Without the dark override, neutral-100 stays a
      // fixed-light fill while text-heading flips light → invisible text.
      { intensity: "soft", role: "neutral", className: "bg-opt-neutral-100 text-opt-text-heading dark:bg-opt-neutral-800 dark:text-opt-neutral-100" },
      { intensity: "soft", role: "info",    className: "bg-opt-blue-100 text-opt-blue-700" },
      { intensity: "soft", role: "success", className: "bg-opt-green-100 text-opt-green-700" },
      { intensity: "soft", role: "warning", className: "bg-opt-amber-100 text-opt-amber-700" },
      { intensity: "soft", role: "danger",  className: "bg-opt-red-100 text-opt-red-700" },
      // SOFT × extended palette
      { intensity: "soft", role: "gray",    className: "bg-opt-neutral-100 text-opt-neutral-700" },
      { intensity: "soft", role: "red",     className: "bg-opt-red-100 text-opt-red-700" },
      { intensity: "soft", role: "coral",   className: "bg-opt-coral-100 text-opt-coral-700" },
      { intensity: "soft", role: "amber",   className: "bg-opt-amber-100 text-opt-amber-700" },
      { intensity: "soft", role: "yellow",  className: "bg-opt-yellow-100 text-opt-yellow-700" },
      { intensity: "soft", role: "green",   className: "bg-opt-green-100 text-opt-green-700" },
      { intensity: "soft", role: "cyan",    className: "bg-opt-cyan-100 text-opt-cyan-700" },
      { intensity: "soft", role: "blue",    className: "bg-opt-blue-100 text-opt-blue-700" },
      { intensity: "soft", role: "ink",     className: "bg-opt-ink text-opt-neutral-0" },

      // ─── SOLID × semantic roles ───────────────────────────────
      { intensity: "solid", role: "neutral", className: "bg-opt-ink text-opt-neutral-0" },
      { intensity: "solid", role: "info",    className: "bg-opt-blue-500" },
      { intensity: "solid", role: "success", className: "bg-opt-green-500" },
      { intensity: "solid", role: "warning", className: "bg-opt-amber-500" },
      { intensity: "solid", role: "danger",  className: "bg-opt-red-500" },
      // SOLID × extended palette
      { intensity: "solid", role: "gray",    className: "bg-opt-neutral-500" },
      { intensity: "solid", role: "red",     className: "bg-opt-red-500" },
      { intensity: "solid", role: "coral",   className: "bg-opt-coral-500" },
      { intensity: "solid", role: "amber",   className: "bg-opt-amber-500" },
      // Yellow + cyan solids drop to ink text — bright fills don't carry white legibly
      { intensity: "solid", role: "yellow",  className: "bg-opt-yellow-500 text-opt-ink" },
      { intensity: "solid", role: "green",   className: "bg-opt-green-500" },
      { intensity: "solid", role: "cyan",    className: "bg-opt-cyan-500 text-opt-ink" },
      { intensity: "solid", role: "blue",    className: "bg-opt-blue-500" },
      { intensity: "solid", role: "ink",     className: "bg-opt-ink text-opt-neutral-0" },

      // ─── OUTLINED × roles ─────────────────────────────────────
      { intensity: "outlined", role: "neutral", className: "border-opt-border-default text-opt-text-primary" },
      { intensity: "outlined", role: "info",    className: "border-opt-blue-500 text-opt-blue-700" },
      { intensity: "outlined", role: "success", className: "border-opt-green-700 text-opt-green-700" },
      { intensity: "outlined", role: "warning", className: "border-opt-amber-700 text-opt-amber-700" },
      { intensity: "outlined", role: "danger",  className: "border-opt-red-500 text-opt-red-700" },
      { intensity: "outlined", role: "gray",    className: "border-opt-neutral-300 text-opt-neutral-700" },
      { intensity: "outlined", role: "ink",     className: "border-opt-ink text-opt-ink" },
    ],
    defaultVariants: { intensity: "soft", role: "neutral", size: "sm" },
  },
);

const dotColorByRole: Record<string, string> = {
  neutral: "bg-opt-neutral-500",
  info:    "bg-opt-blue-500",
  success: "bg-opt-green-500",
  warning: "bg-opt-amber-500",
  danger:  "bg-opt-red-500",
  gray:    "bg-opt-neutral-500",
  red:     "bg-opt-red-500",
  coral:   "bg-opt-coral-500",
  amber:   "bg-opt-amber-500",
  yellow:  "bg-opt-yellow-500",
  green:   "bg-opt-green-500",
  cyan:    "bg-opt-cyan-500",
  blue:    "bg-opt-blue-500",
  ink:     "bg-opt-ink",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    /** Leading icon — sized by the consumer. */
    leadingIcon?: ReactNode;
    /** Renders a 6px dot before the content. Use only with intensity="soft". */
    dot?: boolean;
    /** Count mode — applies mono digits + tighter tracking. */
    numeric?: boolean;
  };

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, intensity, role, size, leadingIcon, dot, numeric, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        badgeVariants({ intensity, role, size }),
        numeric && "font-opt-mono tabular-nums px-[5px]",
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-block w-[6px] h-[6px] rounded-full mr-[5px] flex-shrink-0",
            dotColorByRole[role ?? "neutral"],
          )}
        />
      )}
      {leadingIcon && (
        <span aria-hidden="true" className="inline-flex items-center mr-[4px] flex-shrink-0">
          {leadingIcon}
        </span>
      )}
      {children}
    </span>
  ),
);
Badge.displayName = "Badge";

// Presence dot — standalone, no label
type PresenceProps = HTMLAttributes<HTMLSpanElement> & {
  status: "online" | "away" | "offline";
};
const presenceColor: Record<PresenceProps["status"], string> = {
  online:  "bg-opt-green-500",
  away:    "bg-opt-amber-500",
  offline: "bg-opt-neutral-300",
};
const Presence = forwardRef<HTMLSpanElement, PresenceProps>(
  ({ status, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-label={status}
      role="status"
      className={cn(
        "inline-block w-[8px] h-[8px] rounded-full flex-shrink-0",
        presenceColor[status],
        className,
      )}
      {...props}
    />
  ),
);
Presence.displayName = "Presence";

export { Badge, Presence, badgeVariants };
export type { BadgeProps, PresenceProps };
