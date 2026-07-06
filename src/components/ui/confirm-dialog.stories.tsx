import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import { Button } from "./button";
import { ConfirmDialog } from "./confirm-dialog";
import { DialogTrigger } from "./dialog";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Molecules/Confirmation Dialog",
  component: ConfirmDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Single-question modal. Used for irreversible or surprising actions where Escape isn't enough — the user must commit or cancel. Destructive flag flips Confirm to brand red.",
      },
    },
  },
  argTypes: {
    title:        { control: "text" },
    description:  { control: "text" },
    cancelLabel:  { control: "text" },
    confirmLabel: { control: "text" },
    destructive:  { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  args: {
    title: "Restore previous version?",
    description:
      "This will replace the current canvas with the version from yesterday. Your current changes will be saved as a new version.",
    cancelLabel: "Cancel",
    confirmLabel: "Restore",
    defaultOpen: true,
    trigger: (
      <DialogTrigger asChild>
        <Button variant="secondary">Restore version</Button>
      </DialogTrigger>
    ),
  },
};

export const Destructive: Story = {
  args: {
    title: 'Delete "Spring campaign 2026"?',
    description:
      "This canvas will be moved to trash. After 30 days it will be permanently deleted along with all versions and comments.",
    cancelLabel: "Cancel",
    confirmLabel: "Delete canvas",
    destructive: true,
    defaultOpen: true,
    trigger: (
      <DialogTrigger asChild>
        <Button variant="danger">Delete canvas</Button>
      </DialogTrigger>
    ),
  },
};

// ── Variants side by side ────────────────────────────────────────
export const Variants: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-md p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-3xl">
      <div className="grid grid-cols-2 gap-opt-md">
        <div className="flex flex-col gap-opt-sm">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Default · Ink confirm</span>
          <ConfirmDialog
            title="Restore previous version?"
            description="This will replace the current canvas with the version from yesterday. Your current changes will be saved as a new version."
            confirmLabel="Restore"
            trigger={
              <DialogTrigger asChild>
                <Button variant="secondary">Restore version</Button>
              </DialogTrigger>
            }
          />
          <span className="text-[11px] text-opt-text-secondary">
            Use when the action is reversible or recoverable. User just needs to confirm intent.
          </span>
        </div>
        <div className="flex flex-col gap-opt-sm">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Destructive · Red confirm</span>
          <ConfirmDialog
            destructive
            title='Delete "Spring campaign 2026"?'
            description="This canvas will be moved to trash. After 30 days it will be permanently deleted along with all versions and comments."
            confirmLabel="Delete canvas"
            trigger={
              <DialogTrigger asChild>
                <Button variant="danger">Delete canvas</Button>
              </DialogTrigger>
            }
          />
          <span className="text-[11px] text-opt-text-secondary">
            Use when the action removes data, breaks references, or can't be undone within the product.
          </span>
        </div>
      </div>
    </div>
  ),
};

// ── Pending · async confirm ─────────────────────────────────────
export const Pending: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    // Static representation of the open confirmation so both themes render side
    // by side; the live ConfirmDialog portals to <body> (see Default / Variants).
    const ConfirmCard = () => (
      <div className="w-[400px] rounded-opt-xl bg-opt-surface-raised border border-opt-border-subtle shadow-opt-md p-opt-xl flex flex-col gap-opt-lg">
        <div className="flex flex-col gap-opt-xs">
          <h3 className="text-opt-2xl font-opt-semibold text-opt-text-heading">Remove from team?</h3>
          <p className="text-opt-md text-opt-text-secondary">
            Ade will lose access to 4 canvases. They can be re-invited later.
          </p>
        </div>
        <div className="flex justify-end gap-opt-sm">
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Remove</Button>
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<ConfirmCard />}
        caption="Destructive confirmation — the title states the consequence and the danger button is the only red. Cancel stays ghost so the safe choice never competes for attention."
      />
    );
  },
};
