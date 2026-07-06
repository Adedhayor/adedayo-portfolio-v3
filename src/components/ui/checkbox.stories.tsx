import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Boolean with indeterminate. Ink fill when checked. Three values (unchecked/checked/indeterminate) × four states (default/hover/focused/disabled).",
      },
    },
  },
  argTypes: {
    size:     { control: "radio", options: ["sm", "md", "lg"] },
    state:    { control: "radio", options: ["default", "error"] },
    disabled: { control: "boolean" },
    checked:  { control: "radio", options: [false, true, "indeterminate"] },
  },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default:       Story = { args: { checked: false } };
export const Checked:       Story = { args: { checked: true } };
export const Indeterminate: Story = { args: { checked: "indeterminate" } };
export const Disabled:      Story = { args: { disabled: true } };

// ── States grid · 3 values × 4 states ───────────────────────────
export const States: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const values = [
      { label: "Unchecked",     spec: "empty box · neutral border",  checked: false as const },
      { label: "Checked",       spec: "ink fill · white tick",        checked: true as const },
      { label: "Indeterminate", spec: "partial · group state",        checked: "indeterminate" as const },
    ];
    const cols = ["Default", "Hover", "Focused", "Disabled"];
    return (
      <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
        <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-opt-md items-center">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
            Value
          </span>
          {cols.map((c) => (
            <span key={c} className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
              {c}
            </span>
          ))}
          {values.map((v) => (
            <div key={v.label} className="contents">
              <div className="flex flex-col gap-[2px] py-opt-sm">
                <span className="text-opt-sm font-opt-medium text-opt-text-heading">
                  {v.label}
                </span>
                <span className="font-opt-mono text-[10px] text-opt-text-secondary">{v.spec}</span>
              </div>
              <Checkbox checked={v.checked} />
              <Checkbox checked={v.checked} />
              <Checkbox checked={v.checked} autoFocus={v === values[0]} />
              <Checkbox checked={v.checked} disabled />
            </div>
          ))}
        </div>
        <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
          3 values · 4 states · tick 11px stroke-width 3.5 · indeterminate dash 8×2
        </div>
      </div>
    );
  },
};

// ── Sizes ───────────────────────────────────────────────────────
export const Sizes: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const values = [
      { label: "Unchecked", checked: false as const },
      { label: "Checked", checked: true as const },
      { label: "Indeterminate", checked: "indeterminate" as const },
    ];
    return (
      <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
        <div className="grid grid-cols-[200px_repeat(3,1fr)] gap-opt-md items-center">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Value</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">sm · 14</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">md · 16 · default</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">lg · 18</span>
          {values.map((v) => (
            <div key={v.label} className="contents">
              <span className="text-opt-sm font-opt-medium text-opt-text-heading py-opt-sm">{v.label}</span>
              <Checkbox size="sm" checked={v.checked} />
              <Checkbox size="md" checked={v.checked} />
              <Checkbox size="lg" checked={v.checked} />
            </div>
          ))}
        </div>
        <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
          3 sizes · sm fits inside dense tables · md is everyday default · lg pairs with 16px body
        </div>
      </div>
    );
  },
};

// ── Validation · required + error ───────────────────────────────
export const Validation: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-lg p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-md">
      <div className="flex items-start gap-opt-sm">
        <Checkbox state="error" />
        <div className="flex flex-col gap-opt-xs pt-[2px]">
          <div className="flex items-baseline gap-opt-xs">
            <span className="text-opt-md text-opt-text-primary">I agree to the Terms of Service</span>
            <span className="text-[11px] text-opt-red-700 dark:text-opt-red-100">Required</span>
          </div>
          <div className="flex items-center gap-[4px] text-[11px] text-opt-red-700 dark:text-opt-red-100">
            <AlertCircle size={11} strokeWidth={2.5} aria-hidden="true" />
            <span>You must accept the terms to continue</span>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-opt-sm">
        <Checkbox defaultChecked />
        <div className="flex flex-col gap-opt-xs pt-[2px]">
          <span className="text-opt-md text-opt-text-primary">I agree to the Terms of Service</span>
          <span className="text-[11px] text-opt-text-secondary">Resolved · helper disappears once checked</span>
        </div>
      </div>
    </div>
  ),
};

// ── In context · Filter sidebar (light + dark) ──────────────────
export const InContext: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const rows = [
      { label: "Templates", count: 42, checked: true },
      { label: "Components", count: 128, checked: true },
      { label: "Pages", count: 17, checked: false },
      { label: "Assets", count: 9, checked: false },
    ];
    const Panel = () => (
      <div className="w-[340px] rounded-opt-lg bg-opt-surface-raised border border-opt-border-subtle p-opt-lg">
        <div className="flex items-center justify-between">
          <span className="text-opt-lg font-opt-semibold text-opt-text-heading">Filters</span>
          <button
            type="button"
            className="text-opt-md text-opt-text-link underline underline-offset-2"
          >
            Clear all
          </button>
        </div>
        <span className="block mt-opt-md mb-opt-xs font-opt-mono text-[10px] uppercase tracking-[0.14em] text-opt-text-placeholder">
          Type
        </span>
        <div className="flex flex-col">
          {rows.map((r) => (
            <label
              key={r.label}
              className="flex items-center gap-opt-sm py-opt-sm cursor-pointer"
            >
              <Checkbox defaultChecked={r.checked} />
              <span className="text-opt-md text-opt-text-primary">{r.label}</span>
              <span className="ml-auto font-opt-mono text-opt-sm text-opt-text-secondary tabular-nums">
                {r.count}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<Panel />}
        caption="Multi-select filter sidebar — checked rows tally on the right. In dark mode the checkbox inverts (white fill, ink tick) to keep contrast even."
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
