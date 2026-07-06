import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "lucide-react";
import { Badge, Presence } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Status, count, and presence label. Three intensities (soft / solid / outlined) × five semantic roles. Soft is the default; solid earns its footprint by being rare.",
      },
    },
  },
  argTypes: {
    intensity: { control: "radio", options: ["soft", "solid", "outlined"] },
    role:      { control: "select", options: ["neutral", "info", "success", "warning", "danger", "gray", "red", "coral", "amber", "yellow", "green", "cyan", "blue", "ink"] },
    size:      { control: "radio", options: ["xs", "sm", "md", "lg"] },
    dot:       { control: "boolean" },
    numeric:   { control: "boolean" },
    leadingIcon: { table: { disable: true }, control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default:  Story = { args: { children: "Neutral" } };
export const Solid:    Story = { args: { intensity: "solid", role: "info", children: "Info" } };
export const Outlined: Story = { args: { intensity: "outlined", children: "Draft" } };

// ── Five roles · two intensities ────────────────────────────────
export const Roles: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <Row label="Soft" spec="subtle surface · default">
        <Badge role="neutral">Neutral</Badge>
        <Badge role="info">Info</Badge>
        <Badge role="success">Success</Badge>
        <Badge role="warning">Warning</Badge>
        <Badge role="danger">Danger</Badge>
        <Badge role="ink">New</Badge>
      </Row>
      <Row label="Solid" spec="stronger emphasis">
        <Badge intensity="solid" role="info">Info</Badge>
        <Badge intensity="solid" role="success">Live</Badge>
        <Badge intensity="solid" role="cyan">Beta</Badge>
        <Badge intensity="solid" role="danger">Critical</Badge>
      </Row>
      <Row label="Outlined" spec="quietest">
        <Badge intensity="outlined">Draft</Badge>
        <Badge intensity="outlined" role="ink">Active</Badge>
      </Row>
    </div>
  ),
};

// ── Three shapes · label, count, dot ────────────────────────────
export const Shapes: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <Row label="With leading dot" spec="status">
        <Badge dot role="green">Live</Badge>
        <Badge dot role="blue">Building</Badge>
        <Badge dot role="gray">Idle</Badge>
        <Badge dot role="red">Failed</Badge>
      </Row>
      <Row label="Count" spec="numeric · mono digits">
        <Badge intensity="solid" role="ink" numeric>3</Badge>
        <Badge intensity="solid" role="ink" numeric>12</Badge>
        <Badge intensity="solid" role="ink" numeric>99+</Badge>
        <Badge intensity="solid" role="danger" numeric>2</Badge>
        <span className="text-opt-md text-opt-text-primary ml-opt-md">Inbox</span>
        <Badge intensity="solid" role="danger" numeric>7</Badge>
      </Row>
      <Row label="Dot" spec="presence only · 8px">
        <div className="flex items-center gap-opt-xs">
          <Presence status="online" />
          <span className="text-opt-md text-opt-text-primary">Online</span>
        </div>
        <div className="flex items-center gap-opt-xs">
          <Presence status="away" />
          <span className="text-opt-md text-opt-text-primary">Away</span>
        </div>
        <div className="flex items-center gap-opt-xs">
          <Presence status="offline" />
          <span className="text-opt-md text-opt-text-primary">Offline</span>
        </div>
      </Row>
    </div>
  ),
};

// ── Four heights ────────────────────────────────────────────────
export const Sizes: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const sizes = [
      { size: "xs" as const, label: "xs · 16", spec: "8/600 · table cells" },
      { size: "sm" as const, label: "sm · 20", spec: "11/600 · default" },
      { size: "md" as const, label: "md · 24", spec: "12/600 · cards & lists" },
      { size: "lg" as const, label: "lg · 28", spec: "13/600 · hero / marketing" },
    ];
    return (
      <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
        <div className="grid grid-cols-[200px_repeat(5,1fr)] gap-opt-md items-center">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Size</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Soft</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Solid</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">With dot</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">With icon</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Icon only</span>
          {sizes.map((s) => (
            <div key={s.size} className="contents">
              <div className="flex flex-col gap-[2px] py-opt-sm">
                <span className="text-opt-sm font-opt-medium text-opt-text-heading">{s.label}</span>
                <span className="font-opt-mono text-[10px] text-opt-text-secondary">{s.spec}</span>
              </div>
              <div><Badge size={s.size} role="info">Live</Badge></div>
              <div><Badge size={s.size} intensity="solid" role="info">Live</Badge></div>
              <div><Badge size={s.size} role="green" dot>Live</Badge></div>
              <div><Badge size={s.size} role="success" leadingIcon={<Check size={s.size === "xs" ? 10 : 12} strokeWidth={2.5} />}>Done</Badge></div>
              <div><Badge size={s.size} intensity="solid" role="ink" numeric>{s.size === "xs" ? "1" : s.size === "sm" ? "12" : s.size === "md" ? "128" : "99+"}</Badge></div>
            </div>
          ))}
        </div>
        <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
          4 sizes · sm is default · radius stays 4px · padding scales with height
        </div>
      </div>
    );
  },
};

