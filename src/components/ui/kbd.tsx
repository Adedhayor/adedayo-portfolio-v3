import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  Children,
  isValidElement,
  cloneElement,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Keyboard shortcut chip. Single glyphs use square chips; combos chain with
 * 2px gaps — never with "+" between keys.
 *
 * Three surface variants:
 *   - light  · neutral-100 fill + 1px hairline (default)
 *   - dark   · neutral-800 fill, no border (for tooltips / command palette)
 *   - inline · 1px margin, sized for body prose
 */
const kbdVariants = cva(
  [
    "inline-flex items-center justify-center flex-shrink-0",
    "font-opt-mono font-opt-medium",
    "rounded-opt-sm select-none",
  ],
  {
    variants: {
      surface: {
        light: "bg-opt-neutral-100 text-opt-text-heading border border-opt-border-subtle",
        dark:  "bg-opt-neutral-800 text-opt-neutral-50 dark:bg-opt-neutral-800",
        inline: "bg-opt-neutral-100 text-opt-text-heading border border-opt-border-subtle mx-[1px]",
      },
      size: {
        sm: "h-[14px] min-w-[14px] px-[3px] text-[9px] leading-[12px]",
        md: "h-[18px] min-w-[18px] px-[4px] text-[11px] leading-[14px]",
        lg: "h-[22px] min-w-[22px] px-[5px] text-[13px] leading-[16px]",
      },
    },
    defaultVariants: { surface: "light", size: "md" },
  },
);

type KbdProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof kbdVariants>;

const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, surface, size, children, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(kbdVariants({ surface, size }), className)}
      {...props}
    >
      {children}
    </kbd>
  ),
);
Kbd.displayName = "Kbd";

// ── KbdCombo — chains multiple keys with 2px gaps ─────────────────
type KbdComboProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof kbdVariants> & {
    /**
     * Single-chip mode wraps the entire combo in one pill — useful when
     * space is tight (tooltips, inline labels). Default is chained.
     */
    compact?: boolean;
    children: ReactNode;
  };

const KbdCombo = forwardRef<HTMLSpanElement, KbdComboProps>(
  ({ className, surface, size, compact, children, ...props }, ref) => {
    if (compact) {
      // One chip wraps the whole combo, no inner separators
      const text = Children.toArray(children)
        .map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : ""))
        .join("");
      return (
        <Kbd ref={ref as never} surface={surface} size={size} className={className} {...props}>
          {text || children}
        </Kbd>
      );
    }
    // Chained — each child is its own chip with a 2px gap
    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center gap-[2px]", className)}
        {...props}
      >
        {Children.map(children, (child, i) => {
          if (isValidElement(child)) {
            // Force consistent surface/size across siblings unless already set
            const childProps = child.props as KbdProps;
            return cloneElement(child as React.ReactElement<KbdProps>, {
              surface: childProps.surface ?? surface,
              size: childProps.size ?? size,
              key: i,
            });
          }
          return (
            <Kbd key={i} surface={surface} size={size}>
              {child}
            </Kbd>
          );
        })}
      </span>
    );
  },
);
KbdCombo.displayName = "KbdCombo";

export { Kbd, KbdCombo, kbdVariants };
export type { KbdProps, KbdComboProps };
