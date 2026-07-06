import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import { Stepper } from "./stepper";

const meta: Meta<typeof Stepper> = {
  title: "Molecules/Stepper",
  component: Stepper,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Multi-step progress indicator. Numbered markers, connectors, and labels — orientation flips between horizontal flows and vertical timelines. Complete fills Ink, current rings at 10%, upcoming stays muted.",
      },
    },
  },
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
    current:     { control: { type: "number", min: 0, max: 4, step: 1 } },
  },
};
export default meta;

type Story = StoryObj<typeof Stepper>;

const onboardingSteps = [
  { id: "account",   label: "Account",     description: "Created" },
  { id: "workspace", label: "Workspace",   description: "Acme Studios" },
  { id: "invite",    label: "Invite team", description: "2 of 5 invited" },
  { id: "canvas",    label: "First canvas", description: "Pending" },
];

const exportSteps = [
  { id: "prepare",  label: "Prepare assets", description: "12 layers, 4 components" },
  { id: "compile",  label: "Compiling…",     description: "38% complete" },
  { id: "optimize", label: "Optimize",       description: "Up next" },
  { id: "download", label: "Download",       description: "PNG ready" },
];

const checkoutSteps = [
  { id: "plan",    label: "Plan",    description: "Pro · annual" },
  { id: "billing", label: "Billing", description: "In progress" },
  { id: "confirm", label: "Confirm", description: "Review charges" },
];

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  args: { current: 2, orientation: "horizontal", steps: onboardingSteps },
  render: (args) => (
    <div className="w-[680px]">
      <Stepper {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  args: { current: 1, orientation: "vertical", steps: exportSteps },
  render: (args) => <Stepper {...args} className="max-w-[240px]" />,
};

// ── States · complete / current / upcoming ──────────────────────
export const States: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-2xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-3xl">
      <div className="flex items-start justify-center gap-opt-2xl">
        <div className="flex flex-col items-center gap-opt-md">
          <Stepper
            current={3}
            steps={[
              { id: "1", label: "" },
              { id: "2", label: "" },
              { id: "3", label: "" },
            ]}
            className="!w-auto"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-opt-xl">
        <Cell title="Complete" spec="Ink fill · white check" />
        <Cell title="Current"  spec="White fill · Ink border + 4px ring" />
        <Cell title="Upcoming" spec="Muted fill · neutral border" />
      </div>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        Connectors inherit the source marker · Ink between completes · hairline after
      </div>
    </div>
  ),
};

function Cell({ title, spec }: { title: string; spec: string }) {
  return (
    <div className="flex flex-col items-center gap-opt-xs text-center">
      <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-blue-700">{title}</span>
      <span className="font-opt-mono text-[10px] text-opt-text-secondary">{spec}</span>
    </div>
  );
}

// ── Orientations ────────────────────────────────────────────────
export const Orientations: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[1.4fr_1fr] gap-opt-2xl p-opt-xl bg-opt-surface-low rounded-opt-xl">
      <div className="flex flex-col gap-opt-md p-opt-md bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Horizontal · onboarding</span>
        <Stepper current={2} steps={onboardingSteps} />
      </div>
      <div className="flex flex-col gap-opt-md p-opt-md bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Vertical · export</span>
        <Stepper orientation="vertical" current={1} steps={exportSteps} />
      </div>
    </div>
  ),
};

// ── Upgrade-flow example ────────────────────────────────────────
export const UpgradeFlow: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Sample = () => (
      <div className="w-[420px] p-opt-md bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md">
        <Stepper current={1} steps={checkoutSteps} />
      </div>
    );
    return (
      <ThemePair
        sample={<Sample />}
        caption="Checkout progress — completed steps fill Ink, the current step rings Ink, upcoming steps stay neutral. The connector and labels pivot with the theme."
      />
    );
  },
};
