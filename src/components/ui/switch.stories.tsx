import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "Atoms/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Pill toggle for instant changes. Track 28×16 (md). Thumb translates 12px on toggle, 120ms fast. Ink track when on.",
      },
    },
  },
  argTypes: {
    size:     { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    loading:  { control: "boolean" },
    checked:  { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default:  Story = { args: {} };
export const On:       Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading:  Story = { args: { defaultChecked: true, loading: true } };

// ── States · 2 values × 5 states ────────────────────────────────
export const States: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const values = [
      { label: "Off", spec: "neutral-300 track", checked: false },
      { label: "On",  spec: "ink track",         checked: true },
    ];
    const cols = ["Default", "Hover", "Focused", "Disabled", "Loading"];
    return (
      <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
        <div className="grid grid-cols-[200px_repeat(5,1fr)] gap-opt-md items-center">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Value</span>
          {cols.map((c) => (
            <span key={c} className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
              {c}
            </span>
          ))}
          {values.map((v) => (
            <div key={v.label} className="contents">
              <div className="flex flex-col gap-[2px] py-opt-sm">
                <span className="text-opt-sm font-opt-medium text-opt-text-heading">{v.label}</span>
                <span className="font-opt-mono text-[10px] text-opt-text-secondary">{v.spec}</span>
              </div>
              <Switch defaultChecked={v.checked} />
              <Switch defaultChecked={v.checked} />
              <Switch defaultChecked={v.checked} autoFocus={v.label === "Off"} />
              <Switch defaultChecked={v.checked} disabled />
              <Switch defaultChecked={v.checked} loading />
            </div>
          ))}
        </div>
        <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
          2 values · 5 states · thumb translates on toggle · 120ms fast · loading spins in thumb
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
      { label: "Off", checked: false },
      { label: "On",  checked: true },
    ];
    return (
      <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
        <div className="grid grid-cols-[200px_repeat(3,1fr)] gap-opt-md items-center">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Value</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">sm · 24×14</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">md · 28×16 · default</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">lg · 32×18</span>
          {values.map((v) => (
            <div key={v.label} className="contents">
              <span className="text-opt-sm font-opt-medium text-opt-text-heading py-opt-sm">{v.label}</span>
              <Switch size="sm" defaultChecked={v.checked} />
              <Switch size="md" defaultChecked={v.checked} />
              <Switch size="lg" defaultChecked={v.checked} />
            </div>
          ))}
        </div>
        <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
          3 sizes · sm in dense rows · md everyday default · lg pairs with 16px labels
        </div>
      </div>
    );
  },
};

// ── In context · Settings panel (light + dark) ──────────────────
export const InContext: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const rows = [
      { label: "Snap to grid", on: true },
      { label: "Show rulers", on: false },
      { label: "Auto-save", on: true },
      { label: "Hi-res previews", on: false },
    ];
    const Panel = () => (
      <div className="w-[360px] rounded-opt-lg bg-opt-surface-raised border border-opt-border-subtle">
        <div className="px-opt-lg py-opt-md border-b border-opt-border-subtle">
          <span className="text-opt-lg font-opt-semibold text-opt-text-heading">
            Canvas preferences
          </span>
        </div>
        <div className="flex flex-col px-opt-lg">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`flex items-center justify-between py-opt-md ${
                i > 0 ? "border-t border-opt-border-subtle" : ""
              }`}
            >
              <span className="text-opt-md text-opt-text-primary">{r.label}</span>
              <Switch defaultChecked={r.on} />
            </div>
          ))}
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<Panel />}
        caption="Settings list with hairline separators. In dark mode the track inverts — white when on (still committed), neutral-600 when off. The thumb flips ink-on-white so the contrast direction stays consistent."
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
