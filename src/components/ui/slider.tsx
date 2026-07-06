import { cva, type VariantProps } from "class-variance-authority";
import { Slider as RadixSlider } from "radix-ui";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@/lib/cn";

const rootVariants = cva(
  [
    "relative flex w-full touch-none select-none items-center",
    "data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        sm: "h-[12px]",
        md: "h-[16px]",
        lg: "h-[20px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const trackVariants = cva(
  [
    "relative w-full overflow-hidden rounded-full",
    // Light: soft gray track. Dark: recessed neutral-700 so the soft off-white
    // fill above reads as clearly elevated against the canvas.
    "bg-opt-neutral-200 dark:bg-opt-neutral-700",
  ],
);

const trackHeight: Record<string, string> = { sm: "2px", md: "4px", lg: "6px" };

const thumbVariants = cva(
  [
    "block rounded-full border-[1.5px]",
    // Light: white dot, ink border (via interactive token)
    "bg-opt-neutral-0 border-opt-interactive-active-fill",
    "shadow-[0_1px_3px_rgba(0,0,0,0.18)]",
    // Dark: thumb is the brightest element — a bright neutral dot above a
    // muted neutral fill. Mirrors the Paper-app slider hierarchy: position
    // marker dominates, filled span recedes. Avoids pure #FFF.
    "dark:bg-opt-neutral-100 dark:border-opt-neutral-100",
    "dark:shadow-[0_1px_3px_rgba(0,0,0,0.40)]",
    // Hover halo
    "transition-shadow duration-opt-fast",
    "hover:shadow-[0_0_0_4px_rgba(17,17,17,0.10),0_1px_3px_rgba(0,0,0,0.18)]",
    "dark:hover:shadow-[0_0_0_4px_rgba(240,240,240,0.14),0_1px_3px_rgba(0,0,0,0.40)]",
    // Focus ring — gap matches surface so it reads on any bg
    "focus-visible:outline-none",
    "focus-visible:shadow-[0_0_0_2px_var(--opt-surface-base),0_0_0_4px_var(--opt-color-ink)]",
    "dark:focus-visible:shadow-[0_0_0_2px_var(--opt-color-neutral-900),0_0_0_4px_var(--opt-color-neutral-100)]",
  ],
  {
    variants: {
      size: {
        sm: "h-[12px] w-[12px]",
        md: "h-[16px] w-[16px]",
        lg: "h-[20px] w-[20px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type SliderProps = ComponentPropsWithoutRef<typeof RadixSlider.Root> &
  VariantProps<typeof rootVariants>;

const Slider = forwardRef<ElementRef<typeof RadixSlider.Root>, SliderProps>(
  ({ className, size = "md", value, defaultValue, ...props }, ref) => {
    const thumbCount = value?.length ?? defaultValue?.length ?? 1;

    return (
      <RadixSlider.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue ?? [50]}
        className={cn(rootVariants({ size }), className)}
        {...props}
      >
        <RadixSlider.Track
          className={trackVariants()}
          style={{ height: trackHeight[size ?? "md"] }}
        >
          <RadixSlider.Range className="absolute h-full rounded-full bg-opt-interactive-active-fill dark:bg-opt-neutral-500" />
        </RadixSlider.Track>

        {Array.from({ length: thumbCount }, (_, i) => (
          <RadixSlider.Thumb
            key={i}
            className={thumbVariants({ size })}
            aria-label={thumbCount > 1 ? (i === 0 ? "Minimum" : "Maximum") : "Value"}
          />
        ))}
      </RadixSlider.Root>
    );
  },
);
Slider.displayName = "Slider";

export { Slider, rootVariants as sliderRootVariants };
export type { SliderProps };
