import { Popover as RadixPopover } from "radix-ui";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { usePortalContainer } from "@/lib/portal";

/**
 * Floating panel anchored to a trigger. Holds rich content too big for a
 * tooltip and too cheap for a dialog — mini-forms, pickers, info cards.
 *
 * Defaults to bottom with 4px offset. Flips automatically when clipped.
 * If it needs scroll or multi-step, promote to Dialog.
 */
const Popover = RadixPopover.Root;
const PopoverTrigger = RadixPopover.Trigger;
const PopoverAnchor = RadixPopover.Anchor;
const PopoverClose = RadixPopover.Close;

type PopoverContentProps = ComponentPropsWithoutRef<typeof RadixPopover.Content>;

const PopoverContent = forwardRef<
  ElementRef<typeof RadixPopover.Content>,
  PopoverContentProps
>(({ className, align = "start", sideOffset = 4, ...props }, ref) => {
  const container = usePortalContainer();
  return (
  <RadixPopover.Portal container={container}>
    <RadixPopover.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-[200] w-[288px] outline-none",
        "bg-opt-surface-raised dark:bg-opt-neutral-850",
        "border border-opt-border-subtle dark:border-opt-neutral-800",
        "rounded-opt-lg p-[10px]",
        "shadow-opt-md",
        "dark:shadow-[0_4px_12px_rgba(0,0,0,0.40),0_2px_4px_rgba(0,0,0,0.20)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
        "data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1",
        className,
      )}
      {...props}
    />
  </RadixPopover.Portal>
  );
});
PopoverContent.displayName = "PopoverContent";

// ── Optional Header / Body for the info-card pattern ──────────
type PopoverHeaderProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
};

const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  ({ className, title, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-[2px] pb-opt-xs", className)} {...props}>
      <h4 className="text-[13px] font-opt-medium leading-[18px] text-opt-text-heading">
        {title}
      </h4>
      {children && (
        <p className="text-[12px] leading-[16px] text-opt-text-secondary">{children}</p>
      )}
    </div>
  ),
);
PopoverHeader.displayName = "PopoverHeader";

const PopoverBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-opt-sm", className)} {...props} />
  ),
);
PopoverBody.displayName = "PopoverBody";

const PopoverFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-end gap-opt-xs pt-opt-xs", className)}
      {...props}
    />
  ),
);
PopoverFooter.displayName = "PopoverFooter";

export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
};
export type { PopoverContentProps };
