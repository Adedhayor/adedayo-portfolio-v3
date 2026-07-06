import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  CheckCircle,
  Info,
  Layers,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "./icon-button";

/**
 * Persistent page-level message. Sits at the top of a section or pane, holds
 * an icon, title, body, optional action, and dismiss — stays until the user
 * acts on it or clears it.
 *
 * Different from Toast: Banner stays until dismissed; Toast auto-dismisses.
 *
 * Intents:    info · success · warning · danger · neutral
 * Densities:  compact (32, single-line) · default (56, title+body) ·
 *             spacious (96, eyebrow+title+body+actions)
 *
 * Surface pattern: 100-step tint background, 700-step text, matching 500-step
 * border at 25% opacity for a soft hairline.
 */
const bannerVariants = cva(
  [
    "flex w-full",
    "rounded-opt-md border",
    "transition-colors duration-opt-fast ease-opt-standard",
  ],
  {
    variants: {
      intent: {
        info:    "bg-opt-blue-100 border-opt-blue-500/25 text-opt-blue-700 dark:bg-opt-blue-700/15 dark:border-opt-blue-500/30 dark:text-opt-blue-100",
        success: "bg-opt-green-100 border-opt-green-500/25 text-opt-green-700 dark:bg-opt-green-700/15 dark:border-opt-green-500/30 dark:text-opt-green-100",
        warning: "bg-opt-amber-100 border-opt-amber-500/30 text-opt-amber-700 dark:bg-opt-amber-700/15 dark:border-opt-amber-500/30 dark:text-opt-amber-100",
        danger:  "bg-opt-red-100 border-opt-red-500/25 text-opt-red-700 dark:bg-opt-red-700/15 dark:border-opt-red-500/30 dark:text-opt-red-100",
        neutral: "bg-opt-neutral-100 border-opt-border-default text-opt-text-heading dark:bg-opt-neutral-800 dark:border-opt-neutral-700 dark:text-opt-neutral-200",
      },
      density: {
        compact:  "items-center gap-opt-sm py-[6px] px-opt-md",
        default:  "items-start gap-opt-sm py-opt-sm px-opt-md",
        spacious: "items-start gap-opt-md py-opt-lg px-opt-lg",
      },
    },
    defaultVariants: { intent: "info", density: "default" },
  },
);

const defaultIcons: Record<NonNullable<VariantProps<typeof bannerVariants>["intent"]>, LucideIcon> = {
  info:    Info,
  success: CheckCircle,
  warning: TriangleAlert,
  danger:  AlertCircle,
  neutral: Layers,
};

type BannerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof bannerVariants> & {
    /** Eyebrow caption (small uppercase tag) above the title — spacious density only. */
    eyebrow?: ReactNode;
    /** Title — the headline. Required for default/spacious; carries content alone in compact. */
    title: ReactNode;
    /** Secondary body — describes the consequence or next step. */
    body?: ReactNode;
    /** Override the auto-selected icon for the intent. Pass `null` to omit. */
    icon?: ReactNode | null;
    /** Action node — typically a Button. Multiple actions can be passed as an array/fragment. */
    action?: ReactNode;
    /** Renders a trailing × dismiss button. Pair with `onDismiss`. */
    dismissible?: boolean;
    onDismiss?: () => void;
  };

const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      intent = "info",
      density = "default",
      eyebrow,
      title,
      body,
      icon,
      action,
      dismissible,
      onDismiss,
      ...props
    },
    ref,
  ) => {
    const Icon = intent ? defaultIcons[intent] : Info;
    const iconSize = density === "spacious" ? 20 : density === "compact" ? 14 : 16;
    const resolvedIcon =
      icon === null
        ? null
        : icon ?? <Icon size={iconSize} strokeWidth={2} aria-hidden="true" />;
    return (
      <div
        ref={ref}
        role="status"
        className={cn(bannerVariants({ intent, density }), className)}
        {...props}
      >
        {resolvedIcon && (
          <span
            className={cn(
              "inline-flex flex-shrink-0 items-center justify-center",
              density === "compact" ? "" : "mt-[2px]",
              density === "spacious" ? "mt-[1px]" : "",
            )}
          >
            {resolvedIcon}
          </span>
        )}

        <div className="flex flex-col gap-[2px] flex-1 min-w-0">
          {eyebrow && density === "spacious" && (
            <span className="font-opt-mono font-opt-semibold uppercase text-[10px] leading-[12px] tracking-[0.16em] opacity-90">
              {eyebrow}
            </span>
          )}
          <span
            className={cn(
              "font-opt-medium",
              density === "compact"
                ? "text-[13px] leading-[18px]"
                : density === "spacious"
                  ? "text-[16px] font-opt-semibold leading-[22px]"
                  : "text-[13px] leading-[18px]",
            )}
          >
            {title}
          </span>
          {body && density !== "compact" && (
            <span
              className={cn(
                "leading-[16px] opacity-80",
                density === "spacious" ? "text-[13px] leading-[20px] mt-[2px] opacity-85" : "text-[12px]",
              )}
            >
              {body}
            </span>
          )}
          {action && density === "spacious" && (
            <div className="flex items-center gap-opt-xs pt-opt-xs">{action}</div>
          )}
        </div>

        {/* Inline action for compact / default densities sits beside the text */}
        {action && density !== "spacious" && (
          <div className="flex-shrink-0 inline-flex items-center">{action}</div>
        )}

        {dismissible && (
          <IconButton
            variant="ghost"
            size="compact"
            aria-label="Dismiss"
            onClick={onDismiss}
            icon={<X size={12} strokeWidth={2.5} aria-hidden="true" />}
            // Inherit the banner's intent color and a translucent hover-fill
            // so the ghost variant sits cleanly on tinted surfaces.
            className="flex-shrink-0 text-current hover:bg-current/10 dark:hover:bg-current/10 -mr-[4px]"
          />
        )}
      </div>
    );
  },
);
Banner.displayName = "Banner";

export { Banner, bannerVariants };
export type { BannerProps };
