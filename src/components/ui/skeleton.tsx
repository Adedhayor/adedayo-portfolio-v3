import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Placeholder shapes that match the final content's silhouette. Reduces
 * perceived load time. Three primitives compose every skeleton state:
 *
 *   Text  · scales with font size · radius 2px
 *   Block · arbitrary shape · radius matches content
 *   Avatar · circular · radius full
 *
 * Fill is neutral-100 at 60% opacity with a 1600ms shimmer.
 */
const skeletonVariants = cva(
  [
    "block bg-opt-neutral-100/60 dark:bg-opt-neutral-800/60",
    "relative overflow-hidden",
    "before:absolute before:inset-0",
    "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
    "before:[animation:opt-skeleton-shimmer_1600ms_ease-in-out_infinite]",
    "dark:before:via-white/10",
  ],
  {
    variants: {
      shape: {
        text:   "rounded-opt-sm",
        block:  "rounded-opt-md",
        avatar: "rounded-opt-full",
      },
    },
    defaultVariants: { shape: "block" },
  },
);

type SkeletonProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof skeletonVariants>;

const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
  ({ className, shape, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn(skeletonVariants({ shape }), className)}
      {...props}
    >
      <ShimmerKeyframes />
    </span>
  ),
);
Skeleton.displayName = "Skeleton";

// ── Convenience primitives ─────────────────────────────────────
type SkeletonTextProps = Omit<SkeletonProps, "shape"> & {
  /** Text height token. Default 16. Mapped to 12 / 16 / 20 per Paper. */
  size?: "sm" | "md" | "lg";
  /** Width fraction (0–1) or any valid CSS length. Defaults vary the rhythm. */
  width?: string | number;
};

const SkeletonText = forwardRef<HTMLSpanElement, SkeletonTextProps>(
  ({ size = "md", width, style, className, ...props }, ref) => {
    const height = size === "sm" ? 12 : size === "lg" ? 20 : 16;
    const resolvedWidth =
      typeof width === "number" ? `${width * 100}%` : width;
    return (
      <Skeleton
        ref={ref}
        shape="text"
        style={{ height: `${height}px`, width: resolvedWidth, ...style }}
        className={className}
        {...props}
      />
    );
  },
);
SkeletonText.displayName = "SkeletonText";

type SkeletonBlockProps = Omit<SkeletonProps, "shape"> & {
  width?: string | number;
  height?: string | number;
};

const SkeletonBlock = forwardRef<HTMLSpanElement, SkeletonBlockProps>(
  ({ width, height, style, className, ...props }, ref) => (
    <Skeleton
      ref={ref}
      shape="block"
      style={{ width, height, ...style }}
      className={className}
      {...props}
    />
  ),
);
SkeletonBlock.displayName = "SkeletonBlock";

type SkeletonAvatarProps = Omit<SkeletonProps, "shape"> & {
  size?: number;
};

const SkeletonAvatar = forwardRef<HTMLSpanElement, SkeletonAvatarProps>(
  ({ size = 32, style, className, ...props }, ref) => (
    <Skeleton
      ref={ref}
      shape="avatar"
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      className={cn("inline-block", className)}
      {...props}
    />
  ),
);
SkeletonAvatar.displayName = "SkeletonAvatar";

const ShimmerKeyframes = () => (
  <style>{`
    @keyframes opt-skeleton-shimmer {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `}</style>
);

export {
  Skeleton,
  SkeletonText,
  SkeletonBlock,
  SkeletonAvatar,
  skeletonVariants,
};
export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonBlockProps,
  SkeletonAvatarProps,
};
