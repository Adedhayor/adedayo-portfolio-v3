import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center select-none",
    "rounded-opt-sm",
    "transition-colors duration-opt-fast ease-opt-standard",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-ink focus-visible:ring-offset-2 focus-visible:ring-offset-opt-surface-base",
    "disabled:cursor-not-allowed disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-opt-interactive-active-fill text-opt-neutral-0 dark:text-opt-ink",
          "hover:bg-opt-interactive-hover-fill",
          "active:bg-opt-interactive-pressed-fill",
          "disabled:bg-opt-neutral-100 disabled:text-opt-neutral-400",
        ],
        secondary: [
          "bg-opt-surface-raised text-opt-text-link border-[1.5px] border-opt-border-default",
          "hover:bg-opt-interactive-ghost-hover",
          "active:bg-opt-interactive-ghost-hover",
          "disabled:bg-opt-surface-raised disabled:border-opt-border-subtle disabled:text-opt-neutral-300",
        ],
        ghost: [
          "bg-transparent text-opt-text-link",
          "hover:bg-opt-interactive-ghost-hover",
          "active:bg-opt-neutral-200",
          "disabled:bg-transparent disabled:text-opt-neutral-300",
        ],
        danger: [
          "bg-opt-red-500 text-opt-neutral-0",
          "hover:bg-opt-red-600",
          "active:bg-opt-red-700",
          "disabled:bg-opt-neutral-100 disabled:text-opt-neutral-400",
        ],
      },
      size: {
        standard: "h-opt-2xl w-opt-2xl",
        compact:  "h-opt-xl  w-opt-xl",
      },
      // Active is unique to IconButton — separates it from Button.
      // - filled: primary-tool selection (Move, Frame) — only one active per surface
      // - tonal:  togglable formatting (Bold, Italic, Visibility) — many can be on
      //
      // Tonal stays DARK in dark mode (neutral-700, one step above the
      // canvas) — same principle as Tooltip. Inverting to a light fill on
      // a dark canvas reads as a flash-bang.
      activeState: {
        none:   "",
        filled: "bg-opt-interactive-active-fill text-opt-neutral-0 dark:text-opt-ink hover:bg-opt-interactive-active-fill",
        tonal: cn(
          "bg-opt-neutral-200 text-opt-text-link hover:bg-opt-neutral-200",
          "dark:bg-opt-neutral-700 dark:text-opt-neutral-50 dark:hover:bg-opt-neutral-700",
        ),
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "standard",
      activeState: "none",
    },
  },
);

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> &
  Omit<VariantProps<typeof iconButtonVariants>, "activeState"> & {
    /** The icon to render. Lucide component instance at 14/12 px sized internally. */
    icon: ReactNode;
    /** Accessible label — REQUIRED. IconButton always pairs with a tooltip; this is what the tooltip reads. */
    "aria-label": string;
    /**
     * Active treatment for toolbar / format-bar use.
     * - `"filled"`: primary tool selection (Move, Frame) — only one active per surface
     * - `"tonal"`: togglable formatting (Bold, Italic, Visibility) — many can be on at once
     * - omit / `false`: no active state
     */
    active?: false | "filled" | "tonal";
  };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      active = false,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const activeState = active === false ? "none" : active;
    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={active === "tonal" ? true : undefined}
        data-state={active === false ? undefined : active}
        className={cn(iconButtonVariants({ variant, size, activeState }), className)}
        {...props}
      >
        {icon}
      </button>
    );
  },
);
IconButton.displayName = "IconButton";

export { iconButtonVariants };
export type { IconButtonProps };
