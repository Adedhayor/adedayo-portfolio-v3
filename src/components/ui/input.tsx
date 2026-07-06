import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import {
  forwardRef,
  isValidElement,
  useCallback,
  useRef,
  useState,
  type ComponentType,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

// Truthy ReactNode check that rejects plain objects (e.g. `{}` that
// Storybook's auto-arg generation hands to unannotated ReactNode props).
function isRenderable(node: ReactNode): boolean {
  if (node == null || node === false || node === true || node === "") return false;
  if (typeof node === "string" || typeof node === "number") return true;
  if (Array.isArray(node)) return node.length > 0;
  return isValidElement(node);
}

/**
 * Wrapper container drives the visual shell. The inner `<input>` is borderless
 * and inherits color — it lives inside this wrapper so leading/trailing slots
 * can sit alongside.
 *
 * Focus state is driven by `focus-within:` on the wrapper, not on the input.
 *
 * Helper text & validation icons sit OUTSIDE the input — see
 * `Input.FieldMessage` at the bottom of this file.
 */
const inputShellVariants = cva(
  [
    "inline-flex items-center gap-opt-sm",
    "bg-opt-surface-raised border-[1.5px] border-opt-border-default rounded-opt-sm",
    "transition-colors duration-opt-fast ease-opt-standard",
    // Hover deepens border
    "hover:border-opt-neutral-300",
    // Focus pulls Ink + a soft 12% ink ring (per Paper spec). 2px offset.
    "focus-within:outline-none focus-within:border-opt-ink",
    "focus-within:shadow-[0_0_0_2px_rgba(17,17,17,0.12)]",
    "dark:focus-within:border-opt-neutral-100",
    "dark:focus-within:shadow-[0_0_0_2px_rgba(240,240,240,0.16)]",
  ],
  {
    variants: {
      size: {
        standard: "h-opt-2xl px-[10px] text-opt-md",
        compact:  "h-opt-xl  px-[10px] text-opt-sm",
      },
      state: {
        default: "",
        // Validation states reuse the focused border+ring pattern; only the hue changes.
        success: [
          "border-opt-green-700 shadow-[0_0_0_2px_rgba(31,140,94,0.12)]",
          "hover:border-opt-green-700",
          "focus-within:border-opt-green-700 focus-within:shadow-[0_0_0_2px_rgba(31,140,94,0.20)]",
          "dark:border-opt-green-500 dark:shadow-[0_0_0_2px_rgba(52,196,139,0.16)]",
        ].join(" "),
        warning: [
          "border-opt-amber-700 shadow-[0_0_0_2px_rgba(168,109,24,0.12)]",
          "hover:border-opt-amber-700",
          "focus-within:border-opt-amber-700 focus-within:shadow-[0_0_0_2px_rgba(168,109,24,0.20)]",
          "dark:border-opt-amber-500 dark:shadow-[0_0_0_2px_rgba(240,160,48,0.16)]",
        ].join(" "),
        error: [
          "border-opt-red-500 shadow-[0_0_0_2px_rgba(215,38,56,0.12)]",
          "hover:border-opt-red-500",
          "focus-within:border-opt-red-500 focus-within:shadow-[0_0_0_2px_rgba(215,38,56,0.20)]",
          "dark:shadow-[0_0_0_2px_rgba(215,38,56,0.20)]",
        ].join(" "),
      },
      disabled: {
        true: [
          "bg-opt-surface-low border-opt-border-subtle pointer-events-none",
          "hover:border-opt-border-subtle",
          // Override any state borders/rings when disabled wins
          "shadow-none",
        ].join(" "),
        false: "",
      },
    },
    defaultVariants: { size: "standard", state: "default", disabled: false },
  },
);

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> &
  Omit<VariantProps<typeof inputShellVariants>, "disabled"> & {
    /** Icon node placed before the value. */
    leadingIcon?: ReactNode;
    /** Custom trailing slot — rendered after value, before built-in actions (clear, eye, unit). */
    trailingIcon?: ReactNode;
    /** Shows a clear X button when the field has a value. Pair with `onClear`. */
    clearable?: boolean;
    onClear?: () => void;
    /** Trailing unit suffix (px, %, em). Designed for the property-panel number pattern. */
    unit?: string;
    /** Optional wrapper className override. The native input's className continues to go through `className` on the input itself. */
    shellClassName?: string;
  };

const InputBase = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      shellClassName,
      size,
      state,
      leadingIcon,
      trailingIcon,
      clearable,
      onClear,
      unit,
      type = "text",
      disabled,
      value,
      defaultValue,
      step,
      ...inputProps
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const effectiveType = type === "password" && showPassword ? "text" : type;

    // Internal ref so the number stepper can drive the native input; merged
    // with the forwarded ref so consumers still get their handle.
    const internalRef = useRef<HTMLInputElement>(null);
    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref],
    );

    // Step the native input by the requested direction. Uses the React-
    // controlled-input setter trick so onChange fires in both controlled
    // and uncontrolled modes.
    const handleStep = useCallback(
      (direction: 1 | -1) => {
        const el = internalRef.current;
        if (!el) return;
        if (direction > 0) el.stepUp();
        else el.stepDown();
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        setter?.call(el, el.value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      },
      [],
    );

    // The clear / unit slot logic depends on whether a value is present. For
    // uncontrolled inputs we conservatively show always-on; for controlled we
    // honor the value prop.
    const isControlled = value !== undefined;
    const hasValue = isControlled
      ? value !== "" && value !== null && value !== undefined
      : defaultValue !== "" && defaultValue !== undefined;

    return (
      <div
        className={cn(
          inputShellVariants({ size, state, disabled: !!disabled }),
          shellClassName,
        )}
        aria-disabled={disabled || undefined}
      >
        {isRenderable(leadingIcon) && (
          <span
            className={cn(
              "flex-shrink-0 inline-flex items-center justify-center",
              disabled ? "text-opt-neutral-300" : "text-opt-text-placeholder",
            )}
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        )}

        <input
          ref={setInputRef}
          type={effectiveType}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          step={step}
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none border-0",
            "text-opt-text-primary placeholder:text-opt-text-placeholder",
            "disabled:text-opt-neutral-300 disabled:cursor-not-allowed",
            // Mono digits for number inputs (property-panel spec)
            type === "number" && "font-opt-mono",
            // Spaced-out dots for password masks
            type === "password" && !showPassword && "tracking-[0.2em]",
            // Hide native number spinner — we render unit/stepper ourselves
            type === "number" &&
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0",
            className,
          )}
          {...inputProps}
        />

        {/* Custom trailing content rendered BEFORE built-in actions so consumers can chain. */}
        {isRenderable(trailingIcon) && (
          <span
            className={cn(
              "flex-shrink-0 inline-flex items-center justify-center",
              disabled ? "text-opt-neutral-300" : "text-opt-text-placeholder",
            )}
            aria-hidden="true"
          >
            {trailingIcon}
          </span>
        )}

        {unit && (
          <span
            className={cn(
              "flex-shrink-0 font-opt-mono text-[11px] leading-[14px]",
              disabled ? "text-opt-neutral-300" : "text-opt-text-placeholder",
            )}
          >
            {unit}
          </span>
        )}

        {type === "number" && !disabled && (
          <div className="flex-shrink-0 flex flex-col h-full -my-[1.5px] -mr-[6px] border-l border-opt-border-subtle">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => handleStep(1)}
              aria-label="Increment"
              className="flex-1 w-[18px] inline-flex items-center justify-center text-opt-text-placeholder hover:text-opt-text-primary hover:bg-opt-interactive-ghost-hover transition-colors duration-opt-fast ease-opt-standard"
            >
              <ChevronUp size={10} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => handleStep(-1)}
              aria-label="Decrement"
              className="flex-1 w-[18px] inline-flex items-center justify-center text-opt-text-placeholder hover:text-opt-text-primary hover:bg-opt-interactive-ghost-hover transition-colors duration-opt-fast ease-opt-standard border-t border-opt-border-subtle"
            >
              <ChevronDown size={10} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        )}

        {clearable && hasValue && !disabled && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear value"
            className="flex-shrink-0 w-[20px] h-[20px] -mr-[4px] inline-flex items-center justify-center rounded-opt-sm text-opt-text-link hover:bg-opt-interactive-ghost-hover transition-colors duration-opt-fast ease-opt-standard"
          >
            <X size={12} strokeWidth={2.5} aria-hidden="true" />
          </button>
        )}

        {type === "password" && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="flex-shrink-0 w-[20px] h-[20px] -mr-[4px] inline-flex items-center justify-center rounded-opt-sm text-opt-text-link hover:bg-opt-interactive-ghost-hover transition-colors duration-opt-fast ease-opt-standard"
          >
            {showPassword ? (
              <EyeOff size={14} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={14} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    );
  },
);
InputBase.displayName = "Input";

