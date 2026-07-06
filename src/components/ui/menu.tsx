import { Check, ChevronRight } from "lucide-react";
import { DropdownMenu as RadixMenu } from "radix-ui";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Dropdown action list. Items with optional icons, shortcuts, dividers,
 * checkboxes, and submenus. Built on Popover geometry, anchored to a trigger.
 *
 * Item parts:  Icon · Label · Shortcut · Trailing
 * Item types:  default · check · submenu · destructive · label
 * Item height: 28px · 6px y-padding · 8px x-padding
 */
const Menu = RadixMenu.Root;
const MenuTrigger = RadixMenu.Trigger;
const MenuPortal = RadixMenu.Portal;
const MenuGroup = RadixMenu.Group;
const MenuRadioGroup = RadixMenu.RadioGroup;
const MenuSub = RadixMenu.Sub;
const MenuSubTrigger = forwardRef<
  ElementRef<typeof RadixMenu.SubTrigger>,
  ComponentPropsWithoutRef<typeof RadixMenu.SubTrigger> & {
    leadingIcon?: ReactNode;
  }
>(({ className, leadingIcon, children, ...props }, ref) => (
  <RadixMenu.SubTrigger
    ref={ref}
    className={cn(
      "group flex items-center gap-opt-sm select-none outline-none cursor-pointer",
      "h-[28px] px-opt-sm py-[6px] rounded-opt-sm",
      "text-opt-md text-opt-text-primary",
      "data-[state=open]:bg-opt-interactive-ghost-hover data-[highlighted]:bg-opt-interactive-ghost-hover",
      className,
    )}
    {...props}
  >
    <span className="inline-flex flex-shrink-0 w-[14px] h-[14px] items-center justify-center text-opt-text-placeholder" aria-hidden="true">
      {leadingIcon}
    </span>
    <span className="flex-1 min-w-0">{children}</span>
    <ChevronRight size={12} strokeWidth={2} className="text-opt-text-secondary" aria-hidden="true" />
  </RadixMenu.SubTrigger>
));
MenuSubTrigger.displayName = "MenuSubTrigger";

// ── Content surface ────────────────────────────────────────────
const contentClass = cn(
  "z-50 min-w-[200px] outline-none",
  "bg-opt-surface-raised dark:bg-opt-neutral-850",
  "border border-opt-border-subtle dark:border-opt-neutral-800",
  "rounded-opt-md p-[4px]",
  "shadow-opt-md",
  "dark:shadow-[0_4px_12px_rgba(0,0,0,0.40),0_2px_4px_rgba(0,0,0,0.20)]",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
);

const MenuContent = forwardRef<
  ElementRef<typeof RadixMenu.Content>,
  ComponentPropsWithoutRef<typeof RadixMenu.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <MenuPortal>
    <RadixMenu.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(contentClass, className)}
      {...props}
    />
  </MenuPortal>
));
MenuContent.displayName = "MenuContent";

const MenuSubContent = forwardRef<
  ElementRef<typeof RadixMenu.SubContent>,
  ComponentPropsWithoutRef<typeof RadixMenu.SubContent>
>(({ className, ...props }, ref) => (
  <MenuPortal>
    <RadixMenu.SubContent
      ref={ref}
      sideOffset={4}
      className={cn(contentClass, className)}
      {...props}
    />
  </MenuPortal>
));
MenuSubContent.displayName = "MenuSubContent";

// ── Items ──────────────────────────────────────────────────────
type MenuItemBase = {
  leadingIcon?: ReactNode;
  shortcut?: string;
  destructive?: boolean;
};

const itemBase = (destructive?: boolean) =>
  cn(
    "group flex items-center gap-opt-sm select-none outline-none cursor-pointer",
    "h-[28px] px-opt-sm py-[6px] rounded-opt-sm",
    "text-opt-md",
    destructive ? "text-opt-red-700 dark:text-opt-red-100" : "text-opt-text-primary",
    "data-[highlighted]:bg-opt-interactive-ghost-hover",
    "data-[disabled]:text-opt-neutral-300 data-[disabled]:cursor-not-allowed",
  );

type MenuItemProps = ComponentPropsWithoutRef<typeof RadixMenu.Item> & MenuItemBase;

const MenuItem = forwardRef<ElementRef<typeof RadixMenu.Item>, MenuItemProps>(
  ({ className, leadingIcon, shortcut, destructive, children, ...props }, ref) => (
    <RadixMenu.Item
      ref={ref}
      className={cn(itemBase(destructive), className)}
      {...props}
    >
      <ItemIcon>{leadingIcon}</ItemIcon>
      <span className="flex-1 min-w-0">{children}</span>
      {shortcut && <Shortcut>{shortcut}</Shortcut>}
    </RadixMenu.Item>
  ),
);
MenuItem.displayName = "MenuItem";

