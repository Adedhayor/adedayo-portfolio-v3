import {
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
  type ExternalToast,
  type ToasterProps as SonnerToasterProps,
} from "sonner";
import {
  forwardRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Transient feedback that doesn't block the user. Appears bottom-right,
 * auto-dismisses, stacks (newest on top, max 3 visible).
 *
 * Five flavors: success · info · warning · error · loading.
 * Icon hue carries the type — surface stays neutral, no full-strip color.
 *
 * Rendering strategy: we own the entire toast markup via Sonner's
 * `toast.custom`. Sonner's built-in template splits icon / loader / action /
 * close across separate slots with their own positioning quirks — easier to
 * just render one component end-to-end.
 */
type ToastType = "default" | "success" | "info" | "warning" | "error" | "loading";

const ICON_BY_TYPE: Record<Exclude<ToastType, "default">, { Icon: LucideIcon; className: string; spin?: boolean }> = {
  success: { Icon: CheckCircle,   className: "text-opt-green-500" },
  info:    { Icon: Info,          className: "text-opt-blue-500" },
  warning: { Icon: TriangleAlert, className: "text-opt-amber-500" },
  error:   { Icon: AlertCircle,   className: "text-opt-red-500" },
  loading: { Icon: Loader2,       className: "text-opt-text-secondary", spin: true },
};

type RkToastProps = {
  id: string | number;
  type: ToastType;
  title: ReactNode;
  description?: ReactNode;
  action?: { label: ReactNode; onClick: (e: MouseEvent<HTMLButtonElement>) => void };
  /** Hide the dismiss × even when there's no inline action. Loading toasts force this. */
  dismissible?: boolean;
};

function RkToast({ id, type, title, description, action, dismissible }: RkToastProps) {
  const iconConfig = type === "default" ? null : ICON_BY_TYPE[type];
  // Loading toasts never show a dismiss X — they resolve programmatically.
  const showDismiss = type !== "loading" && dismissible !== false && action == null;

  return (
    <div
      className={cn(
        "flex items-start gap-opt-sm w-[360px] p-[10px]",
        "bg-opt-surface-raised dark:bg-opt-neutral-850",
        "border border-opt-border-subtle dark:border-opt-neutral-800",
        "rounded-opt-lg",
        "shadow-opt-md",
        "dark:shadow-[0_4px_12px_rgba(0,0,0,0.40),0_2px_4px_rgba(0,0,0,0.20)]",
      )}
      role={type === "error" ? "alert" : "status"}
    >
      {iconConfig && (
        <span className="flex-shrink-0 inline-flex items-center justify-center mt-[2px]">
          <iconConfig.Icon
            size={14}
            strokeWidth={2.5}
            aria-hidden="true"
            className={cn(iconConfig.className, iconConfig.spin && "animate-spin")}
          />
        </span>
      )}

      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-opt-medium leading-[18px] text-opt-text-heading">
          {title}
        </div>
        {description && (
          <div className="text-[12px] leading-[16px] text-opt-text-secondary mt-[2px]">
            {description}
          </div>
        )}
      </div>

      {action && (
        <button
          type="button"
          onClick={(e) => {
            action.onClick(e);
            sonnerToast.dismiss(id);
          }}
          className={cn(
            "flex-shrink-0 inline-flex items-center justify-center",
            "h-[24px] px-opt-sm rounded-opt-sm",
            "border border-opt-border-default bg-opt-surface-raised",
            "text-[12px] font-opt-medium text-opt-text-link",
            "hover:bg-opt-neutral-50 dark:hover:bg-opt-neutral-800",
            "transition-colors duration-opt-fast ease-opt-standard",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-ink",
            "dark:focus-visible:ring-opt-neutral-100",
          )}
        >
          {action.label}
        </button>
      )}

      {showDismiss && (
        <button
          type="button"
          onClick={() => sonnerToast.dismiss(id)}
          aria-label="Dismiss"
          className={cn(
            "flex-shrink-0 inline-flex items-center justify-center",
            "w-[20px] h-[20px] rounded-opt-sm -mr-[2px] -mt-[2px]",
            "text-opt-text-secondary hover:text-opt-text-heading",
            "hover:bg-opt-interactive-ghost-hover",
            "transition-colors duration-opt-fast ease-opt-standard",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-ink",
            "dark:focus-visible:ring-opt-neutral-100",
          )}
        >
          <X size={12} strokeWidth={2.5} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// ── Toaster · the portal root ──────────────────────────────────
type ToasterProps = Omit<SonnerToasterProps, "theme" | "richColors" | "closeButton">;

const Toaster = forwardRef<HTMLOListElement, ToasterProps>(
  ({ className, position = "bottom-right", expand = false, visibleToasts = 3, ...props }, _ref) => (
    <SonnerToaster
      position={position}
      expand={expand}
      visibleToasts={visibleToasts}
      offset={16}
      gap={8}
      duration={5000}
      // We render the whole toast via `toast.custom` — Sonner's built-in
      // close/icon/action slots stay out of the way.
      toastOptions={{ unstyled: true }}
      className={cn(className)}
      {...props}
    />
  ),
);
Toaster.displayName = "Toaster";

// ── Typed convenience helpers ──────────────────────────────────
type ToastInput = {
  title: ReactNode;
  description?: ReactNode;
  action?: { label: ReactNode; onClick: (e: MouseEvent<HTMLButtonElement>) => void };
  /** Hide the dismiss × even when there's no inline action. Defaults to showing the ×. */
  dismissible?: boolean;
} & Omit<ExternalToast, "action">;

function fire(type: ToastType, input: ToastInput) {
  const { title, description, action, dismissible, ...rest } = input;
  return sonnerToast.custom(
    (id) => (
      <RkToast
        id={id}
        type={type}
        title={title}
        description={description}
        action={action}
        dismissible={dismissible}
      />
    ),
    rest,
  );
}

const toast = {
  message: (input: ToastInput) => fire("default", input),
  success: (input: ToastInput) => fire("success", input),
  info:    (input: ToastInput) => fire("info",    input),
  warning: (input: ToastInput) => fire("warning", input),
  error:   (input: ToastInput) => fire("error",   input),
  loading: (input: ToastInput) => fire("loading", input),
  dismiss: (id?: number | string) => sonnerToast.dismiss(id),
};

export { Toaster, toast };
export type { ToasterProps, ToastInput, ToastType };
