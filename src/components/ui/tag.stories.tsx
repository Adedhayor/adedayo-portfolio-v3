import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import { useState } from "react";
import { Tag } from "./tag";

const meta: Meta<typeof Tag> = {
  title: "Atoms/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Interactive chip with optional × dismiss. Different from Badge — tags can be removed; badges are read-only. Subtle is the everyday default.",
      },
    },
  },
  argTypes: {
    variant:     { control: "select", options: ["subtle", "outline", "filled", "accent", "success", "warning", "danger"] },
    size:        { control: "radio",  options: ["sm", "md"] },
    dismissible: { control: "boolean" },
    interactive: { control: "boolean" },
    leadingIcon: { table: { disable: true }, control: false },
    onDismiss:   { table: { disable: true }, control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Tag>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default:     Story = { args: { children: "marketing" } };
export const Dismissible: Story = { args: { children: "marketing", dismissible: true } };
export const Filled:      Story = { args: { children: "pinned", variant: "filled" } };

// ── Seven variants ──────────────────────────────────────────────
export const Variants: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-3xl">
      <div className="flex flex-col gap-opt-md">
        <div className="flex items-baseline gap-opt-md">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Neutral · 3 intensities</span>
        </div>
        <div className="flex flex-wrap items-center gap-opt-xs">
          <Tag variant="subtle">Subtle</Tag>
          <Tag variant="outline">Outline</Tag>
          <Tag variant="filled">Filled</Tag>
        </div>
      </div>

      <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
        <div className="flex items-baseline gap-opt-md">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Semantic · 4 roles</span>
        </div>
        <div className="flex flex-wrap items-center gap-opt-xs">
          <Tag variant="accent">Accent</Tag>
          <Tag variant="success">Success</Tag>
          <Tag variant="warning">Warning</Tag>
          <Tag variant="danger">Danger</Tag>
        </div>
      </div>

      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        7 variants · subtle is default · filled draws attention · semantic states use 10% tint + 100% text
      </div>
    </div>
  ),
};

// ── Sizes & dismiss ─────────────────────────────────────────────
export const Sizes: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    return (
      <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-3xl">
        <div className="flex flex-col gap-opt-md">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">sm · 20</span>
          <div className="flex flex-wrap items-center gap-opt-xs">
            <Tag size="sm">marketing</Tag>
            <Tag size="sm" dismissible>marketing</Tag>
          </div>
        </div>

        <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">md · 24 · default</span>
          <div className="flex flex-wrap items-center gap-opt-xs">
            <Tag>marketing</Tag>
            <Tag dismissible>marketing</Tag>
            <Tag variant="success" dismissible>verified</Tag>
            <Tag variant="filled" dismissible>pinned</Tag>
          </div>
        </div>

        <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
          2 sizes · × at 60% opacity, lifts to 100% on hover · 4px tap target
        </div>
      </div>
    );
  },
};

// ── Filter chips · interactive ──────────────────────────────────
export const FilterChips: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    function FiltersDemo() {
      const [filters, setFilters] = useState([
        { id: "type",    label: "type: template" },
        { id: "role",    label: "role: marketer" },
        { id: "updated", label: "updated: this week" },
      ]);
      return (
        <div className="w-[360px] flex flex-col gap-opt-md p-opt-lg bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md">
          <div className="flex items-baseline justify-between">
            <span className="text-opt-md font-opt-medium text-opt-text-heading">Active filters</span>
            <button
              className="text-[11px] text-opt-red-700 dark:text-opt-red-100 hover:underline underline-offset-2"
              onClick={() => setFilters([])}
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-opt-xs">
            {filters.map((f) => (
              <Tag
                key={f.id}
                dismissible
                onClick={() => alert(`Edit ${f.id}`)}
                onDismiss={() => setFilters((all) => all.filter((x) => x.id !== f.id))}
              >
                {f.label}
              </Tag>
            ))}
            {filters.length === 0 && (
              <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">No active filters</span>
            )}
          </div>
          <span className="text-[11px] text-opt-text-secondary">Showing 24 of 187 projects</span>
        </div>
      );
    }
    return (
      <ThemePair
        sample={<FiltersDemo />}
        caption="Active filters as dismissible chips — × removes the filter, clicking the rest of the chip edits / selects by it. The chip fill and × hover both pivot with the theme."
      />
    );
  },
};
