import { cva, type VariantProps } from "class-variance-authority";
import { Checkbox as RadixCheckbox } from "radix-ui";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@/lib/cn";

const checkboxVariants = cva(
  [
    "peer inline-flex items-center justify-center flex-shrink-0",
    "rounded-opt-sm border-[1.5px]",
    "bg-opt-surface-raised border-opt-neutral-300",
    "transition-colors duration-opt-fast ease-opt-standard",
    // Hover lightens border (neutral-300 → neutral-400)
    "hover:border-opt-neutral-400",
    // Focus uses the ink ring pattern from Input
    "focus-visible:outline-none focus-visible:border-opt-ink focus-visible:shadow-[0_0_0_2px_rgba(17,17,17,0.12)]",
    "dark:focus-visible:border-opt-neutral-100 dark:focus-visible:shadow-[0_0_0_2px_rgba(240,240,240,0.16)]",
    // Checked / indeterminate flip to ink fill + white mark
    "data-[state=checked]:bg-opt-ink data-[state=checked]:border-opt-ink data-[state=checked]:text-opt-neutral-0",
    "data-[state=indeterminate]:bg-opt-ink data-[state=indeterminate]:border-opt-ink data-[state=indeterminate]:text-opt-neutral-0",
    "dark:data-[state=checked]:bg-opt-neutral-100 dark:data-[state=checked]:border-opt-neutral-100 dark:data-[state=checked]:text-opt-ink",
    "dark:data-[state=indeterminate]:bg-opt-neutral-100 dark:data-[state=indeterminate]:border-opt-neutral-100 dark:data-[state=indeterminate]:text-opt-ink",
    // Hover on checked/indeterminate softens the fill (Ink → neutral-800)
    "hover:data-[state=checked]:bg-opt-neutral-800 hover:data-[state=checked]:border-opt-neutral-800",
    "hover:data-[state=indeterminate]:bg-opt-neutral-800 hover:data-[state=indeterminate]:border-opt-neutral-800",
    "dark:hover:data-[state=checked]:bg-opt-neutral-300 dark:hover:data-[state=checked]:border-opt-neutral-300",
    "dark:hover:data-[state=indeterminate]:bg-opt-neutral-300 dark:hover:data-[state=indeterminate]:border-opt-neutral-300",
    // Disabled: muted everything, no pointer
    "disabled:cursor-not-allowed disabled:pointer-events-none",
    "disabled:bg-opt-neutral-50 disabled:border-opt-border-subtle",
    "disabled:data-[state=checked]:bg-opt-neutral-300 disabled:data-[state=checked]:border-opt-neutral-300",
    "disabled:data-[state=indeterminate]:bg-opt-neutral-300 disabled:data-[state=indeterminate]:border-opt-neutral-300",
  ],
  {
    variants: {
      size: {
        sm: "h-[14px] w-[14px]",
        md: "h-[16px] w-[16px]",
        lg: "h-[18px] w-[18px]",
      },
      state: {
        default: "",
        error: [
          "border-opt-red-500 shadow-[0_0_0_2px_rgba(215,38,56,0.12)]",
          "hover:border-opt-red-500",
          "focus-visible:border-opt-red-500 focus-visible:shadow-[0_0_0_2px_rgba(215,38,56,0.20)]",
          "data-[state=checked]:bg-opt-red-500 data-[state=checked]:border-opt-red-500",
          "data-[state=indeterminate]:bg-opt-red-500 data-[state=indeterminate]:border-opt-red-500",
        ].join(" "),
      },
    },
    defaultVariants: { size: "md", state: "default" },
  },
);

type CheckboxProps = ComponentPropsWithoutRef<typeof RadixCheckbox.Root> &
  VariantProps<typeof checkboxVariants>;

const tickByPx = (px: number) => {
  // 11px tick on 16px box (Paper). Scale linearly for sm/lg.
  return (11 / 16) * px;
};

const Checkbox = forwardRef<
  ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(({ className, size = "md", state, ...props }, ref) => {
  const boxPx = size === "sm" ? 14 : size === "lg" ? 18 : 16;
  const tickPx = tickByPx(boxPx);
  // Indeterminate dash: 8×2 on md (per Paper), scale with box
  const dashWidth = (8 / 16) * boxPx;
  return (
    <RadixCheckbox.Root
      ref={ref}
      className={cn(checkboxVariants({ size, state }), className)}
      {...props}
    >
      <RadixCheckbox.Indicator className="flex items-center justify-center" forceMount>
        {/* Tick — shown when state=checked via parent CSS data-state, hidden otherwise */}
        <svg
          width={tickPx}
          height={tickPx}
          viewBox="0 0 11 11"
          fill="none"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="hidden [[data-state=checked]_&]:block"
        >
          <polyline points="2.5,5.5 4.5,7.5 8.5,3.5" />
        </svg>
        {/* Indeterminate dash */}
        <span
          aria-hidden="true"
          className="hidden [[data-state=indeterminate]_&]:block rounded-[1px] bg-current"
          style={{ width: `${dashWidth}px`, height: "2px" }}
        />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
export type { CheckboxProps };
