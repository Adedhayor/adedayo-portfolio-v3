import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown } from "lucide-react";
import { Select as RadixSelect } from "radix-ui";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { usePortalContainer } from "@/lib/portal";

/**
 * Trigger inherits the Input shell — same border weights, focus ring, and
 * disabled treatment — so Selects line up cleanly next to Inputs in forms.
 * The only shape difference is asymmetric padding (10/8) to host the chevron.
 */
const triggerVariants = cva(
  [
    "inline-flex items-center justify-between gap-opt-sm w-full",
    "bg-opt-surface-raised border-[1.5px] border-opt-border-default rounded-opt-sm",
    "pl-[10px] pr-[8px]",
    "text-opt-text-primary",
    "transition-colors duration-opt-fast ease-opt-standard",
    "hover:border-opt-neutral-300",
    "data-[placeholder]:text-opt-text-placeholder",
    // Focus pulls Ink + 12% ink ring — matches A03 Input
    "focus:outline-none focus-visible:border-opt-ink focus-visible:shadow-[0_0_0_2px_rgba(17,17,17,0.12)]",
    "dark:focus-visible:border-opt-neutral-100 dark:focus-visible:shadow-[0_0_0_2px_rgba(240,240,240,0.16)]",
    // Open state: border ink, no ring (Paper spec)
    "data-[state=open]:border-opt-ink data-[state=open]:hover:border-opt-ink",
    "dark:data-[state=open]:border-opt-neutral-100",
    // Disabled
    "disabled:bg-opt-surface-low disabled:border-opt-border-subtle disabled:cursor-not-allowed disabled:text-opt-neutral-300",
    "disabled:hover:border-opt-border-subtle",
  ],
  {
    variants: {
      size: {
        standard: "h-opt-2xl text-opt-md",
        compact:  "h-opt-xl  text-opt-sm",
      },
      state: {
        default: "",
        error: [
          "border-opt-red-500 shadow-[0_0_0_2px_rgba(215,38,56,0.12)]",
          "hover:border-opt-red-500",
          "focus-visible:border-opt-red-500 focus-visible:shadow-[0_0_0_2px_rgba(215,38,56,0.20)]",
          "data-[state=open]:border-opt-red-500",
        ].join(" "),
      },
    },
    defaultVariants: { size: "standard", state: "default" },
  },
);

const Select = RadixSelect.Root;
const SelectGroup = RadixSelect.Group;
const SelectValue = RadixSelect.Value;

type SelectTriggerProps = ComponentPropsWithoutRef<typeof RadixSelect.Trigger> &
  VariantProps<typeof triggerVariants>;

const SelectTrigger = forwardRef<
  ElementRef<typeof RadixSelect.Trigger>,
  SelectTriggerProps
>(({ className, size, state, children, ...props }, ref) => (
  <RadixSelect.Trigger
    ref={ref}
    className={cn(triggerVariants({ size, state }), className)}
    {...props}
  >
    {children}
    <RadixSelect.Icon asChild>
      <ChevronDown
        size={12}
        strokeWidth={2}
        aria-hidden="true"
        className="flex-shrink-0 text-opt-neutral-500 transition-transform duration-opt-fast ease-opt-standard data-[state=open]:rotate-180"
      />
    </RadixSelect.Icon>
  </RadixSelect.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = forwardRef<
  ElementRef<typeof RadixSelect.Content>,
  ComponentPropsWithoutRef<typeof RadixSelect.Content>
>(({ className, children, position = "popper", sideOffset = 4, ...props }, ref) => {
  const container = usePortalContainer();
  return (
  <RadixSelect.Portal container={container}>
    <RadixSelect.Content
      ref={ref}
      position={position}
      sideOffset={sideOffset}
      className={cn(
        "z-[200] overflow-hidden min-w-[var(--radix-select-trigger-width)]",
        "rounded-opt-md p-[4px]",
        "bg-opt-surface-raised border border-opt-border-default",
        "shadow-opt-md",
        "dark:border-opt-neutral-800",
        "dark:shadow-[0_4px_8px_rgba(0,0,0,0.30),0_1px_3px_rgba(0,0,0,0.20)]",
        // Open animation
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    >
      <RadixSelect.Viewport className="p-0">
        {children}
      </RadixSelect.Viewport>
    </RadixSelect.Content>
  </RadixSelect.Portal>
  );
});
SelectContent.displayName = "SelectContent";

/** Section header — eyebrow style matching Paper's 10/600/0.12em spec. */
const SelectLabel = forwardRef<
  ElementRef<typeof RadixSelect.Label>,
  ComponentPropsWithoutRef<typeof RadixSelect.Label>
>(({ className, ...props }, ref) => (
  <RadixSelect.Label
    ref={ref}
    className={cn(
      "font-opt-mono uppercase font-opt-semibold",
      "text-[10px] leading-[12px] tracking-[0.12em]",
      "text-opt-text-secondary",
      "pt-[8px] pb-[4px] px-[10px]",
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

type SelectItemProps = ComponentPropsWithoutRef<typeof RadixSelect.Item> & {
  /** Optional leading icon — 14px recommended, 8px gap. */
  leadingIcon?: ReactNode;
  /** Optional secondary description — flips item to multi-line layout. */
  description?: ReactNode;
};

const SelectItem = forwardRef<
  ElementRef<typeof RadixSelect.Item>,
  SelectItemProps
>(({ className, children, leadingIcon, description, ...props }, ref) => {
  const isMultiLine = description != null;
  return (
    <RadixSelect.Item
      ref={ref}
      className={cn(
        "relative flex select-none outline-none",
        "rounded-opt-sm text-opt-md text-opt-text-primary",
        // Single-line vs multi-line geometry
        isMultiLine
          ? "items-start gap-opt-sm py-[8px] px-[10px]"
          : "items-center gap-opt-sm h-opt-xl px-[10px]",
        // Hover / highlighted (keyboard) fill — same token as ghost-button hover
        "data-[highlighted]:bg-opt-interactive-ghost-hover",
        "data-[state=checked]:bg-opt-interactive-ghost-hover",
        // Disabled
        "data-[disabled]:text-opt-neutral-300 data-[disabled]:pointer-events-none",
        // Make room for the trailing check
        "pr-[28px]",
        className,
      )}
      {...props}
    >
      {leadingIcon && (
        <span
          className="flex-shrink-0 inline-flex items-center justify-center text-opt-text-placeholder mt-[1px]"
          aria-hidden="true"
        >
          {leadingIcon}
        </span>
      )}

      <span className="flex-1 min-w-0 flex flex-col gap-[2px]">
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        {description && (
          <span className="text-[11px] leading-[16px] text-opt-text-secondary">
            {description}
          </span>
        )}
      </span>

      <RadixSelect.ItemIndicator className="absolute right-[10px] top-[8px] inline-flex items-center justify-center">
        <Check size={12} strokeWidth={2.5} aria-hidden="true" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});
SelectItem.displayName = "SelectItem";

const SelectSeparator = forwardRef<
  ElementRef<typeof RadixSelect.Separator>,
  ComponentPropsWithoutRef<typeof RadixSelect.Separator>
>(({ className, ...props }, ref) => (
  <RadixSelect.Separator
    ref={ref}
    className={cn(
      "h-px my-[4px] mx-[8px] bg-opt-border-subtle dark:bg-opt-neutral-800",
      className,
    )}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  triggerVariants,
};
export type { SelectTriggerProps, SelectItemProps };
