import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center select-none",
    "rounded-opt-sm font-opt-medium",
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
          "dark:disabled:bg-opt-neutral-850 dark:disabled:text-opt-neutral-500",
        ],
        secondary: [
          "bg-opt-surface-raised text-opt-text-link",
          "border-[1.5px] border-opt-border-default",
          "hover:bg-opt-neutral-50 hover:border-opt-neutral-300",
          "active:bg-opt-neutral-100 active:border-opt-neutral-300",
          "disabled:bg-opt-surface-raised disabled:border-opt-border-subtle disabled:text-opt-neutral-300",
          // Daopt-mode hover/active — neutral-50/100 are primitive tokens
          // that don't flip in dark mode, so the hover/active surface stays
          // light. Paired with text-opt-text-link (light in dark mode), that
          // produces light-on-light = invisible label. Override with dark
          // neutrals so the interaction reads.
          "dark:hover:bg-opt-neutral-800 dark:hover:border-opt-neutral-600",
          "dark:active:bg-opt-neutral-700 dark:active:border-opt-neutral-500",
        ],
        ghost: [
          "bg-transparent text-opt-text-link",
          "hover:bg-opt-interactive-ghost-hover",
          "active:bg-opt-neutral-200",
          "disabled:bg-transparent disabled:text-opt-neutral-300",
          // Same root cause as Secondary — neutral-200 is a light primitive
          // that doesn't flip. Active state needs an explicit dark variant
          // so the pressed feedback reads in dark mode.
          "dark:active:bg-opt-neutral-700",
        ],
        danger: [
          "bg-opt-red-500 text-opt-neutral-0",
          "hover:bg-opt-red-600",
          "active:bg-opt-red-700",
          "disabled:bg-opt-neutral-100 disabled:text-opt-neutral-400",
        ],
      },
      size: {
        standard: "h-opt-2xl text-opt-md gap-[6px]",
        compact: "h-opt-xl text-opt-sm gap-[6px]",
      },
      iconPosition: {
        none: "",
        leading: "",
        trailing: "",
        only: "",
      },
    },
    compoundVariants: [
      // Standard · 32px
      { size: "standard", iconPosition: "none",     className: "px-[14px]" },
      { size: "standard", iconPosition: "leading",  className: "pl-[12px] pr-[14px]" },
      { size: "standard", iconPosition: "trailing", className: "pl-[14px] pr-[12px]" },
      { size: "standard", iconPosition: "only",     className: "w-opt-2xl px-0" },
      // Compact · 24px
      { size: "compact",  iconPosition: "none",     className: "px-[10px]" },
      { size: "compact",  iconPosition: "leading",  className: "pl-[8px] pr-[10px]" },
      { size: "compact",  iconPosition: "trailing", className: "pl-[10px] pr-[8px]" },
      { size: "compact",  iconPosition: "only",     className: "w-opt-xl px-0" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "standard",
      iconPosition: "none",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<VariantProps<typeof buttonVariants>, "iconPosition"> & {
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, leadingIcon, trailingIcon, children, type = "button", ...props },
    ref,
  ) => {
    const iconPosition =
      !children && leadingIcon
        ? "only"
        : leadingIcon
          ? "leading"
          : trailingIcon
            ? "trailing"
            : "none";

    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, iconPosition }), className)}
        {...props}
      >
        {leadingIcon}
        {children}
        {trailingIcon}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
export type { ButtonProps };