/**
 * Helper / validation message rendered below an Input. The icon defaults to a
 * sensible per-variant lucide glyph; pass `icon={false}` to omit it or a custom
 * `icon={MyIcon}` to override.
 *
 * Light: foreground is the 700 step (deepened). Dark: 100 step (lifted), per
 * Paper's "Three feedback states" composition.
 */
type FieldMessageVariant = "helper" | "success" | "warning" | "error";

const fieldMessageColor: Record<FieldMessageVariant, string> = {
  helper:  "text-opt-text-secondary",
  success: "text-opt-green-700 dark:text-opt-green-100",
  warning: "text-opt-amber-700 dark:text-opt-amber-100",
  error:   "text-opt-red-700 dark:text-opt-red-100",
};

const fieldMessageDefaultIcon: Record<FieldMessageVariant, ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }> | null> = {
  helper:  null,
  success: CheckCircle,
  warning: AlertTriangle,
  error:   AlertCircle,
};

type FieldMessageProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  variant?: FieldMessageVariant;
  /** Override the icon (or `false` to omit). */
  icon?: ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }> | false;
  children: ReactNode;
};

const FieldMessage = forwardRef<HTMLDivElement, FieldMessageProps>(
  ({ className, variant = "helper", icon, children, ...props }, ref) => {
    const Icon = icon === false ? null : icon ?? fieldMessageDefaultIcon[variant];
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-[4px] text-[11px] leading-[16px]",
          fieldMessageColor[variant],
          className,
        )}
        {...props}
      >
        {Icon && <Icon size={11} strokeWidth={2.5} aria-hidden className="flex-shrink-0" />}
        <span>{children}</span>
      </div>
    );
  },
);
FieldMessage.displayName = "Input.FieldMessage";

const Input = Object.assign(InputBase, { FieldMessage });

export { Input, inputShellVariants, FieldMessage };
export type { InputProps, FieldMessageProps };