// ── Check item ─────────────────────────────────────────────────
type MenuCheckItemProps = ComponentPropsWithoutRef<typeof RadixMenu.CheckboxItem> & {
  shortcut?: string;
};

const MenuCheckItem = forwardRef<
  ElementRef<typeof RadixMenu.CheckboxItem>,
  MenuCheckItemProps
>(({ className, shortcut, children, ...props }, ref) => (
  <RadixMenu.CheckboxItem
    ref={ref}
    className={cn(itemBase(), className)}
    {...props}
  >
    <span className="inline-flex flex-shrink-0 w-[14px] h-[14px] items-center justify-center text-opt-text-heading" aria-hidden="true">
      <RadixMenu.ItemIndicator>
        <Check size={12} strokeWidth={3} />
      </RadixMenu.ItemIndicator>
    </span>
    <span className="flex-1 min-w-0">{children}</span>
    {shortcut && <Shortcut>{shortcut}</Shortcut>}
  </RadixMenu.CheckboxItem>
));
MenuCheckItem.displayName = "MenuCheckItem";

// ── Radio item ─────────────────────────────────────────────────
type MenuRadioItemProps = ComponentPropsWithoutRef<typeof RadixMenu.RadioItem> & {
  shortcut?: string;
};

const MenuRadioItem = forwardRef<
  ElementRef<typeof RadixMenu.RadioItem>,
  MenuRadioItemProps
>(({ className, shortcut, children, ...props }, ref) => (
  <RadixMenu.RadioItem
    ref={ref}
    className={cn(itemBase(), className)}
    {...props}
  >
    <span className="inline-flex flex-shrink-0 w-[14px] h-[14px] items-center justify-center" aria-hidden="true">
      <RadixMenu.ItemIndicator>
        <span className="w-[8px] h-[8px] rounded-opt-full bg-opt-ink dark:bg-opt-neutral-100" />
      </RadixMenu.ItemIndicator>
    </span>
    <span className="flex-1 min-w-0">{children}</span>
    {shortcut && <Shortcut>{shortcut}</Shortcut>}
  </RadixMenu.RadioItem>
));
MenuRadioItem.displayName = "MenuRadioItem";

// ── Label · group header ───────────────────────────────────────
const MenuLabel = forwardRef<
  ElementRef<typeof RadixMenu.Label>,
  ComponentPropsWithoutRef<typeof RadixMenu.Label>
>(({ className, ...props }, ref) => (
  <RadixMenu.Label
    ref={ref}
    className={cn(
      "font-opt-mono uppercase font-opt-semibold",
      "text-[10px] leading-[12px] tracking-[0.12em]",
      "text-opt-text-secondary",
      "pt-[8px] pb-[4px] px-opt-sm",
      className,
    )}
    {...props}
  />
));
MenuLabel.displayName = "MenuLabel";

// ── Separator ──────────────────────────────────────────────────
const MenuSeparator = forwardRef<
  ElementRef<typeof RadixMenu.Separator>,
  ComponentPropsWithoutRef<typeof RadixMenu.Separator>
>(({ className, ...props }, ref) => (
  <RadixMenu.Separator
    ref={ref}
    className={cn("h-px my-[4px] mx-[8px] bg-opt-border-subtle dark:bg-opt-neutral-800", className)}
    {...props}
  />
));
MenuSeparator.displayName = "MenuSeparator";

// ── Internal helpers ───────────────────────────────────────────
function ItemIcon({ children }: { children?: ReactNode }) {
  return (
    <span className="inline-flex flex-shrink-0 w-[14px] h-[14px] items-center justify-center text-opt-text-placeholder group-data-[highlighted]:text-opt-text-primary" aria-hidden="true">
      {children}
    </span>
  );
}

function Shortcut({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center font-opt-mono text-[10px] text-opt-text-secondary tabular-nums">
      {children}
    </kbd>
  );
}

// Pure presentation kbd for shortcut text in stories
const MenuShortcut = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center font-opt-mono text-[10px] text-opt-text-secondary tabular-nums",
        className,
      )}
      {...props}
    />
  ),
);
MenuShortcut.displayName = "MenuShortcut";

export {
  Menu,
  MenuTrigger,
  MenuPortal,
  MenuContent,
  MenuItem,
  MenuCheckItem,
  MenuRadioItem,
  MenuRadioGroup,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
  MenuLabel,
  MenuSeparator,
  MenuGroup,
  MenuShortcut,
};
export type { MenuItemProps, MenuCheckItemProps, MenuRadioItemProps };
