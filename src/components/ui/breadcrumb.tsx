import { ChevronRight, MoreHorizontal } from "lucide-react";
import {
  forwardRef,
  Fragment,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Where am I? Path from root to current page with chevron separators.
 *
 * Parent items sit at 13/400 muted; the current page steps up to 13/500 ink.
 * Chevron separators use neutral-300 to signal direction.
 *
 * When the path exceeds 3 levels, middle items collapse into a clickable
 * ellipsis chip (auto-truncation is the consumer's call; pass `truncated`).
 */

type BreadcrumbProps = HTMLAttributes<HTMLElement>;

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn("text-[13px] leading-[18px]", className)}
      {...props}
    >
      <ol className="inline-flex items-center gap-[6px]">{children}</ol>
    </nav>
  ),
);
Breadcrumb.displayName = "Breadcrumb";

// ── Single item ────────────────────────────────────────────────
type BreadcrumbItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Marks this as the current page — bolds + darkens, removes the link affordance. */
  current?: boolean;
  /** Optional leading icon, sized by consumer (12–14px ideal). */
  leadingIcon?: ReactNode;
};

const BreadcrumbItem = forwardRef<HTMLAnchorElement, BreadcrumbItemProps>(
  ({ className, current, leadingIcon, children, href, ...props }, ref) => {
    const baseClasses = cn(
      "inline-flex items-center gap-[4px]",
      "transition-colors duration-opt-fast ease-opt-standard",
      "rounded-opt-sm",
    );
    if (current) {
      return (
        <li className={cn(baseClasses, "font-opt-medium text-opt-text-heading", className)} aria-current="page">
          {leadingIcon && <span aria-hidden="true" className="inline-flex">{leadingIcon}</span>}
          {children}
        </li>
      );
    }
    return (
      <li className="inline-flex items-center">
        <a
          ref={ref}
          href={href}
          className={cn(
            baseClasses,
            "text-opt-text-secondary",
            "hover:text-opt-text-heading hover:underline underline-offset-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-ink",
            className,
          )}
          {...props}
        >
          {leadingIcon && <span aria-hidden="true" className="inline-flex">{leadingIcon}</span>}
          {children}
        </a>
      </li>
    );
  },
);
BreadcrumbItem.displayName = "BreadcrumbItem";

// ── Separator ──────────────────────────────────────────────────
const BreadcrumbSeparator = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn("inline-flex text-opt-neutral-300", className)}
      {...props}
    >
      <ChevronRight size={12} strokeWidth={2} />
    </li>
  ),
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

// ── Ellipsis (collapsed middle items) ──────────────────────────
type BreadcrumbEllipsisProps = HTMLAttributes<HTMLButtonElement>;

const BreadcrumbEllipsis = forwardRef<HTMLButtonElement, BreadcrumbEllipsisProps>(
  ({ className, ...props }, ref) => (
    <li className="inline-flex items-center">
      <button
        ref={ref}
        type="button"
        aria-label="Show hidden segments"
        className={cn(
          "inline-flex items-center justify-center h-[18px] px-[4px] rounded-opt-sm",
          "bg-opt-neutral-100 text-opt-text-secondary",
          "hover:bg-opt-interactive-ghost-hover hover:text-opt-text-heading",
          "transition-colors duration-opt-fast ease-opt-standard",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-ink",
          className,
        )}
        {...props}
      >
        <MoreHorizontal size={12} strokeWidth={2} aria-hidden="true" />
      </button>
    </li>
  ),
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

// ── Convenience: auto-build from path array ────────────────────
type BreadcrumbPath = {
  label: ReactNode;
  href?: string;
  leadingIcon?: ReactNode;
};

type BreadcrumbAutoProps = HTMLAttributes<HTMLElement> & {
  items: BreadcrumbPath[];
  /** Collapse middle items into "…" when the path is longer than this. */
  maxItems?: number;
};

const BreadcrumbAuto = forwardRef<HTMLElement, BreadcrumbAutoProps>(
  ({ items, maxItems = 4, className, ...props }, ref) => {
    let visible = items;
    let collapsed = false;
    if (items.length > maxItems) {
      visible = [items[0], items[items.length - 2], items[items.length - 1]];
      collapsed = true;
    }
    return (
      <Breadcrumb ref={ref} className={className} {...props}>
        {visible.map((item, i) => {
          const isLast = i === visible.length - 1;
          return (
            <Fragment key={i}>
              <BreadcrumbItem
                href={item.href}
                current={isLast}
                leadingIcon={item.leadingIcon}
              >
                {item.label}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
              {collapsed && i === 0 && (
                <>
                  <BreadcrumbEllipsis />
                  <BreadcrumbSeparator />
                </>
              )}
            </Fragment>
          );
        })}
      </Breadcrumb>
    );
  },
);
BreadcrumbAuto.displayName = "BreadcrumbAuto";

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbAuto,
};
export type { BreadcrumbProps, BreadcrumbItemProps, BreadcrumbAutoProps, BreadcrumbPath };
