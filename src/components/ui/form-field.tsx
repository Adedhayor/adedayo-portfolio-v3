import {
  forwardRef,
  useId,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { FieldMessage } from "./input";

/**
 * Labeled control with help, validation, and required indication. The smallest
 * unit of a form — Input (or Select / Checkbox) wrapped in semantic structure.
 *
 * Five slots, one stack:
 *   1. Label    · 13/500 ink, 6px above control
 *   2. Required · red asterisk inline with label
 *   3. Control  · the input itself (A03 Input by default; can be Select etc.)
 *   4. Help     · 11/400 muted, 4px below control
 *   5. Message  · 11/500 state-colored with icon; replaces Help when active
 *
 * State hue carries the validation signal — red error, green success, amber
 * warning. Disabled mutes the label.
 */
type FormFieldState = "default" | "success" | "warning" | "error";

type FormFieldProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Label text shown above the control. */
  label: ReactNode;
  /** Mark the field required — adds a red asterisk after the label. */
  required?: boolean;
  /** Help text shown below the control (replaced by `message` when message is set). */
  help?: ReactNode;
  /** State-colored validation message — replaces help when present. */
  message?: ReactNode;
  /** Validation state — drives the message hue. Pass to the control too if you want the border to react. */
  state?: FormFieldState;
  /** Disabled label styling — pair with `disabled` on the control. */
  disabled?: boolean;
  /**
   * The control. Must be a single element (Input, Select, Checkbox). We wire
   * id / aria-describedby automatically when possible.
   */
  children: ReactElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean; disabled?: boolean }>;
};

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { className, label, required, help, message, state = "default", disabled, children, ...props },
    ref,
  ) => {
    const reactId = useId();
    const controlId = (children.props.id as string | undefined) ?? `form-field-${reactId}`;
    const helperId = help || message ? `${controlId}-helper` : undefined;
    const messageVariant: "helper" | "success" | "warning" | "error" =
      message != null ? (state === "default" ? "helper" : state) : "helper";

    const enhancedChild = isValidElement(children)
      ? cloneElement(children, {
          id: controlId,
          "aria-describedby": helperId,
          "aria-invalid": state === "error" || undefined,
          disabled: children.props.disabled ?? disabled,
        })
      : children;

    const hasHelper = message != null || help != null;
    return (
      <div ref={ref} className={cn("flex flex-col", className)} {...props}>
        <label
          htmlFor={controlId}
          className={cn(
            "inline-flex items-baseline gap-[4px] mb-[6px]",
            "text-[13px] font-opt-medium leading-[16px]",
            disabled ? "text-opt-neutral-300" : "text-opt-text-heading",
          )}
        >
          <span>{label}</span>
          {required && (
            <span aria-hidden="true" className="text-opt-red-500">*</span>
          )}
        </label>

        {enhancedChild}

        {hasHelper && (
          <div className="mt-[4px]">
            {message != null ? (
              <FieldMessage id={helperId} variant={messageVariant}>
                {message}
              </FieldMessage>
            ) : (
              <FieldMessage id={helperId} variant="helper" icon={false}>
                {help}
              </FieldMessage>
            )}
          </div>
        )}
      </div>
    );
  },
);
FormField.displayName = "FormField";

export { FormField };
export type { FormFieldProps, FormFieldState };
