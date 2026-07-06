import {
  forwardRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Spinner } from "./progress";

/**
 * Single-question modal. Used for irreversible or surprising actions where
 * Escape isn't enough — the user must commit or cancel.
 *
 * Composes M02 Dialog + A01 Button. Two variants:
 *
 *   default     · Ink confirm · use when the action is reversible / recoverable
 *   destructive · Red confirm · use when the action removes data, breaks
 *                 references, or can't be undone within the product
 *
 * Pass an async `onConfirm` and the confirm button auto-flips to a pending
 * spinner state — Cancel disables alongside it.
 */
type ConfirmDialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The question shown in the dialog title. */
  title: ReactNode;
  /** Body copy explaining the consequence. */
  description?: ReactNode;
  /** Cancel button text. Default "Cancel". */
  cancelLabel?: ReactNode;
  /** Confirm button text. Default "Confirm". */
  confirmLabel?: ReactNode;
  /** Flip confirm to brand red — the only product surface where red goes background. */
  destructive?: boolean;
  /** Called on confirm. If it returns a Promise, the dialog flips to pending. */
  onConfirm?: () => void | Promise<void>;
  /** Optional trigger — pass children to Dialog.Trigger via render prop. */
  trigger?: ReactNode;
};

const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(
  (
    {
      open,
      defaultOpen,
      onOpenChange,
      title,
      description,
      cancelLabel = "Cancel",
      confirmLabel = "Confirm",
      destructive,
      onConfirm,
      trigger,
    },
    _ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
    const [pending, setPending] = useState(false);

    const isControlled = open !== undefined;
    const actualOpen = isControlled ? open : internalOpen;

    const handleOpenChange = (next: boolean) => {
      if (pending) return; // Block close while a promise is in flight
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    };

    const handleConfirm = async () => {
      try {
        const result = onConfirm?.();
        if (result && typeof (result as Promise<void>).then === "function") {
          setPending(true);
          await result;
        }
        handleOpenChange(false);
      } finally {
        setPending(false);
      }
    };

    return (
      <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
        {trigger}
        <DialogContent size="sm" hideClose={destructive}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" disabled={pending}>
                {cancelLabel}
              </Button>
            </DialogClose>
            <Button
              variant={destructive ? "danger" : "primary"}
              disabled={pending}
              leadingIcon={pending ? <Spinner size="xs" tone={destructive ? "danger" : "ink"} /> : undefined}
              onClick={handleConfirm}
            >
              {pending ? `${typeof confirmLabel === "string" ? confirmLabel.replace(/\.+$/, "") : "Working"}…` : confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);
ConfirmDialog.displayName = "ConfirmDialog";

export { ConfirmDialog };
export type { ConfirmDialogProps };
