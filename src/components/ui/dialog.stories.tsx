import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import { Button } from "./button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { FormField } from "./form-field";
import { Input } from "./input";
import { Segmented, SegmentedItem } from "./segmented";

const meta: Meta<typeof Dialog> = {
  title: "Molecules/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Modal panel for focused tasks. Centered, dismissible, sized to content. Backdrop blurs the canvas without removing it from sight.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Dialog>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>
            Give your project a new name. Collaborators will see the updated label.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <FormField label="Project name">
            <Input defaultValue="Spring campaign 2026" />
          </FormField>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="primary">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ── Five widths · sm / md / lg / xl / 2xl ───────────────────────
export const Sizes: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-md p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-2xl">
      <div className="flex flex-wrap gap-opt-sm">
        <SizeButton size="sm" title="Confirm action" body="Compact, single-question dialog." actions={["No", "Yes"]} />
        <SizeButton size="md" title="Rename project" body="Give your project a new name visible to collaborators." actions={["Cancel", "Save"]} />
        <SizeButton size="lg" title="Invite collaborators" body="Send invitations to your team or share a link with view-only access." actions={["Cancel", "Send invite"]} />
        <SizeButton size="xl" title="Export design" body="Choose format and resolution. Larger exports take longer to process." actions={["Cancel", "Export"]} />
      </div>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        5 widths · sm 384 · md 448 default · lg 512 · xl 576 · 2xl 768 · pick the smallest that fits
      </div>
    </div>
  ),
};

// ── Invite-team variant · with body content ─────────────────────
export const InviteTeam: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    // Static representation of the open dialog so both themes can render side by
    // side — the live DialogContent portals to <body>, which would escape the
    // per-column `.dark` scope. The live dialog is shown in Default / Sizes.
    const DialogCard = () => (
      <div className="w-[440px] rounded-opt-xl bg-opt-surface-raised border border-opt-border-subtle shadow-opt-md p-opt-xl flex flex-col gap-opt-lg">
        <div className="flex flex-col gap-opt-xs">
          <h3 className="text-opt-2xl font-opt-semibold text-opt-text-heading">Invite to team</h3>
          <p className="text-opt-md text-opt-text-secondary">
            Add collaborators by email. They&apos;ll get access to all team canvases.
          </p>
        </div>
        <div className="flex flex-col gap-opt-md">
          <FormField label="Email">
            <Input type="email" defaultValue="design@acme.com" />
          </FormField>
          <FormField label="Role">
            <Segmented defaultValue="editor">
              <SegmentedItem value="viewer">Viewer</SegmentedItem>
              <SegmentedItem value="editor">Editor</SegmentedItem>
              <SegmentedItem value="admin">Admin</SegmentedItem>
            </Segmented>
          </FormField>
        </div>
        <div className="flex justify-end gap-opt-sm">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Send invite</Button>
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<DialogCard />}
        caption="Invite dialog — header, two form fields, footer actions. Every control (input, segmented, buttons) reads from the semantic layer, so the whole modal re-themes without touching markup."
      />
    );
  },
};

// ── Helper for the Sizes story ──────────────────────────────────
type SizeButtonProps = {
  size: "sm" | "md" | "lg" | "xl" | "2xl";
  title: string;
  body: string;
  actions: [string, string];
};
function SizeButton({ size, title, body, actions }: SizeButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">{size.toUpperCase()}</Button>
      </DialogTrigger>
      <DialogContent size={size}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{body}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">{actions[0]}</Button>
          </DialogClose>
          <Button variant="primary">{actions[1]}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
