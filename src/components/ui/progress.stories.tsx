import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar, Spinner } from "./progress";

const meta: Meta<typeof ProgressBar> = {
  title: "Atoms/Progress",
  component: ProgressBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Determinate bars for known durations, indeterminate spinners for \"still working\" moments. Ink fill on neutral-100 track, pill ends.",
      },
    },
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    tone: { control: "radio", options: ["ink", "success", "warning", "danger"] },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  args: { value: 64 },
  render: (args) => (
    <div className="w-[480px]">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { value: null },
  render: (args) => (
    <div className="w-[480px]">
      <ProgressBar {...args} />
    </div>
  ),
};

// ── Linear · three sizes × stages ───────────────────────────────
export const Linear: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-2xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-3xl">
      <Row label="sm · 4px" spec="inline / under list items">
        <ProgressBar size="sm" value={32} />
      </Row>
      <Row label="md · 6px · default" spec="forms / upload bars">
        <ProgressBar size="md" value={64} />
      </Row>
      <Row label="lg · 8px" spec="onboarding · stepper background">
        <ProgressBar size="lg" value={88} />
      </Row>
      <div className="pt-opt-md border-t border-opt-border-subtle">
        <Row label="Indeterminate · animated slider" spec="30% slug slides from -100% → 300% over 1200ms · use when duration is unknown">
          <ProgressBar value={null} />
        </Row>
      </div>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        3 heights · pill ends · ink fill on neutral-100 track · indeterminate slider
      </div>
    </div>
  ),
};

// ── Circular · spinner sizes ────────────────────────────────────
export const Circular: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-3xl">
      <div className="grid grid-cols-4 gap-opt-2xl items-end">
        {[
          { size: "xs" as const, label: "xs · 16", spec: "inline · button" },
          { size: "sm" as const, label: "sm · 24", spec: "default" },
          { size: "md" as const, label: "md · 32", spec: "empty state · panel" },
          { size: "lg" as const, label: "lg · 48", spec: "full-page load" },
        ].map((s) => (
          <div key={s.size} className="flex flex-col items-start gap-opt-md">
            <Spinner size={s.size} />
            <div className="flex flex-col gap-[2px]">
              <span className="text-opt-sm font-opt-medium text-opt-text-heading">{s.label}</span>
              <span className="font-opt-mono text-[10px] text-opt-text-secondary">{s.spec}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">With label</span>
        <div className="inline-flex items-center gap-opt-sm">
          <Spinner size="sm" />
          <span className="text-opt-md text-opt-text-primary">Syncing 12 of 24 layers…</span>
        </div>
      </div>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        4 sizes · 3/4-arc shape · 1200ms rotation · stroke scales 3 → 2 as size grows
      </div>
    </div>
  ),
};

// ── Tones ───────────────────────────────────────────────────────
export const Tones: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-md p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-3xl">
      <Row label="Ink · default" spec="standard progress">
        <ProgressBar value={64} tone="ink" />
      </Row>
      <Row label="Success · complete" spec="signal completion">
        <ProgressBar value={100} tone="success" />
      </Row>
      <Row label="Warning · stalled" spec="attention without panic">
        <ProgressBar value={50} tone="warning" />
      </Row>
      <Row label="Danger · failed" spec="error / over budget">
        <ProgressBar value={92} tone="danger" />
      </Row>
    </div>
  ),
};

function Row({
  label,
  spec,
  children,
}: {
  label: string;
  spec: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-opt-sm">
      <div className="flex items-baseline justify-between">
        <span className="text-opt-md font-opt-medium text-opt-text-heading">{label}</span>
        <span className="font-opt-mono text-[10px] text-opt-text-secondary">{spec}</span>
      </div>
      {children}
    </div>
  );
}

// ── In context · Upload + sync (light + dark) ───────────────────
export const InContext: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Card = () => (
      <div className="w-[400px] rounded-opt-lg bg-opt-surface-raised border border-opt-border-subtle p-opt-lg flex flex-col gap-opt-lg">
        {/* Active upload */}
        <div className="flex flex-col gap-opt-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-opt-md text-opt-text-heading">hero-banner.png</span>
            <span className="font-opt-mono text-opt-sm text-opt-text-secondary tabular-nums">
              64%
            </span>
          </div>
          <ProgressBar value={64} />
          <span className="text-opt-sm text-opt-text-secondary">
            2.1 MB of 3.3 MB · 4s remaining
          </span>
        </div>

        {/* Complete */}
        <div className="flex flex-col gap-opt-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-opt-md text-opt-text-heading">brand-assets.zip</span>
            <span className="font-opt-mono text-opt-sm font-opt-medium text-opt-accent-success-fg">
              Done
            </span>
          </div>
          <ProgressBar value={100} tone="success" />
        </div>

        {/* Indeterminate follow-up */}
        <div className="inline-flex items-center gap-opt-sm pt-opt-sm border-t border-opt-border-subtle">
          <Spinner size="sm" />
          <span className="text-opt-md text-opt-text-secondary">
            Indexing components…
          </span>
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<Card />}
        caption="Determinate bar with percentage, success-tinted on completion, then an indeterminate spinner for a follow-up step where duration is unknown. In dark mode the Ink fill inverts to white."
      />
    );
  },
};

// Light + dark side by side — the dark card scopes `.dark`, flipping every
// --opt-* token in its subtree. The sample renders identically in both.
function ThemePair({
  sample,
  caption,
}: {
  sample: React.ReactNode;
  caption: string;
}) {
  return (
    <div className="flex flex-col gap-opt-lg w-[920px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-opt-xl">
        <div className="flex flex-col gap-opt-sm">
          <span className="font-opt-mono text-[10px] font-opt-medium uppercase tracking-[0.14em] text-opt-text-placeholder">
            Light · :root
          </span>
          <div className="rounded-opt-xl bg-opt-surface-base border border-opt-border-subtle p-opt-xl flex justify-center">
            {sample}
          </div>
        </div>
        <div className="flex flex-col gap-opt-sm">
          <span className="font-opt-mono text-[10px] font-opt-medium uppercase tracking-[0.14em] text-opt-text-placeholder">
            Dark · .dark
          </span>
          <div className="dark rounded-opt-xl bg-opt-surface-base border border-opt-border-subtle p-opt-xl flex justify-center">
            {sample}
          </div>
        </div>
      </div>
      <p className="text-opt-md text-opt-text-secondary max-w-3xl">{caption}</p>
    </div>
  );
}
