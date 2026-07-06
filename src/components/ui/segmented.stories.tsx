import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import { Eye, Code, AlignLeft, Grid2x2, List, Frame, Circle, Triangle } from "lucide-react";
import { Segmented, SegmentedItem } from "./segmented";

const meta: Meta<typeof Segmented> = {
  title: "Atoms/Segmented Control",
  component: Segmented,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Mutually exclusive picker. Active segment lifts to white with elevation.xs — looks \"depressed-into-the-container\" inverted, like a real physical switch.",
      },
    },
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof Segmented>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  render: (args) => (
    <Segmented {...args} defaultValue="design">
      <SegmentedItem value="design" size={args.size}>Design</SegmentedItem>
      <SegmentedItem value="code" size={args.size}>Code</SegmentedItem>
      <SegmentedItem value="preview" size={args.size}>Preview</SegmentedItem>
    </Segmented>
  ),
};

// ── Three variants — text / with-icons / icon-only ──────────────
export const Variants: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-2xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-3xl">
      <div className="flex flex-col gap-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Text only</span>
        <Segmented defaultValue="design">
          <SegmentedItem value="design">Design</SegmentedItem>
          <SegmentedItem value="code">Code</SegmentedItem>
          <SegmentedItem value="preview">Preview</SegmentedItem>
        </Segmented>
      </div>

      <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">With icons</span>
        <Segmented defaultValue="frame">
          <SegmentedItem value="frame">
            <Frame size={14} strokeWidth={2} aria-hidden="true" />
            Frame
          </SegmentedItem>
          <SegmentedItem value="ellipse">
            <Circle size={14} strokeWidth={2} aria-hidden="true" />
            Section
          </SegmentedItem>
          <SegmentedItem value="polygon">
            <Triangle size={14} strokeWidth={2} aria-hidden="true" />
            Object
          </SegmentedItem>
        </Segmented>
      </div>

      <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Icon only · compact</span>
        <Segmented defaultValue="list" size="sm">
          <SegmentedItem value="list" size="sm" iconOnly aria-label="List view">
            <AlignLeft size={14} strokeWidth={2} aria-hidden="true" />
          </SegmentedItem>
          <SegmentedItem value="grid" size="sm" iconOnly aria-label="Grid view">
            <Grid2x2 size={14} strokeWidth={2} aria-hidden="true" />
          </SegmentedItem>
          <SegmentedItem value="rows" size="sm" iconOnly aria-label="Row view">
            <List size={14} strokeWidth={2} aria-hidden="true" />
          </SegmentedItem>
        </Segmented>
      </div>

      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        3 variants · text · text+icon · icon-only · 2–4 segments per control
      </div>
    </div>
  ),
};

// ── Three heights ───────────────────────────────────────────────
export const Sizes: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-3xl">
      <div className="grid grid-cols-[200px_1fr] gap-opt-lg items-center">
        <div className="flex flex-col gap-[2px]">
          <span className="text-opt-sm font-opt-medium text-opt-text-heading">sm · 28</span>
          <span className="font-opt-mono text-[10px] text-opt-text-secondary">compact toolbars</span>
        </div>
        <Segmented size="sm" defaultValue="design">
          <SegmentedItem value="design" size="sm">Design</SegmentedItem>
          <SegmentedItem value="code" size="sm">Code</SegmentedItem>
          <SegmentedItem value="preview" size="sm">Preview</SegmentedItem>
        </Segmented>

        <div className="flex flex-col gap-[2px]">
          <span className="text-opt-sm font-opt-medium text-opt-text-heading">md · 32 · default</span>
          <span className="font-opt-mono text-[10px] text-opt-text-secondary">everyday default</span>
        </div>
        <Segmented size="md" defaultValue="design">
          <SegmentedItem value="design">Design</SegmentedItem>
          <SegmentedItem value="code">Code</SegmentedItem>
          <SegmentedItem value="preview">Preview</SegmentedItem>
        </Segmented>

        <div className="flex flex-col gap-[2px]">
          <span className="text-opt-sm font-opt-medium text-opt-text-heading">lg · 36</span>
          <span className="font-opt-mono text-[10px] text-opt-text-secondary">marketing surfaces</span>
        </div>
        <Segmented size="lg" defaultValue="design">
          <SegmentedItem value="design" size="lg">Design</SegmentedItem>
          <SegmentedItem value="code" size="lg">Code</SegmentedItem>
          <SegmentedItem value="preview" size="lg">Preview</SegmentedItem>
        </Segmented>
      </div>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        3 sizes · default 32 · sm in compact toolbars · lg in marketing
      </div>
    </div>
  ),
};

// ── View switcher · canonical 2-segment example ─────────────────
export const ViewSwitcher: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Header = () => (
      <div className="w-[360px] flex items-center justify-between rounded-opt-lg bg-opt-surface-raised border border-opt-border-subtle px-opt-lg py-opt-md">
        <span className="text-opt-md font-opt-medium text-opt-text-heading">Hero section</span>
        <Segmented defaultValue="design">
          <SegmentedItem value="design">
            <Eye size={14} strokeWidth={2} aria-hidden="true" />
            Design
          </SegmentedItem>
          <SegmentedItem value="code">
            <Code size={14} strokeWidth={2} aria-hidden="true" />
            Code
          </SegmentedItem>
        </Segmented>
      </div>
    );
    return (
      <ThemePair
        sample={<Header />}
        caption="Editor header pattern — panel title left, segmented control right. The selected segment rides an Ink-bordered raised thumb; in dark mode the thumb and track invert with the surface."
      />
    );
  },
};
