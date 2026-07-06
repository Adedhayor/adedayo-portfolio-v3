import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import { Divider } from "./divider";

const meta: Meta<typeof Divider> = {
  title: "Atoms/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "1px line that separates content. Two orientations, three weights, optional label.",
      },
    },
  },
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
    weight:      { control: "radio", options: ["subtle", "default", "strong"] },
    align:       { control: "radio", options: ["start", "center"] },
  },
};
export default meta;

type Story = StoryObj<typeof Divider>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  render: (args) => (
    <div className="w-[480px]">
      <Divider {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="inline-flex items-center gap-opt-md h-[24px]">
      <span className="text-opt-md text-opt-text-primary">Edit</span>
      <Divider orientation="vertical" verticalHeight={16} />
      <span className="text-opt-md text-opt-text-primary">Duplicate</span>
    </div>
  ),
};

// ── Three weights ───────────────────────────────────────────────
export const Weights: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-2xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-3xl">
      <Row label="Subtle" spec="neutral-100 · 60% opacity">
        <Divider weight="subtle" />
      </Row>
      <Row label="Default" spec="neutral-200 · 100%">
        <Divider weight="default" />
      </Row>
      <Row label="Strong" spec="ink · 15% opacity">
        <Divider weight="strong" />
      </Row>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        3 weights · default for most contexts · subtle for resting panels · strong for emphasis
      </div>
    </div>
  ),
};

// ── Vertical · inline separator ─────────────────────────────────
export const InlineSeparator: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-md p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-md">
      <div className="inline-flex items-center gap-opt-md h-opt-xl">
        <button className="text-opt-md text-opt-text-primary">Edit</button>
        <Divider orientation="vertical" verticalHeight={16} />
        <button className="text-opt-md text-opt-text-primary">Duplicate</button>
        <Divider orientation="vertical" verticalHeight={16} />
        <button className="text-opt-md text-opt-text-primary">Share</button>
        <Divider orientation="vertical" verticalHeight={16} />
        <button className="text-opt-md text-opt-red-700">Delete</button>
      </div>
      <div className="inline-flex items-center gap-opt-sm h-opt-xl px-opt-sm border border-opt-border-default rounded-opt-sm bg-opt-surface-raised w-fit">
        <button className="text-opt-sm text-opt-text-primary px-[6px]">‹</button>
        <Divider orientation="vertical" verticalHeight={16} />
        <span className="text-opt-sm text-opt-text-primary px-[6px]">3 of 24</span>
        <Divider orientation="vertical" verticalHeight={16} />
        <button className="text-opt-sm text-opt-text-primary px-[6px]">›</button>
      </div>
      <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
        1px wide · self-stretch height or fixed (16/20/24px) · 16px inline gap
      </span>
    </div>
  ),
};

// ── With label · section break ──────────────────────────────────
export const SectionBreak: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Sample = () => (
      <div className="w-[360px] flex flex-col gap-opt-xl rounded-opt-lg bg-opt-surface-raised border border-opt-border-subtle p-opt-lg">
        <Divider label="Or continue with" />
        <Divider label="Recently shared" />
        <Divider label="Today" align="start" />
      </div>
    );
    return (
      <ThemePair
        sample={<Sample />}
        caption="Labeled dividers break a panel into sections — label inline with an 8px gap to the line, centered or anchored left. The hairline pivots with the theme (neutral-100 → neutral-800)."
      />
    );
  },
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
