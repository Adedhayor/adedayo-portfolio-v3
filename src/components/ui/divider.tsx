import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * 1px line that separates content. Two orientations, three weights, optional
 * label. Default is the everyday divider for list rows, panel sections, table
 * headers. Subtle whispers when even a hairline feels loud. Strong appears
 * before section transitions in marketing layouts.
 */
const dividerVariants = cva("", {
  variants: {
    orientation: {
      horizontal: "w-full h-px",
      vertical:   "h-full w-px",
    },
    weight: {
      subtle:  "bg-opt-neutral-100 opacity-60",
      default: "bg-opt-border-default",
      strong:  "bg-opt-ink opacity-[15%] dark:bg-opt-neutral-100 dark:opacity-20",
    },
  },
  compoundVariants: [],
  defaultVariants: { orientation: "horizontal", weight: "default" },
});

type DividerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dividerVariants> & {
    /** Optional label that splits the line — centered by default; anchor with `align`. */
    label?: ReactNode;
    /** Label alignment along the horizontal axis. Vertical dividers ignore this. */
    align?: "start" | "center";
    /** Fixed height for vertical dividers (in px). Defaults to self-stretch when omitted. */
    verticalHeight?: number;
  };

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation = "horizontal",
      weight = "default",
      label,
      align = "center",
      verticalHeight,
      style,
      ...props
    },
    ref,
  ) => {
    // Plain line — no label
    if (label == null) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation={orientation ?? "horizontal"}
          style={
            orientation === "vertical" && verticalHeight != null
              ? { ...style, height: `${verticalHeight}px` }
              : style
          }
          className={cn(dividerVariants({ orientation, weight }), className)}
          {...props}
        />
      );
    }

    // Labeled · horizontal only — lines flank the label
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn(
          "flex items-center gap-[8px] w-full",
          className,
        )}
        {...props}
      >
        {align === "center" && (
          <span className={cn("flex-1", dividerVariants({ orientation: "horizontal", weight }))} />
        )}
        <span
          className={cn(
            "font-opt-mono font-opt-semibold uppercase",
            "text-[10px] leading-[12px] tracking-[0.12em]",
            "text-opt-text-secondary whitespace-nowrap",
          )}
        >
          {label}
        </span>
        <span className={cn("flex-1", dividerVariants({ orientation: "horizontal", weight }))} />
      </div>
    );
  },
);
Divider.displayName = "Divider";

export { Divider, dividerVariants };
export type { DividerProps };
