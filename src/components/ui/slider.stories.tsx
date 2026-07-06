import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "Atoms/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Continuous value selection along a track. 4px track (md), 16px thumb, radius-full. Fill inverts in dark mode — white fill on neutral-600 track.",
      },
    },
  },
  argTypes: {
    size:     { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    min:      { control: "number" },
    max:      { control: "number" },
    step:     { control: "number" },
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Slider>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default:  Story = { args: {} };
export const Low:      Story = { args: { defaultValue: [20] } };
export const High:     Story = { args: { defaultValue: [80] } };
export const Disabled: Story = { args: { defaultValue: [45], disabled: true } };
export const Range:    Story = { args: { defaultValue: [25, 75] } };

// ── States ───────────────────────────────────────────────────────
const Col = ({ label }: { label: string }) => (
  <span style={{ width: 160, flexShrink: 0 }} className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
    {label}
  </span>
);

export const States: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const rows = [
      { label: "30%", spec: "low value",  value: [30] as number[] },
      { label: "70%", spec: "high value", value: [70] as number[] },
    ];
    return (
      <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl" style={{ width: 860 }}>
        {/* header row */}
        <div className="flex items-center gap-opt-md">
          <div style={{ width: 80, flexShrink: 0 }} />
          <Col label="Default" />
          <Col label="Hover" />
          <Col label="Focused" />
          <Col label="Disabled" />
        </div>
        {/* data rows */}
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-opt-md border-t border-opt-border-subtle pt-opt-md">
            <div className="flex flex-col gap-[2px]" style={{ width: 80, flexShrink: 0 }}>
              <span className="text-opt-sm font-opt-medium text-opt-text-heading">{r.label}</span>
              <span className="font-opt-mono text-[10px] text-opt-text-secondary">{r.spec}</span>
            </div>
            <div style={{ width: 160, flexShrink: 0 }}><Slider defaultValue={r.value} /></div>
            <div style={{ width: 160, flexShrink: 0 }}><Slider defaultValue={r.value} /></div>
            <div style={{ width: 160, flexShrink: 0 }}><Slider defaultValue={r.value} /></div>
            <div style={{ width: 160, flexShrink: 0 }}><Slider defaultValue={r.value} disabled /></div>
          </div>
        ))}
        <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
          Hover = soft halo · Focus = ink ring 2px offset · Disabled = opacity 40%
        </div>
      </div>
    );
  },
};

// ── Sizes ───────────────────────────────────────────────────────
export const Sizes: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl" style={{ width: 560 }}>
      <div className="flex flex-col gap-opt-lg">
        {(
          [
            { size: "sm", spec: "sm · 2px track · 12px thumb" },
            { size: "md", spec: "md · 4px track · 16px thumb · default" },
            { size: "lg", spec: "lg · 6px track · 20px thumb" },
          ] as const
        ).map(({ size, spec }) => (
          <div key={size} className="flex items-center gap-opt-lg border-t border-opt-border-subtle pt-opt-md">
            <div className="flex flex-col gap-[2px]" style={{ width: 180, flexShrink: 0 }}>
              <span className="text-opt-sm font-opt-medium text-opt-text-heading">{size}</span>
              <span className="font-opt-mono text-[10px] text-opt-text-secondary">{spec}</span>
            </div>
            <Slider size={size} defaultValue={[45]} />
          </div>
        ))}
      </div>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        sm fits dense property panels · md everyday default · lg pairs with 16px labels
      </div>
    </div>
  ),
};

// ── Range ───────────────────────────────────────────────────────
export const RangeStory: Story = {
  name: "Range",
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl w-[560px]">
      <div className="flex flex-col gap-opt-lg">
        {(
          [
            { size: "sm", label: "sm · 10% – 80%", value: [10, 80] },
            { size: "md", label: "md · 25% – 65%", value: [25, 65] },
            { size: "lg", label: "lg · 30% – 70%", value: [30, 70] },
          ] as const
        ).map(({ size, label, value }) => (
          <div key={size} className="flex flex-col gap-opt-sm">
            <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">{label}</span>
            <Slider size={size} defaultValue={[...value]} />
          </div>
        ))}
      </div>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        Range fills only the span between the two thumbs · each thumb is independently focusable
      </div>
    </div>
  ),
};

// ── In context · Property panel + range field (light + dark) ────
function PanelRow({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-opt-md">
      <span className="w-[52px] shrink-0 text-opt-md text-opt-text-primary">{label}</span>
      <div className="flex-1">{children}</div>
      <span className="w-[40px] shrink-0 text-right font-opt-mono text-opt-sm text-opt-text-secondary tabular-nums">
        {value}
      </span>
    </div>
  );
}

export const InContext: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Card = () => (
      <div className="w-[420px] rounded-opt-lg bg-opt-surface-raised border border-opt-border-subtle p-opt-lg flex flex-col gap-opt-lg">
        {/* Property panel rows */}
        <div className="flex flex-col gap-opt-md">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.14em] text-opt-text-placeholder">
            Property panel
          </span>
          <PanelRow label="Opacity" value="80">
            <Slider defaultValue={[80]} />
          </PanelRow>
          <PanelRow label="Blur" value="4">
            <Slider defaultValue={[4]} max={16} />
          </PanelRow>
          <PanelRow label="Scale" value="1.0">
            <Slider defaultValue={[1]} min={0} max={4} step={0.1} disabled />
          </PanelRow>
        </div>

        {/* Range field with helper */}
        <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
          <div className="flex flex-col gap-opt-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-opt-md text-opt-text-heading">Budget range</span>
              <span className="font-opt-mono text-opt-sm text-opt-text-secondary tabular-nums">
                $200 – $800
              </span>
            </div>
            <Slider defaultValue={[200, 800]} min={0} max={1000} step={50} />
            <span className="text-opt-sm text-opt-text-secondary">
              Set your minimum and maximum spend per campaign.
            </span>
          </div>
          <div className="flex flex-col gap-opt-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-opt-md text-opt-text-heading">Volume</span>
              <span className="font-opt-mono text-opt-sm text-opt-text-secondary tabular-nums">
                72%
              </span>
            </div>
            <Slider defaultValue={[72]} />
          </div>
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<Card />}
        caption="Label left, value right in monospace — mirrors the property panel. Two-thumb range for a budget field with helper text below. In dark mode the fill inverts to white on a neutral-600 track and the thumb becomes the brightest element."
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
