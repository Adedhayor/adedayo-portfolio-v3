import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { Dialog as RadixDialog } from "radix-ui";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Modal panel for focused tasks. Centered, dismissible, sized to content.
 * Backdrop blurs the canvas without removing it from sight.
 *
 * Six parts:
 *   Overlay · backdrop-blur, black/80 (light) → black/70 (dark)
 *   Content · 12px radius surface, 16px inset, 16px gap between sections
 *   Header  · 14/500 title + 12/400 muted description
 *   Body    · the task — form fields, choices, read-only content
 *   Footer  · justify-end actions
 *   Close   · ghost icon top-end (optional)
 */
const Dialog = RadixDialog.Root;
const DialogTrigger = RadixDialog.Trigger;
const DialogPortal = RadixDialog.Portal;

const DialogOverlay = forwardRef<
  ElementRef<typeof RadixDialog.Overlay>,
  ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-black/80 dark:bg-black/70",
      "backdrop-blur-[2px]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

// ── Content · sized surface ────────────────────────────────────
const contentVariants = cva(
  [
    "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
    "w-full max-h-[85vh] overflow-auto",
    "flex flex-col gap-opt-lg",
    "bg-opt-surface-raised dark:bg-opt-neutral-850",
    "border border-opt-border-subtle dark:border-opt-neutral-800",
    "rounded-[12px] p-opt-lg",
    "shadow-[0_10px_40px_rgba(0,0,0,0.20),0_2px_10px_rgba(0,0,0,0.10)]",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  ],
  {
    variants: {
      size: {
        sm:  "max-w-[384px]",
        md:  "max-w-[448px]",
        lg:  "max-w-[512px]",
        xl:  "max-w-[576px]",
        "2xl": "max-w-[768px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type DialogContentProps = ComponentPropsWithoutRef<typeof RadixDialog.Content> &
  VariantProps<typeof contentVariants> & {
    /** Hide the close button — for one-shot confirmations where Escape is the only exit. */
    hideClose?: boolean;
  };

const DialogContent = forwardRef<
  ElementRef<typeof RadixDialog.Content>,
  DialogContentProps
>(({ className, size, children, hideClose, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <RadixDialog.Content
      ref={ref}
      className={cn(contentVariants({ size }), className)}
      {...props}
    >
      {children}
      {!hideClose && (
        <RadixDialog.Close
          aria-label="Close"
          className={cn(
            "absolute top-opt-sm right-opt-sm",
            "inline-flex items-center justify-center w-[24px] h-[24px] rounded-opt-sm",
            "text-opt-text-secondary hover:text-opt-text-heading",
            "hover:bg-opt-interactive-ghost-hover",
            "transition-colors duration-opt-fast ease-opt-standard",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-ink",
            "dark:focus-visible:ring-opt-neutral-100",
          )}
        >
          <X size={14} strokeWidth={2} aria-hidden="true" />
        </RadixDialog.Close>
      )}
    </RadixDialog.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

// ── Header · title + description ───────────────────────────────
const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-[4px] pr-opt-xl", className)}
      {...props}
    />
  ),
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = forwardRef<
  ElementRef<typeof RadixDialog.Title>,
  ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={cn(
      "text-[14px] font-opt-medium leading-[20px] text-opt-text-heading",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = forwardRef<
  ElementRef<typeof RadixDialog.Description>,
  ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
  <RadixDialog.Description
    ref={ref}
    className={cn(
      "text-[12px] font-opt-regular leading-[18px] text-opt-text-secondary",
      className,
    )}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

// ── Body · the task content ────────────────────────────────────
const DialogBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-opt-md", className)}
      {...props}
    />
  ),
);
DialogBody.displayName = "DialogBody";

// ── Footer · justify-end actions ───────────────────────────────
const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-opt-sm",
        "max-sm:flex-col-reverse max-sm:items-stretch", // reverses to stack on mobile
        className,
      )}
      {...props}
    />
  ),
);
DialogFooter.displayName = "DialogFooter";

const DialogClose = RadixDialog.Close;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  contentVariants,
};
export type { DialogContentProps };
