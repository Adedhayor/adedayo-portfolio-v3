import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { Switch as RadixSwitch } from "radix-ui";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Pill toggle for instant changes. Track flips neutral-300 → ink when on;
 * thumb translates by (track − 2·inset − thumb) px.
 *
 * In dark mode the track inverts: white when on, neutral-600 when off — so
 * the contrast direction stays consistent.
 */
const trackVariants = cva(
  [
    "peer relative inline-flex flex-shrink-0 cursor-pointer items-center",
    "rounded-full border border-transparent",
    "transition-colors duration-opt-fast ease-opt-standard",
    "bg-opt-neutral-300 dark:bg-opt-neutral-600",
    "data-[state=checked]:bg-opt-ink dark:data-[state=checked]:bg-opt-neutral-100",
    // Focus uses the ink ring pattern
    "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(17,17,17,0.12)]",
    "dark:focus-visible:shadow-[0_0_0_2px_rgba(240,240,240,0.16)]",
    // Disabled
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        sm: "h-[14px] w-[24px]",
        md: "h-[16px] w-[28px]",
        lg: "h-[18px] w-[32px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const thumbVariants = cva(
  [
    "pointer-events-none flex items-center justify-center rounded-full",
    "bg-opt-neutral-0 dark:bg-opt-ink",
    "shadow-[0_1px_2px_rgba(0,0,0,0.20)]",
    "transition-transform duration-opt-fast ease-opt-standard",
  ],
  {
    variants: {
      size: {
        sm: "h-[10px] w-[10px] translate-x-[2px] data-[state=checked]:translate-x-[12px]",
        md: "h-[12px] w-[12px] translate-x-[2px] data-[state=checked]:translate-x-[14px]",
        lg: "h-[14px] w-[14px] translate-x-[2px] data-[state=checked]:translate-x-[16px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type SwitchProps = ComponentPropsWithoutRef<typeof RadixSwitch.Root> &
  VariantProps<typeof trackVariants> & {
    /**
     * Renders a small spinner inside the thumb and prevents toggling.
     * Use during async commits — e.g. saving a property change.
     */
    loading?: boolean;
  };

const Switch = forwardRef<
  ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(({ className, size = "md", loading, disabled, ...props }, ref) => {
  const spinnerSize = size === "lg" ? 10 : 8;
  return (
    <RadixSwitch.Root
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        trackVariants({ size }),
        // Disabled fades the track; loading stays full opacity to read as "committing", not "off".
        disabled && !loading && "opacity-50",
        className,
      )}
      {...props}
    >
      <RadixSwitch.Thumb className={thumbVariants({ size })}>
        {loading && (
          <Loader2
            size={spinnerSize}
            strokeWidth={2.5}
            className="animate-spin text-opt-text-secondary"
            aria-hidden="true"
          />
        )}
      </RadixSwitch.Thumb>
    </RadixSwitch.Root>
  );
});
Switch.displayName = "Switch";

export { Switch, trackVariants };
export type { SwitchProps };
