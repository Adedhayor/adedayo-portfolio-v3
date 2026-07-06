import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarStack, AvatarPresence } from "./avatar";
import { Badge } from "./badge";
import { ThemePair } from "./_in-context";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "User identity. The only legit use of radius.full in the system. Fallback chain: image → initials → user icon. 2px white border separates stacked avatars and presence dots.",
      },
    },
  },
  argTypes: {
    size: { control: "radio", options: ["xs", "sm", "md", "lg"] },
    initials: { control: "text" },
    src: { control: "text" },
    alt: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  args: { initials: "A" },
};

export const ImageFill: Story = {
  args: {
    src: "https://i.pravatar.cc/80?img=12",
    alt: "Adedayo Olamilekan",
    initials: "AO",
  },
};

export const Placeholder: Story = {
  args: {},
};

// ── Four sizes × three fills ────────────────────────────────────
export const Sizes: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const sizes = ["xs", "sm", "md", "lg"] as const;
    const labels = ["xs · 20", "sm · 24", "md · 32", "lg · 40"];
    return (
      <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
        <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-opt-md items-center">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Fill</span>
          {labels.map((l) => (
            <span key={l} className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">{l}</span>
          ))}

          <div className="flex flex-col gap-[2px] py-opt-sm">
            <span className="text-opt-sm font-opt-medium text-opt-text-heading">Image</span>
            <span className="font-opt-mono text-[10px] text-opt-text-secondary">User photo</span>
          </div>
          {sizes.map((s) => (
            <Avatar key={s} size={s} gradientFrom="#FFA552" gradientTo="#FF4D6D" />
          ))}

          <div className="flex flex-col gap-[2px] py-opt-sm">
            <span className="text-opt-sm font-opt-medium text-opt-text-heading">Initials</span>
            <span className="font-opt-mono text-[10px] text-opt-text-secondary">First fallback</span>
          </div>
          {sizes.map((s) => (
            <Avatar key={s} size={s} initials="A" />
          ))}

          <div className="flex flex-col gap-[2px] py-opt-sm">
            <span className="text-opt-sm font-opt-medium text-opt-text-heading">Placeholder</span>
            <span className="font-opt-mono text-[10px] text-opt-text-secondary">Unknown user · pending</span>
          </div>
          {sizes.map((s) => (
            <Avatar key={s} size={s} />
          ))}
        </div>
        <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
          Fallback chain · image → initials → user icon · initials use white on ink
        </div>
      </div>
    );
  },
};

// ── Patterns · stack / presence / with-name ─────────────────────
export const Patterns: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-3 gap-opt-2xl p-opt-xl bg-opt-surface-low rounded-opt-xl">
      <div className="flex flex-col gap-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
          Stack · 2px white border · -8 overlap
        </span>
        <AvatarStack max={3} total={7}>
          <Avatar initials="A" />
          <Avatar gradientFrom="#3B82F6" gradientTo="#06B6D4" initials="S" />
          <Avatar gradientFrom="#F59E0B" gradientTo="#EF4444" initials="J" />
        </AvatarStack>
        <span className="text-[11px] leading-[16px] text-opt-text-secondary">
          Show 3 avatars max, then "+N" overflow. 2px white border separates overlapping circles.
        </span>
      </div>

      <div className="flex flex-col gap-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
          Presence dot · bottom-right
        </span>
        <div className="flex items-center gap-opt-md">
          <AvatarPresence status="online">
            <Avatar gradientFrom="#FFA552" gradientTo="#FF4D6D" />
          </AvatarPresence>
          <AvatarPresence status="away">
            <Avatar initials="S" />
          </AvatarPresence>
          <AvatarPresence status="offline">
            <Avatar />
          </AvatarPresence>
        </div>
        <span className="text-[11px] leading-[16px] text-opt-text-secondary">
          10px dot, 2px white border. Green / amber / gray for online / away / offline.
        </span>
      </div>

      <div className="flex flex-col gap-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
          With name · list row
        </span>
        <div className="flex flex-col gap-opt-sm">
          <div className="flex items-center gap-opt-sm">
            <Avatar initials="A" />
            <span className="text-opt-md text-opt-text-primary">Adedayo Olamilekan</span>
          </div>
          <div className="flex items-center gap-opt-sm">
            <Avatar initials="S" />
            <div className="flex flex-col">
              <span className="text-opt-md text-opt-text-primary">Sarah Hughes</span>
              <span className="text-[11px] text-opt-text-secondary">Editor · 12m ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// ── In context · Team members (light + dark) ────────────────────
type Member = {
  name: string;
  meta: string;
  status: "online" | "away" | "offline";
  avatar: { initials?: string; gradientFrom?: string; gradientTo?: string };
  role: { label: string; badge: React.ReactNode };
};

export const InContext: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const members: Member[] = [
      {
        name: "Adedayo Olamilekan",
        meta: "dayo@replikit.ai",
        status: "online",
        avatar: { gradientFrom: "#FFA552", gradientTo: "#FF4D6D" },
        role: { label: "Owner", badge: <Badge intensity="solid" role="ink">Owner</Badge> },
      },
      {
        name: "Sarah Hughes",
        meta: "sarah@replikit.ai",
        status: "away",
        avatar: { initials: "S" },
        role: { label: "Editor", badge: <Badge role="neutral">Editor</Badge> },
      },
      {
        name: "Jamie Rivera",
        meta: "Invited 2 days ago",
        status: "offline",
        avatar: { initials: "J", gradientFrom: "#3B82F6", gradientTo: "#06B6D4" },
        role: { label: "Pending", badge: <Badge intensity="outlined" role="neutral">Pending</Badge> },
      },
    ];
    const List = () => (
      <div className="w-[420px] rounded-opt-lg bg-opt-surface-raised border border-opt-border-subtle p-opt-sm">
        {members.map((m, i) => (
          <div
            key={m.name}
            className={`flex items-center gap-opt-sm px-opt-sm py-opt-sm ${
              i > 0 ? "border-t border-opt-border-subtle" : ""
            }`}
          >
            <AvatarPresence status={m.status}>
              <Avatar
                initials={m.avatar.initials}
                gradientFrom={m.avatar.gradientFrom}
                gradientTo={m.avatar.gradientTo}
              />
            </AvatarPresence>
            <div className="flex flex-col">
              <span className="text-opt-md font-opt-medium text-opt-text-heading">
                {m.name}
              </span>
              <span className="text-[11px] text-opt-text-secondary">{m.meta}</span>
            </div>
            <span className="ml-auto">{m.role.badge}</span>
          </div>
        ))}
      </div>
    );
    return (
      <ThemePair
        sample={<List />}
        caption="Avatar 32 + presence dot + role badge — the canonical team-list row. In dark mode the presence-dot border swaps from white to the surface bg (neutral-900) so the dot reads cleanly against any avatar."
      />
    );
  },
};
