import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Interactive chip with optional × dismiss. Different from Badge — tags can
 * be removed; badges are read-only.
 *
 * The × is its own button at 60% opacity, lifting to 100% on hover —
 * clicking the X removes the tag, clicking the rest of the chip selects /
 * filters by it.
 *
 * Variants:
 *   Neutral · 3 intensities · subtle (default) / outline / filled
 *   Semantic · 4 roles · accent / success / warning / danger · 10% tint + 100% text
 */
const tagVariants = cva(
  [
    "inline-flex items-center gap-[4px] flex-shrink-0",
    "rounded-opt-md select-none whitespace-nowrap",
    "transition-colors duration-opt-fast ease-opt-standard",
    "font-opt-medium",
    // Focus ring when used as a button (filter chip)
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-ink",
    "dark:focus-visible:ring-opt-neutral-100",
  ],
  {
    variants: {
      variant: {
        subtle:  "bg-opt-neutral-100 text-opt-text-primary",
        outline: "bg-transparent border border-opt-border-default text-opt-text-primary",
        filled:  "bg-opt-ink text-opt-neutral-0 dark:bg-opt-neutral-100 dark:text-opt-ink",
        accent:  "bg-opt-blue-100 text-opt-blue-700",
        success: "bg-opt-green-100 text-opt-green-700",
        warning: "bg-opt-amber-100 text-opt-amber-700",
        danger:  "bg-opt-red-100 text-opt-red-700",
      },
      size: {
        sm: "h-[20px] px-opt-xs text-[11px] leading-[14px]",
        md: "h-[24px] px-opt-sm text-[12px] leading-[16px]",
      },
      interactive: {
        true: "cursor-pointer",
        false: "",
      },
    },
    compoundVariants: [
      // Hover lifts for interactive tags
      { variant: "subtle",  interactive: true, className: "hover:bg-opt-neutral-200" },
      { variant: "outline", interactive: true, className: "hover:bg-opt-neutral-50 dark:hover:bg-opt-neutral-800" },
      { variant: "filled",  interactive: true, className: "hover:bg-opt-neutral-800 dark:hover:bg-opt-neutral-200" },
      { variant: "accent",  interactive: true, className: "hover:bg-opt-blue-100 hover:brightness-[0.97]" },
      { variant: "success", interactive: true, className: "hover:bg-opt-green-100 hover:brightness-[0.97]" },
      { variant: "warning", interactive: true, className: "hover:bg-opt-amber-100 hover:brightness-[0.97]" },
      { variant: "danger",  interactive: true, className: "hover:bg-opt-red-100 hover:brightness-[0.97]" },
    ],
    defaultVariants: { variant: "subtle", size: "md", interactive: false },
  },
);

type TagProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof tagVariants> & {
    /** Leading icon — sized by the consumer (12px ideal). */
    leadingIcon?: ReactNode;
    /** Render the trailing × dismiss button. Pair with `onDismiss`. */
    dismissible?: boolean;
    onDismiss?: (e: MouseEvent<HTMLButtonElement>) => void;
    /** Aria label for the dismiss button. */
    dismissLabel?: string;
  };

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      variant,
      size,
      interactive,
      leadingIcon,
      dismissible,
      onDismiss,
      dismissLabel = "Remove",
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    // If onClick is provided we mark interactive automatically — drives hover.
    const isInteractive = interactive ?? onClick != null;
    return (
      <span
        ref={ref}
        className={cn(tagVariants({ variant, size, interactive: isInteractive }), className)}
        onClick={onClick}
        // Keep the chip focusable when it's a click target
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        {...props}
      >
        {leadingIcon && (
          <span aria-hidden="true" className="inline-flex flex-shrink-0">
            {leadingIcon}
          </span>
        )}
        <span>{children}</span>
        {dismissible && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss?.(e);
            }}
            aria-label={dismissLabel}
            className={cn(
              "inline-flex items-center justify-center flex-shrink-0",
              "ml-[2px] -mr-[2px] w-[14px] h-[14px] rounded-opt-sm",
              "opacity-60 hover:opacity-100",
              "transition-opacity duration-opt-fast ease-opt-standard",
            )}
          >
            <X size={10} strokeWidth={2.5} aria-hidden="true" />
          </button>
        )}
      </span>
    );
  },
);
Tag.displayName = "Tag";

export { Tag, tagVariants };
export type { TagProps };
