import { Tooltip as RadixTooltip } from "radix-ui";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { usePortalContainer } from "@/lib/portal";

/**
 * Dark bubble for icon-only buttons. Ink #111 bg, neutral-50 text, 8px blur
 * shadow. Open delay 200ms, close 0ms — hovering between adjacent triggers
 * reads as a single context, so the tooltip swaps content without delay.
 *
 * In dark mode the bubble stays dark (one step elevated — neutral-800) so it
 * reads as a heavier surface than the canvas without flipping into a light
 * inversion that competes with the rest of the UI.
 */
const TooltipProvider = RadixTooltip.Provider;
const TooltipRoot = RadixTooltip.Root;
const TooltipTrigger = RadixTooltip.Trigger;

type TooltipContentProps = ComponentPropsWithoutRef<typeof RadixTooltip.Content> & {
  /** Shortcut chip — kbd style. */
  shortcut?: string;
  /** Secondary description — flips to multi-line layout. */
  description?: ReactNode;
};

const TooltipContent = forwardRef<
  ElementRef<typeof RadixTooltip.Content>,
  TooltipContentProps
>(({ className, children, shortcut, description, sideOffset = 6, ...props }, ref) => {
  const isMultiLine = description != null;
  const container = usePortalContainer();
  return (
    <RadixTooltip.Portal container={container}>
      <RadixTooltip.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-[1100] select-none",
          // Stays dark in both themes — ink in light, elevated neutral-700 in dark.
          "bg-opt-ink text-opt-neutral-50",
          "dark:bg-opt-neutral-700 dark:text-opt-neutral-50",
          // Shape
          "rounded-opt-md shadow-[0_2px_8px_rgba(0,0,0,0.20)]",
          // Geometry
          isMultiLine
            ? "max-w-[240px] py-[8px] px-[10px] flex flex-col gap-[2px]"
            : "h-[24px] inline-flex items-center gap-opt-xs py-[6px] px-[10px]",
          // Typography
          "text-[12px] font-opt-medium leading-[12px]",
          // Open animation
          "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
          "data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1",
          className,
        )}
        {...props}
      >
        {isMultiLine ? (
          <>
            <span className="font-opt-semibold leading-[16px]">{children}</span>
            <span className="text-[11px] leading-[16px] opacity-80">{description}</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            {shortcut && (
              <kbd
                className={cn(
                  "inline-flex items-center justify-center",
                  "h-[16px] min-w-[16px] px-[4px]",
                  "rounded-opt-sm font-opt-mono text-[10px] font-opt-medium",
                  // Kbd chip: neutral-800 on ink (light), neutral-900 on neutral-700 (dark)
                  "bg-opt-neutral-800 text-opt-neutral-50",
                  "dark:bg-opt-neutral-900 dark:text-opt-neutral-50",
                )}
              >
                {shortcut}
              </kbd>
            )}
          </>
        )}
        <RadixTooltip.Arrow
          width={12}
          height={6}
          className="fill-opt-ink dark:fill-opt-neutral-700"
        />
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  );
});
TooltipContent.displayName = "TooltipContent";

// Convenience wrapper for the common single-string case
type TooltipProps = {
  label: ReactNode;
  shortcut?: string;
  description?: ReactNode;
  side?: ComponentPropsWithoutRef<typeof RadixTooltip.Content>["side"];
  align?: ComponentPropsWithoutRef<typeof RadixTooltip.Content>["align"];
  delayDuration?: number;
  children: ReactNode;
};

const Tooltip = ({
  label,
  shortcut,
  description,
  side = "top",
  align,
  delayDuration = 200,
  children,
}: TooltipProps) => (
  <TooltipProvider delayDuration={delayDuration} skipDelayDuration={0}>
    <TooltipRoot>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align} shortcut={shortcut} description={description}>
        {label}
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
);

export {
  Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
};
export type { TooltipProps, TooltipContentProps };
