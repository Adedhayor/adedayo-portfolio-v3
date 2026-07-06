import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import { Skeleton, SkeletonText, SkeletonBlock, SkeletonAvatar } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Placeholder shapes that match the final content's silhouette. Reduces perceived load time. Fill is neutral-100 at 60% opacity with a 1600ms shimmer.",
      },
    },
  },
  argTypes: {
    shape: { control: "radio", options: ["text", "block", "avatar"] },
  },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  render: (args) => (
    <span style={{ width: 240, height: 16, display: "inline-block" }}>
      <Skeleton {...args} className="w-full h-full" />
    </span>
  ),
};

// ── Three primitives ────────────────────────────────────────────
export const Primitives: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-2xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <Section label="Text line" spec="scales with font size">
        <div className="flex flex-col gap-opt-sm">
          <SkeletonText size="lg" width={0.45} />
          <SkeletonText size="md" width={0.7} />
          <SkeletonText size="md" width={0.55} />
        </div>
      </Section>

      <Section label="Block" spec="arbitrary shape">
        <div className="flex items-end gap-opt-md">
          <SkeletonBlock width={64} height={48} />
          <SkeletonBlock width={96} height={48} />
          <SkeletonBlock width={160} height={80} />
        </div>
      </Section>

      <Section label="Avatar" spec="circular">
        <div className="flex items-center gap-opt-md">
          <SkeletonAvatar size={20} />
          <SkeletonAvatar size={24} />
          <SkeletonAvatar size={32} />
          <SkeletonAvatar size={40} />
        </div>
      </Section>

      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        3 shapes · text · block · avatar · radius matches the content being replaced
      </div>
    </div>
  ),
};

// ── Common compositions ─────────────────────────────────────────
export const Compositions: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Sample = () => (
      <div className="w-[300px] flex flex-col gap-opt-md">
        <div className="flex flex-col gap-opt-md p-opt-md bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md">
          {[0.65, 0.5, 0.7].map((w, i) => (
            <div key={i} className="flex items-center gap-opt-sm">
              <SkeletonAvatar size={24} />
              <SkeletonText size="md" width={w} className="flex-1" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-opt-sm p-opt-md bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md">
          <SkeletonBlock height={120} className="w-full" />
          <SkeletonText size="md" width={0.85} />
          <SkeletonText size="md" width={0.6} />
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<Sample />}
        caption="Loading state for a list and a card. The shimmer base and highlight both step with the theme (neutral-100/200 → neutral-800/750) so the pulse stays visible on dark surfaces."
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
    <div className="flex flex-col gap-opt-md">
      <div className="flex items-baseline gap-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">{label}</span>
        <span className="font-opt-mono text-[10px] text-opt-text-secondary">{spec}</span>
      </div>
      {children}
    </div>
  );
}
