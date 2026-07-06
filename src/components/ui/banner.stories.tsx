import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import { Banner } from "./banner";
import { Button } from "./button";

const meta: Meta<typeof Banner> = {
  title: "Molecules/Banner",
  component: Banner,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Persistent page-level message. Sits at the top of a section or pane — stays until the user acts on it or dismisses it. Different from Toast (which auto-dismisses).",
      },
    },
  },
  argTypes: {
    intent:      { control: "radio",   options: ["info", "success", "warning", "danger", "neutral"] },
    density:     { control: "radio",   options: ["compact", "default", "spacious"] },
    title:       { control: "text" },
    body:        { control: "text" },
    eyebrow:     { control: "text" },
    dismissible: { control: "boolean" },
    icon:        { table: { disable: true }, control: false },
    action:      { table: { disable: true }, control: false },
    onDismiss:   { table: { disable: true }, control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Banner>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  args: {
    intent: "info",
    title: "New version 2.4 is available",
    body: "Reload the canvas to get smart guides, presence dots, and the new export panel.",
    action: <Button size="compact" variant="secondary">Reload</Button>,
    dismissible: true,
  },
  render: (args) => (
    <div className="w-[720px]">
      <Banner {...args} />
    </div>
  ),
};

// ── Five intents ────────────────────────────────────────────────
export const Intents: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-md p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <Banner
        intent="info"
        title="New version 2.4 is available"
        body="Reload the canvas to get smart guides, presence dots, and the new export panel."
        action={<Button size="compact" variant="secondary">Reload</Button>}
        dismissible
      />
      <Banner
        intent="success"
        title="Your workspace is now Pro"
        body="Unlimited canvases and team access have been unlocked. You can invite up to 25 collaborators."
        dismissible
      />
      <Banner
        intent="warning"
        title="You're approaching your storage limit"
        body="You've used 8.4 GB of 10 GB. Old exports will be auto-archived in 7 days."
        action={<Button size="compact" variant="secondary">Manage storage</Button>}
        dismissible
      />
      <Banner
        intent="danger"
        title="Your billing is past due"
        body="Update your payment method by May 24 to keep your team's access. After that, canvases switch to read-only."
        action={<Button size="compact" variant="danger">Update payment</Button>}
        dismissible
      />
      <Banner
        intent="neutral"
        title="You're viewing a shared copy"
        body="Changes won't affect the original. Duplicate this canvas to make it your own."
        action={<Button size="compact" variant="secondary">Duplicate</Button>}
      />
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        5 intents · 100 tint + 25%-opacity hairline · 700 text · 16px icon · dismiss optional
      </div>
    </div>
  ),
};

// ── Three densities ─────────────────────────────────────────────
export const Densities: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <Section label="Compact · 32" spec="single-line · title only">
        <Banner
          density="compact"
          intent="info"
          title="Branch design-system is 4 commits behind main."
          action={
            <button className="text-[12px] font-opt-medium underline underline-offset-2">
              Sync
            </button>
          }
        />
      </Section>

      <Section label="Default · 56" spec="title + body · everyday default">
        <Banner
          intent="warning"
          title="You're approaching your storage limit"
          body="You've used 8.4 GB of 10 GB. Old exports will be auto-archived in 7 days."
          action={<Button size="compact" variant="secondary">Manage storage</Button>}
        />
      </Section>

      <Section label="Spacious · 96" spec="eyebrow + title + body + actions · marketing / first-run">
        <Banner
          density="spacious"
          intent="success"
          eyebrow="Welcome to Pro"
          title="Your team workspace is ready"
          body="Unlimited canvases, presence, and team-level templates are now active. Invite up to 25 collaborators to start designing together."
          action={
            <>
              <Button size="compact" variant="primary">Invite team</Button>
              <Button size="compact" variant="secondary">View setup guide</Button>
            </>
          }
          dismissible
        />
      </Section>

      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        3 densities · compact 32 · default 56 · spacious 96 · pick by signal weight
      </div>
    </div>
  ),
};

// ── In context · sticky top of page ─────────────────────────────
export const StickyTop: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Sample = () => (
      <div className="w-[420px] flex flex-col bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md overflow-hidden">
        <Banner
          intent="danger"
          title="Your billing is past due"
          body="Update your payment method by May 24 to keep team access."
          action={<Button size="compact" variant="danger">Update</Button>}
          dismissible
          className="rounded-none border-x-0 border-t-0"
        />
        <div className="flex items-center gap-opt-sm px-opt-md py-opt-md border-b border-opt-border-subtle">
          <span className="text-opt-md font-opt-medium text-opt-text-heading">Spring campaign · workspace</span>
        </div>
        <div className="flex flex-col gap-opt-xs p-opt-lg min-h-[140px]">
          <span className="h-[14px] w-[60%] bg-opt-border-default rounded-[2px]"></span>
          <span className="h-[14px] w-[80%] bg-opt-border-default rounded-[2px]"></span>
          <span className="h-[14px] w-[45%] bg-opt-border-default rounded-[2px]"></span>
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<Sample />}
        caption="Page-level banner pinned above the workspace header with a bottom hairline — side & top borders stripped so it reads as page chrome. The danger intent and its Update action invert cleanly in dark."
      />
    );
  },
};

function Section({
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
      <div className="flex items-baseline gap-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">{label}</span>
        <span className="font-opt-mono text-[10px] text-opt-text-secondary">{spec}</span>
      </div>
      {children}
    </div>
  );
}
