import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * "Nothing here yet" placeholder. Icon, title, description, optional actions —
 * centered in the container it fills.
 *
 * Three densities:
 *   compact · for list voids (e.g. empty filter results inline)
 *   default · for tab panels
 *   large   · for first-run screens
 *
 * Use the `intent` prop to color the icon chip — info / permission / error.
 * Match the action to the cause: create / clear / request / retry.
 */
const containerVariants = cva(
  [
    "flex flex-col items-center text-center mx-auto",
    "max-w-[240px]", // Description never grows past max-w-xs (240px)
  ],
  {
    variants: {
      size: {
        compact: "gap-opt-sm py-opt-xl",
        default: "gap-opt-md py-opt-2xl",
        large:   "gap-opt-md py-[64px]",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const iconWrapperVariants = cva(
  [
    "inline-flex items-center justify-center flex-shrink-0",
    "rounded-opt-md",
  ],
  {
    variants: {
      size: {
        compact: "w-[28px] h-[28px]",
        default: "w-[36px] h-[36px]",
        large:   "w-[44px] h-[44px]",
      },
      intent: {
        neutral:    "bg-opt-neutral-100 text-opt-text-secondary",
        info:       "bg-opt-blue-100 text-opt-blue-700",
        permission: "bg-opt-amber-100 text-opt-amber-700",
        error:      "bg-opt-red-100 text-opt-red-700",
      },
    },
    defaultVariants: { size: "default", intent: "neutral" },
  },
);

type EmptyStateProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof containerVariants> & {
    icon?: ReactNode;
    intent?: VariantProps<typeof iconWrapperVariants>["intent"];
    title: ReactNode;
    description?: ReactNode;
    /** Optional eyebrow caption above the icon — e.g. "FIRST RUN · INVITE ACTION". */
    eyebrow?: ReactNode;
    /** Action buttons. Pass <Button> children — they get justify-center'd. */
    actions?: ReactNode;
  };

const eyebrowColor: Record<NonNullable<EmptyStateProps["intent"]>, string> = {
  neutral:    "text-opt-text-secondary",
  info:       "text-opt-blue-700 dark:text-opt-blue-100",
  permission: "text-opt-amber-700 dark:text-opt-amber-100",
  error:      "text-opt-red-700 dark:text-opt-red-100",
};

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { className, size = "default", intent = "neutral", icon, eyebrow, title, description, actions, ...props },
    ref,
  ) => {
    const iconPx = size === "large" ? 20 : size === "compact" ? 14 : 16;
    return (
      <div ref={ref} className={cn(containerVariants({ size }), className)} {...props}>
        {eyebrow && (
          <span
            className={cn(
              "font-opt-mono text-[10px] uppercase tracking-[0.16em] self-stretch text-start",
              eyebrowColor[intent ?? "neutral"],
            )}
          >
            {eyebrow}
          </span>
        )}
        {icon && (
          <span className={iconWrapperVariants({ size, intent })} aria-hidden="true">
            <span style={{ width: iconPx, height: iconPx, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              {icon}
            </span>
          </span>
        )}
        <div className="flex flex-col gap-[4px]">
          <h3 className={cn(
            "font-opt-semibold text-opt-text-heading leading-[20px]",
            size === "large" ? "text-opt-lg" : "text-opt-md",
          )}>
            {title}
          </h3>
          {description && (
            <p className="text-[12px] leading-[18px] text-opt-text-secondary">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="inline-flex items-center justify-center gap-opt-sm mt-opt-xs">
            {actions}
          </div>
        )}
      </div>
    );
  },
);
EmptyState.displayName = "EmptyState";

export { EmptyState, containerVariants, iconWrapperVariants };
export type { EmptyStateProps };
