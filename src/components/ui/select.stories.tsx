import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Archive,
  Circle,
  FileText,
  Inbox,
  Minus,
  Square,
  Triangle,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";
import { ThemePair } from "./_in-context";

const meta: Meta<typeof SelectTrigger> = {
  title: "Atoms/Select",
  component: SelectTrigger,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Trigger inherits the Input shell — same border weights, focus ring, and disabled treatment. Menu renders in a 4px-radius surface with a soft 4/8 + 1/3 shadow.",
      },
    },
  },
  argTypes: {
    size:     { control: "radio", options: ["standard", "compact"] },
    state:    { control: "radio", options: ["default", "error"] },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof SelectTrigger>;

const SHELL = "w-[240px]";

// ── Playground stories ───────────────────────────────────────────
export const Default: Story = {
  render: (args) => (
    <Select>
      <SelectTrigger {...args} className={SHELL}>
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="designer">Designer</SelectItem>
        <SelectItem value="marketer">Marketer</SelectItem>
        <SelectItem value="developer">Developer</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Compact: Story = {
  args: { size: "compact" },
  render: Default.render,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
};

export const WithValue: Story = {
  render: (args) => (
    <Select defaultValue="designer">
      <SelectTrigger {...args} className={SHELL}>
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="designer">Designer</SelectItem>
        <SelectItem value="marketer">Marketer</SelectItem>
        <SelectItem value="developer">Developer</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ── Six trigger states ──────────────────────────────────────────
export const States: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <div className="grid grid-cols-3 gap-opt-lg">
        {[
          { label: "Default · empty", spec: "placeholder shown",     trigger: (
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
            </Select>
          )},
          { label: "With value",      spec: "selection visible",     trigger: (
            <Select defaultValue="designer">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
            </Select>
          )},
          { label: "Hover",           spec: "border neutral-300",    trigger: (
            <Select defaultValue="designer">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
            </Select>
          )},
          { label: "Focused",         spec: "border ink · 2px ring", trigger: (
            <Select defaultValue="designer">
              <SelectTrigger className="w-full" autoFocus>
                <SelectValue />
              </SelectTrigger>
            </Select>
          )},
          { label: "Open",            spec: "chevron flips",         trigger: (
            <Select defaultValue="designer">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
            </Select>
          )},
          { label: "Disabled",        spec: "bg neutral-50",         trigger: (
            <Select>
              <SelectTrigger className="w-full" disabled>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
            </Select>
          )},
        ].map((s) => (
          <div key={s.label} className="flex flex-col gap-opt-sm">
            {s.trigger}
            <div className="flex flex-col gap-[2px]">
              <span className="font-opt-mono text-[10px] font-opt-medium text-opt-text-heading">
                {s.label}
              </span>
              <span className="font-opt-mono text-[9px] text-opt-text-secondary">{s.spec}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        Trigger inherits Input shell · 12px chevron rotates 180° when open · no red anywhere
      </div>
    </div>
  ),
};

// ── Menu densities — simple / with icons / with description ─────
export const MenuDensities: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl">
      <div className="flex flex-col gap-opt-sm">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
          Simple list
        </span>
        <Select defaultValue="designer">
          <SelectTrigger className="w-[240px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="marketer">Marketer</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="admin" disabled>Admin · invite only</SelectItem>
          </SelectContent>
        </Select>
        <span className="font-opt-mono text-[10px] text-opt-text-secondary mt-opt-2xl">
          28px items · 4px padding · ✓ on selected
        </span>
      </div>

      <div className="flex flex-col gap-opt-sm">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
          With icons
        </span>
        <Select defaultValue="rectangle">
          <SelectTrigger className="w-[240px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rectangle" leadingIcon={<Square size={14} strokeWidth={2} />}>Rectangle</SelectItem>
            <SelectItem value="ellipse"   leadingIcon={<Circle size={14} strokeWidth={2} />}>Ellipse</SelectItem>
            <SelectItem value="polygon"   leadingIcon={<Triangle size={14} strokeWidth={2} />}>Polygon</SelectItem>
            <SelectItem value="line"      leadingIcon={<Minus size={14} strokeWidth={2} />}>Line</SelectItem>
          </SelectContent>
        </Select>
        <span className="font-opt-mono text-[10px] text-opt-text-secondary mt-opt-2xl">
          14px leading icon · 8px gap
        </span>
      </div>

      <div className="flex flex-col gap-opt-sm">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
          With description
        </span>
        <Select defaultValue="designer">
          <SelectTrigger className="w-[280px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="designer" description="Layers, properties, design tools">Designer</SelectItem>
            <SelectItem value="marketer" description="Templates, content blocks, publish">Marketer</SelectItem>
            <SelectItem value="developer" description="Code panel, tokens, API access">Developer</SelectItem>
          </SelectContent>
        </Select>
        <span className="font-opt-mono text-[10px] text-opt-text-secondary mt-opt-2xl">
          label 13/500 + caption 11/400 · auto-height item
        </span>
      </div>
    </div>
  ),
};

// ── Grouped menu — sections + dividers ──────────────────────────
export const Sections: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-md p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-md">
      <Select defaultValue="design-system">
        <SelectTrigger className="w-[320px]">
          <SelectValue placeholder="Move to…" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Personal</SelectLabel>
            <SelectItem value="drafts" leadingIcon={<FileText size={14} strokeWidth={2} />}>Drafts</SelectItem>
            <SelectItem value="inbox"  leadingIcon={<Inbox size={14} strokeWidth={2} />}>Inbox</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Team</SelectLabel>
            <SelectItem value="marketing"     leadingIcon={<Users size={14} strokeWidth={2} />}>Marketing</SelectItem>
            <SelectItem value="design-system" leadingIcon={<Users size={14} strokeWidth={2} />}>Design system</SelectItem>
            <SelectItem value="product"       leadingIcon={<Users size={14} strokeWidth={2} />}>Product</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectItem value="archive" leadingIcon={<Archive size={14} strokeWidth={2} />}>Archive</SelectItem>
        </SelectContent>
      </Select>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        Section labels: JetBrains Mono 10/600/0.12em · dividers 1px with 8px inset · standalone items below the last group
      </div>
    </div>
  ),
};

// ── In context · Filter + settings row (light + dark) ───────────
export const InContext: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Bar = () => (
      <div className="w-[480px] rounded-opt-lg bg-opt-surface-raised border border-opt-border-subtle p-opt-lg">
        <div className="flex items-baseline justify-between">
          <span className="text-opt-lg font-opt-semibold text-opt-text-heading">
            All projects
          </span>
          <span className="text-opt-sm text-opt-text-secondary">24 results</span>
        </div>
        <div className="flex items-center gap-opt-lg mt-opt-md">
          <div className="flex items-center gap-opt-sm">
            <span className="font-opt-mono text-[10px] uppercase tracking-[0.12em] text-opt-text-placeholder">
              Sort
            </span>
            <Select defaultValue="recent">
              <SelectTrigger size="compact" className="w-[168px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently updated</SelectItem>
                <SelectItem value="created">Date created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-opt-sm">
            <span className="font-opt-mono text-[10px] uppercase tracking-[0.12em] text-opt-text-placeholder">
              Owner
            </span>
            <Select>
              <SelectTrigger size="compact" className="w-[120px]">
                <SelectValue placeholder="Anyone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="me">Me</SelectItem>
                <SelectItem value="team">My team</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<Bar />}
        caption="Two selects in a filter bar — the first carries a selected value, the second sits empty with its placeholder. Same trigger shell, same chevron, just different fill text (primary vs placeholder)."
      />
    );
  },
};
