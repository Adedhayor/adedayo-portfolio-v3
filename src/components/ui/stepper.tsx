import { Check } from "lucide-react";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Multi-step progress indicator. Numbered markers, connectors, and labels —
 * orientation flips between horizontal flows and vertical timelines.
 *
 * Marker · 24px circle · 1px border · ring on current
 * States · complete · current · upcoming
 *   complete  · ink fill · white check
 *   current   · white fill · ink border · 4px ring at 10%
 *   upcoming  · muted fill · neutral border
 *
 * Connectors are siblings of markers (not nested inside them) so they read
 * the same in both orientations: 6px gap from each marker edge, fixed extent
 * between markers, line color reflects the source marker.
 */
type StepStatus = "complete" | "current" | "upcoming";

type Step = {
  /** Required — used as the React key. */
  id: string;
  label: ReactNode;
  description?: ReactNode;
  /** Override the auto-derived status. */
  status?: StepStatus;
};

type StepperProps = HTMLAttributes<HTMLOListElement> & {
  steps: Step[];
  /** Index of the current step (0-based). */
  current: number;
  orientation?: "horizontal" | "vertical";
};

function deriveStatus(steps: Step[], current: number, i: number): StepStatus {
  const override = steps[i]?.status;
  if (override) return override;
  if (i < current) return "complete";
  if (i === current) return "current";
  return "upcoming";
}

function connectorColor(sourceStatus: StepStatus): string {
  return sourceStatus === "complete"
    ? "bg-opt-ink dark:bg-opt-neutral-100"
    : "bg-opt-border-default";
}

const Stepper = forwardRef<HTMLOListElement, StepperProps>(
  ({ steps, current, orientation = "horizontal", className, ...props }, ref) => {
    if (orientation === "horizontal") {
      return (
        <ol
          ref={ref}
          className={cn("grid items-start w-full", className)}
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
          {...props}
        >
          {steps.map((step, i) => {
            const status = deriveStatus(steps, current, i);
            const isFirst = i === 0;
            const prevStatus = isFirst
              ? undefined
              : deriveStatus(steps, current, i - 1);
            return (
              <li
                key={step.id}
                className="relative flex flex-col items-center min-w-0"
              >
                {/*
                  Connector lives in this column but spans LEFT into the prior
                  column. Anchored relative to BOTH markers' centers via the
                  18px inset (marker radius 12 + 6px gap). Equal columns make
                  the math symmetrical.
                */}
                {!isFirst && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-[12px] h-px",
                      "left-[calc(-50%+18px)] right-[calc(50%+18px)]",
                      connectorColor(prevStatus ?? "upcoming"),
                    )}
                  />
                )}
                <StepMarker index={i + 1} status={status} />
                <div className="mt-opt-xs flex flex-col items-center text-center gap-[2px] w-full px-[4px]">
                  <span
                    className={cn(
                      "text-[13px] leading-[18px] font-opt-medium break-words",
                      status === "upcoming"
                        ? "text-opt-text-secondary"
                        : "text-opt-text-heading",
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-[12px] leading-[16px] text-opt-text-secondary break-words">
                      {step.description}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      );
    }

    // Vertical: `min-h-[64px]` on each row holds marker-to-marker pitch
    // uniform regardless of text height. The connector is a fixed 24px
    // tick anchored 6px below the marker — extra space (when content
    // exceeds 64px) sits as whitespace below the tick, so the tick
    // itself stays the same crisp height in every row.
    return (
      <ol
        ref={ref}
        className={cn("flex flex-col", className)}
        {...props}
      >
        {steps.map((step, i) => {
          const status = deriveStatus(steps, current, i);
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.id}
              className={cn(
                "flex items-start gap-opt-sm",
                // Fixed pitch keeps marker centers a uniform 64px apart.
                // Last row can shrink because it has no connector following.
                !isLast && "min-h-[64px]",
              )}
            >
              <div className="relative flex-shrink-0 w-[24px] self-stretch">
                <StepMarker index={i + 1} status={status} />
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute w-px",
                      // top 30 = 24 marker + 6 gap; fixed 24px tick height
                      "left-[calc(50%-0.5px)] top-[30px] h-[24px]",
                      connectorColor(status),
                    )}
                  />
                )}
              </div>
              <div className="flex flex-col gap-[2px] pt-[2px] flex-1 min-w-0">
                <span
                  className={cn(
                    "text-[13px] leading-[18px] font-opt-medium",
                    status === "upcoming"
                      ? "text-opt-text-secondary"
                      : "text-opt-text-heading",
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-[12px] leading-[16px] text-opt-text-secondary">
                    {step.description}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  },
);
Stepper.displayName = "Stepper";

// ── Marker · 24px circle ───────────────────────────────────────
function StepMarker({ index, status }: { index: number; status: StepStatus }) {
  if (status === "complete") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex items-center justify-center flex-shrink-0",
          "w-[24px] h-[24px] rounded-opt-full",
          "bg-opt-ink text-opt-neutral-0",
          "dark:bg-opt-neutral-100 dark:text-opt-ink",
        )}
      >
        <Check size={12} strokeWidth={3} />
      </span>
    );
  }
  if (status === "current") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex items-center justify-center flex-shrink-0",
          "w-[24px] h-[24px] rounded-opt-full",
          "bg-opt-surface-raised text-opt-text-heading",
          "border border-opt-ink dark:border-opt-neutral-100",
          "shadow-[0_0_0_4px_rgba(17,17,17,0.10)] dark:shadow-[0_0_0_4px_rgba(240,240,240,0.16)]",
          "font-opt-mono text-[11px] font-opt-semibold",
        )}
      >
        {index}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center flex-shrink-0",
        "w-[24px] h-[24px] rounded-opt-full",
        "bg-opt-neutral-50 text-opt-text-secondary",
        "border border-opt-border-default",
        "font-opt-mono text-[11px]",
        "dark:bg-opt-neutral-850 dark:border-opt-neutral-800",
      )}
    >
      {index}
    </span>
  );
}

// Re-export the same type even though StepText is no longer a component —
// keeps the external API stable in case stories were importing it.
type StepTextProps = {
  label: ReactNode;
  description?: ReactNode;
  status: StepStatus;
  orientation: "horizontal" | "vertical";
};
export type { StepTextProps };

export { Stepper };
export type { StepperProps, Step, StepStatus };
