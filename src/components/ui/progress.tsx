import { cva, type VariantProps } from "class-variance-authority";
import { Progress as RadixProgress } from "radix-ui";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Determinate bars for known durations, indeterminate spinners for "still
 * working" moments. Bars: pill-shaped, Ink fill on a neutral-100 track.
 * Spinners: 3/4-arc instead of a full ring so they read as "rotating" even
 * when static.
 */

// ── Linear bar ─────────────────────────────────────────────────
const barVariants = cva(
  [
    "relative overflow-hidden w-full rounded-opt-full",
    "bg-opt-neutral-100 dark:bg-opt-neutral-800",
  ],
  {
    variants: {
      size: {
        sm: "h-[3px]",
        md: "h-[6px]",
        lg: "h-[8px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const fillVariants = cva(
  [
    "h-full rounded-opt-full",
    "transition-transform duration-opt-default ease-opt-standard",
  ],
  {
    variants: {
      tone: {
        ink:     "bg-opt-ink dark:bg-opt-neutral-100",
        success: "bg-opt-green-500",
        warning: "bg-opt-amber-500",
        danger:  "bg-opt-red-500",
      },
    },
    defaultVariants: { tone: "ink" },
  },
);

type ProgressBarProps = ComponentPropsWithoutRef<typeof RadixProgress.Root> &
  VariantProps<typeof barVariants> &
  VariantProps<typeof fillVariants> & {
    /** 0–100. Pass `null` for indeterminate. */
    value?: number | null;
  };

const ProgressBar = forwardRef<
  ElementRef<typeof RadixProgress.Root>,
  ProgressBarProps
>(({ className, size, tone, value, ...props }, ref) => {
  const indeterminate = value == null;
  const v = indeterminate ? undefined : Math.min(100, Math.max(0, value));
  return (
    <RadixProgress.Root
      ref={ref}
      value={v}
      className={cn(barVariants({ size }), className)}
      {...props}
    >
      {indeterminate ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-0 h-full w-[30%] rounded-opt-full",
            fillVariants({ tone }),
            "[animation:opt-progress-slide_1200ms_ease-in-out_infinite]",
          )}
          style={{
            // Keyframes are defined inline below via the data-style attr fallback;
            // Tailwind v4 ships with `animate-*` utilities, but the custom slide
            // is component-local so we register it via a <style> in the document.
          }}
        />
      ) : (
        <RadixProgress.Indicator
          className={cn(fillVariants({ tone }))}
          style={{
            width: "100%",
            transform: `translateX(-${100 - (v ?? 0)}%)`,
          }}
        />
      )}
      {indeterminate && <IndeterminateKeyframes />}
    </RadixProgress.Root>
  );
});
ProgressBar.displayName = "ProgressBar";

/**
 * Inject the slide keyframes once (component-local, no global stylesheet
 * change required). The animation slides a 30% slug from -100% to 300%
 * across the track.
 */
const IndeterminateKeyframes = () => (
  <style>{`
    @keyframes opt-progress-slide {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(333%); }
    }
  `}</style>
);

// ── Circular spinner ───────────────────────────────────────────
const spinnerSizeMap = {
  xs: { px: 16, stroke: 3 },
  sm: { px: 24, stroke: 2.5 },
  md: { px: 32, stroke: 2.5 },
  lg: { px: 48, stroke: 2 },
};

type SpinnerProps = HTMLAttributes<SVGSVGElement> & {
  size?: keyof typeof spinnerSizeMap;
  tone?: VariantProps<typeof fillVariants>["tone"];
};

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = "sm", tone = "ink", className, ...props }, ref) => {
    const { px, stroke } = spinnerSizeMap[size];
    const r = (px - stroke) / 2;
    const c = 2 * Math.PI * r;
    // 3/4 arc: dasharray draws ~75% of the circumference, leaves a gap
    const arcLen = c * 0.75;
    return (
      <svg
        ref={ref}
        role="status"
        aria-label="Loading"
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        className={cn(
          "[animation:opt-spin_1200ms_linear_infinite]",
          tone === "ink"     && "text-opt-ink dark:text-opt-neutral-100",
          tone === "success" && "text-opt-green-500",
          tone === "warning" && "text-opt-amber-500",
          tone === "danger"  && "text-opt-red-500",
          className,
        )}
        {...props}
      >
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${c}`}
        />
        <SpinKeyframes />
      </svg>
    );
  },
);
Spinner.displayName = "Spinner";

const SpinKeyframes = () => (
  <style>{`
    @keyframes opt-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
  `}</style>
);

export { ProgressBar, Spinner, barVariants, fillVariants };
export type { ProgressBarProps, SpinnerProps };
