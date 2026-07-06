import { cva, type VariantProps } from "class-variance-authority";
import { ToggleGroup as RadixToggleGroup } from "radix-ui";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Mutually exclusive picker. One segment active at a time — like a tabs
 * control with stronger visual grouping. Active segment lifts to white with
 * elevation.xs, looking "depressed-into-the-container" inverted.
 *
 * In dark mode the active segment lifts to a brighter neutral-600 instead
 * of white, keeping the pressed-surface illusion at lower contrast.
 */
const segmentedContainerVariants = cva(
  [
    "inline-flex items-center flex-shrink-0",
    "bg-opt-neutral-50 dark:bg-opt-neutral-800",
    "rounded-opt-md p-[2px] gap-[2px]",
  ],
  {
    variants: {
      size: {
        sm: "h-[28px]",
        md: "h-[32px]",
        lg: "h-[36px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const segmentedItemVariants = cva(
  [
    "inline-flex items-center justify-center gap-opt-xs",
    "rounded-opt-sm cursor-pointer",
    "text-opt-text-secondary",
    "transition-colors duration-opt-fast ease-opt-standard",
    "hover:text-opt-text-heading",
    // Active — lifts to white surface with subtle elevation
    "data-[state=on]:bg-opt-surface-raised data-[state=on]:text-opt-text-heading",
    "data-[state=on]:shadow-opt-xs",
    "dark:data-[state=on]:bg-opt-neutral-600 dark:data-[state=on]:text-opt-neutral-50",
    // Focus
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-ink",
    "dark:focus-visible:ring-opt-neutral-100",
    // Disabled
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-[24px] px-opt-sm text-opt-sm",
        md: "h-[28px] px-opt-md text-opt-md",
        lg: "h-[32px] px-opt-md text-opt-md",
      },
      iconOnly: {
        true: "aspect-square px-0",
        false: "",
      },
    },
    defaultVariants: { size: "md", iconOnly: false },
  },
);

// Single-select Radix props, minus `type` which we hardcode (segmented is
// mutually exclusive by definition).
type RadixSingleProps = Omit<
  Extract<ComponentPropsWithoutRef<typeof RadixToggleGroup.Root>, { type: "single" }>,
  "type"
>;

type SegmentedProps = RadixSingleProps &
  VariantProps<typeof segmentedContainerVariants>;

const Segmented = forwardRef<
  ElementRef<typeof RadixToggleGroup.Root>,
  SegmentedProps
>(({ className, size, ...props }, ref) => (
  <RadixToggleGroup.Root
    ref={ref}
    type="single"
    {...props}
    className={cn(segmentedContainerVariants({ size }), className)}
  />
));
Segmented.displayName = "Segmented";

type SegmentedItemProps = ComponentPropsWithoutRef<typeof RadixToggleGroup.Item> &
  VariantProps<typeof segmentedItemVariants>;

const SegmentedItem = forwardRef<
  ElementRef<typeof RadixToggleGroup.Item>,
  SegmentedItemProps
>(({ className, size, iconOnly, ...props }, ref) => (
  <RadixToggleGroup.Item
    ref={ref}
    className={cn(segmentedItemVariants({ size, iconOnly }), className)}
    {...props}
  />
));
SegmentedItem.displayName = "SegmentedItem";

export { Segmented, SegmentedItem, segmentedContainerVariants, segmentedItemVariants };
export type { SegmentedProps, SegmentedItemProps };
