import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle, Info, X } from "lucide-react";
import { Button } from "./button";
import { Toaster, toast } from "./toast";
import { ThemePair } from "./_in-context";

const meta: Meta<typeof Toaster> = {
  title: "Molecules/Toast",
  component: Toaster,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Transient feedback that doesn't block the user. Appears bottom-right, auto-dismisses, stacks. Five flavors keyed to system status. Icon hue carries the type — surface stays neutral.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Toaster>;

// ── Playground · fire toasts ────────────────────────────────────
export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-opt-sm">
      <div className="flex flex-wrap gap-opt-sm">
        <Button onClick={() =>
          toast.success({
            title: "Canvas saved",
            description: "Spring campaign 2026 · 2.4 MB",
          })
        }>Success</Button>
        <Button variant="secondary" onClick={() =>
          toast.info({
            title: "New version available",
            description: "Reload to get the latest features.",
            action: { label: "Reload", onClick: () => {} },
          })
        }>Info + action</Button>
        <Button variant="secondary" onClick={() =>
          toast.warning({
            title: "Connection unstable",
            description: "Changes will sync when you're back online.",
          })
        }>Warning</Button>
        <Button variant="danger" onClick={() =>
          toast.error({
            title: "Couldn't export",
            description: "Server returned 504. Try again in a moment.",
            action: { label: "Retry", onClick: () => {} },
          })
        }>Error</Button>
        <Button variant="secondary" onClick={() =>
          toast.loading({
            title: "Exporting…",
            description: "Spring campaign 2026 · 4096 × 2160 · PNG",
          })
        }>Loading</Button>
      </div>
      <Toaster />
    </div>
  ),
};

// ── Five status flavors ─────────────────────────────────────────
export const Flavors: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-md p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-3xl">
      <Button onClick={() => {
        toast.success({ title: "Canvas saved", description: "Spring campaign 2026 · 2.4 MB" });
        setTimeout(() => toast.info({ title: "New version available", description: "Reload to get the latest features.", action: { label: "Reload", onClick: () => {} } }), 200);
        setTimeout(() => toast.warning({ title: "Connection unstable", description: "Changes will sync when you're back online." }), 400);
        setTimeout(() => toast.error({ title: "Couldn't export", description: "Server returned 504. Try again in a moment.", action: { label: "Retry", onClick: () => {} } }), 600);
        setTimeout(() => toast.loading({ title: "Exporting…", description: "Spring campaign 2026 · 4096 × 2160 · PNG" }), 800);
      }}>
        Fire all 5
      </Button>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        Icon hue carries the type · surface stays neutral · no full-strip color
      </div>
      <Toaster />
    </div>
  ),
};

// ── Stacking · newest on top, max 3 ─────────────────────────────
export const Stacking: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    // Static representation of a toast stack so both themes render side by side;
    // the live Toaster renders to a fixed region (fire it from Default / Flavors).
    const ToastCard = ({
      icon,
      title,
      desc,
    }: {
      icon: React.ReactNode;
      title: string;
      desc: string;
    }) => (
      <div className="w-[320px] flex items-start gap-opt-sm rounded-opt-md bg-opt-surface-raised dark:bg-opt-neutral-850 border border-opt-border-default p-opt-md shadow-opt-md">
        <span className="mt-[1px]">{icon}</span>
        <div className="flex flex-col gap-[2px] flex-1 min-w-0">
          <span className="text-opt-md font-opt-medium text-opt-text-heading">{title}</span>
          <span className="text-opt-sm text-opt-text-secondary">{desc}</span>
        </div>
        <X size={14} strokeWidth={2} className="text-opt-text-placeholder shrink-0" aria-hidden="true" />
      </div>
    );
    const Stack = () => (
      <div className="flex flex-col items-center gap-opt-sm pt-[6px]">
        <ToastCard
          icon={<Info size={16} strokeWidth={2} className="text-opt-blue-500" />}
          title="Comment added"
          desc="By Sarah · 2s ago"
        />
        <div className="scale-[0.97] opacity-90">
          <ToastCard
            icon={<CheckCircle size={16} strokeWidth={2} className="text-opt-green-500" />}
            title="Canvas saved"
            desc="Spring campaign 2026"
          />
        </div>
        <div className="scale-[0.94] opacity-70">
          <ToastCard
            icon={<Info size={16} strokeWidth={2} className="text-opt-blue-500" />}
            title="Layer hidden"
            desc="Press H to show."
          />
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<Stack />}
        caption="Stacked toasts — newest on top, older ones dim and scale slightly behind. The surface steps to neutral-850 in dark; the type-coloured icon carries the status while the surface stays neutral."
      />
    );
  },
};
