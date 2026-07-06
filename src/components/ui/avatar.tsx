import { cva, type VariantProps } from "class-variance-authority";
import { Avatar as RadixAvatar } from "radix-ui";
import { User } from "lucide-react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * User identity. The only legit use of radius.full in the system.
 *
 * Fallback chain: Image → Initials → User icon. Initials use white text on
 * Ink; the placeholder uses a neutral user icon on neutral-100.
 *
 * The 2px white border on stacks and presence dots is the one detail that
 * makes avatars feel finished — without it, overlapping circles smear and
 * the dot disappears against dark photos.
 */
const avatarVariants = cva(
  [
    "inline-flex items-center justify-center overflow-hidden flex-shrink-0",
    "rounded-opt-full select-none",
    "bg-opt-neutral-100 text-opt-text-primary",
  ],
  {
    variants: {
      size: {
        xs: "h-[20px] w-[20px] text-[9px] tracking-[0.04em]",
        sm: "h-[24px] w-[24px] text-[10px] tracking-[0.04em]",
        md: "h-[32px] w-[32px] text-[13px] tracking-[0.04em]",
        lg: "h-[40px] w-[40px] text-[15px] tracking-[0.04em]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type AvatarProps = ComponentPropsWithoutRef<typeof RadixAvatar.Root> &
  VariantProps<typeof avatarVariants> & {
    src?: string;
    alt?: string;
    /** Initials shown if the image is missing/loading. */
    initials?: string;
    /** Optional gradient fallback for image fill — used in stories/demos. */
    gradientFrom?: string;
    gradientTo?: string;
  };

const Avatar = forwardRef<
  ElementRef<typeof RadixAvatar.Root>,
  AvatarProps
>(({ className, size, src, alt, initials, gradientFrom, gradientTo, ...props }, ref) => {
  const hasGradient = gradientFrom && gradientTo;
  return (
    <RadixAvatar.Root
      ref={ref}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {src && (
        <RadixAvatar.Image
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      )}
      <RadixAvatar.Fallback
        delayMs={src ? 300 : undefined}
        className={cn(
          "h-full w-full flex items-center justify-center font-opt-semibold",
          initials
            ? "bg-opt-ink text-opt-neutral-0"
            : "bg-opt-neutral-100 text-opt-text-secondary",
        )}
        style={
          hasGradient && !initials
            ? { background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }
            : undefined
        }
      >
        {initials ?? (
          <User
            size={size === "lg" ? 18 : size === "md" ? 14 : size === "sm" ? 12 : 10}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        )}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
});
Avatar.displayName = "Avatar";

// ── Avatar stack — overlapping avatars with +N overflow ────────
type AvatarStackProps = HTMLAttributes<HTMLDivElement> & {
  /** Avatars to render. Pass as <Avatar /> children. Stack shows up to `max`. */
  children: ReactNode;
  /** Maximum avatars to show before "+N" overflow. Default 3. */
  max?: number;
  /** Total count, if greater than children length. Optional. */
  total?: number;
  size?: VariantProps<typeof avatarVariants>["size"];
};

const AvatarStack = forwardRef<HTMLDivElement, AvatarStackProps>(
  ({ children, max = 3, total, size = "md", className, ...props }, ref) => {
    const items = Array.isArray(children) ? children : [children];
    const visible = items.slice(0, max);
    const trueTotal = total ?? items.length;
    const overflow = trueTotal - visible.length;
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center", className)}
        {...props}
      >
        {visible.map((child, i) => (
          <div
            key={i}
            className="ring-[2px] ring-opt-surface-raised dark:ring-opt-surface-base rounded-opt-full"
            style={{ marginLeft: i === 0 ? 0 : -8 }}
          >
            {child}
          </div>
        ))}
        {overflow > 0 && (
          <div
            className="ring-[2px] ring-opt-surface-raised dark:ring-opt-surface-base rounded-opt-full"
            style={{ marginLeft: -8 }}
          >
            <Avatar
              size={size}
              initials={`+${overflow}`}
              className="bg-opt-neutral-100 text-opt-text-primary"
            />
          </div>
        )}
      </div>
    );
  },
);
AvatarStack.displayName = "AvatarStack";

// ── Avatar with presence dot — bottom-right anchored ───────────
type AvatarPresenceProps = HTMLAttributes<HTMLSpanElement> & {
  status: "online" | "away" | "offline";
  size?: VariantProps<typeof avatarVariants>["size"];
  children: ReactNode;
};

const presenceColor: Record<AvatarPresenceProps["status"], string> = {
  online:  "bg-opt-green-500",
  away:    "bg-opt-amber-500",
  offline: "bg-opt-neutral-300",
};

const AvatarPresence = forwardRef<HTMLSpanElement, AvatarPresenceProps>(
  ({ status, size = "md", children, className, ...props }, ref) => {
    // Dot scales loosely with avatar size; matches Paper's 10px reference at md.
    const dotPx = size === "lg" ? 12 : size === "md" ? 10 : size === "sm" ? 8 : 6;
    return (
      <span
        ref={ref}
        className={cn("relative inline-block", className)}
        {...props}
      >
        {children}
        <span
          aria-label={status}
          role="status"
          className={cn(
            "absolute bottom-0 right-0 rounded-opt-full",
            "ring-[2px] ring-opt-surface-raised dark:ring-opt-surface-base",
            presenceColor[status],
          )}
          style={{ width: `${dotPx}px`, height: `${dotPx}px` }}
        />
      </span>
    );
  },
);
AvatarPresence.displayName = "AvatarPresence";

export { Avatar, AvatarStack, AvatarPresence, avatarVariants };
export type { AvatarProps, AvatarStackProps, AvatarPresenceProps };