// ── Extended palette ────────────────────────────────────────────
export const Palette: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const roles = ["gray", "red", "coral", "amber", "yellow", "green", "cyan", "blue", "ink"] as const;
    return (
      <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
        <div className="flex flex-col gap-opt-md">
          <div className="flex items-baseline gap-opt-md">
            <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Soft</span>
            <span className="font-opt-mono text-[10px] text-opt-text-secondary">surface bg + deep text · default for tags</span>
          </div>
          <div className="flex flex-wrap gap-opt-xs">
            {roles.map((r) => (
              <Badge key={r} role={r}>{r[0].toUpperCase() + r.slice(1)}</Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-opt-md">
          <div className="flex items-baseline gap-opt-md">
            <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Solid</span>
            <span className="font-opt-mono text-[10px] text-opt-text-secondary">accent fill + white text · stronger emphasis</span>
          </div>
          <div className="flex flex-wrap gap-opt-xs">
            {roles.map((r) => (
              <Badge key={r} intensity="solid" role={r}>{r[0].toUpperCase() + r.slice(1)}</Badge>
            ))}
          </div>
        </div>
        <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
          9 hues · soft + solid intensities · yellow + cyan solids drop to ink text
        </div>
      </div>
    );
  },
};

// ── Local helper for Roles/Shapes layout ────────────────────────
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
      <div className="flex items-baseline gap-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">{label}</span>
        <span className="font-opt-mono text-[10px] text-opt-text-secondary">{spec}</span>
      </div>
      <div className="flex flex-wrap items-center gap-opt-xs">
        {children}
      </div>
    </div>
  );
}

// ── In context · Project dashboard (light + dark) ───────────────
export const InContext: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const tags: { label: string; role: "blue" | "cyan" | "yellow" | "gray" }[] = [
      { label: "Marketing", role: "blue" },
      { label: "Design system", role: "cyan" },
      { label: "Beta", role: "yellow" },
      { label: "Q4", role: "gray" },
    ];
    const rows: {
      update: string;
      status: string;
      statusRole: "success" | "warning" | "danger";
      notes: number;
      attention?: boolean;
    }[] = [
      { update: "Hero refresh v2", status: "Done", statusRole: "success", notes: 12 },
      { update: "A/B test · CTA copy", status: "Running", statusRole: "warning", notes: 3 },
      { update: "Mobile breakpoint", status: "Blocked", statusRole: "danger", notes: 1, attention: true },
    ];
    const Card = () => (
      <div className="w-[560px] rounded-opt-lg bg-opt-surface-raised border border-opt-border-subtle p-opt-lg">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-opt-xs">
            <span className="text-opt-lg font-opt-semibold text-opt-text-heading">
              Hero section
            </span>
            <span className="text-opt-sm text-opt-text-secondary">
              Updated 2h ago · by Sarah Hughes
            </span>
          </div>
          <div className="flex items-center gap-opt-xs">
            <Badge size="lg" role="success" dot>
              Live
            </Badge>
            <Badge size="lg" intensity="solid" role="danger">
              Critical
            </Badge>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-opt-sm mt-opt-md">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.12em] text-opt-text-placeholder">
            Tags
          </span>
          <div className="flex flex-wrap items-center gap-opt-xs">
            {tags.map((t) => (
              <Badge key={t.label} size="md" role={t.role}>
                {t.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-opt-md pt-opt-md border-t border-opt-border-subtle">
          <div className="flex items-center pb-opt-sm font-opt-mono text-[10px] font-opt-semibold uppercase tracking-[0.12em] text-opt-text-placeholder">
            <span className="flex-1">Update</span>
            <span className="w-[100px] shrink-0">Status</span>
            <span className="w-[60px] shrink-0 text-right">Notes</span>
          </div>
          {rows.map((r) => (
            <div
              key={r.update}
              className="flex items-center py-opt-sm border-t border-opt-border-subtle"
            >
              <span className="flex-1 text-opt-md text-opt-text-primary">
                {r.update}
              </span>
              <span className="w-[100px] shrink-0">
                <Badge size="xs" role={r.statusRole} dot>
                  {r.status}
                </Badge>
              </span>
              <span className="w-[60px] shrink-0 flex justify-end">
                <Badge
                  size="sm"
                  numeric
                  intensity="solid"
                  role={r.attention ? "red" : "ink"}
                >
                  {r.notes}
                </Badge>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<Card />}
        caption="One surface, four badge variants. lg soft Live + lg solid Critical anchor the header; md soft palette tags (blue / cyan / yellow / gray) categorize; xs status dots read inside the dense table; sm numeric chips sit right-aligned — ink by default, red when the count signals attention."
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
