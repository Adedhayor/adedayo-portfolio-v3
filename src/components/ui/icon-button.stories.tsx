import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import { useState } from "react";
import {
  Plus, Trash2,
  MousePointer2, Hand, Square as SquareIcon, Circle as CircleIcon, Type,
  Bold, Italic, Underline, Strikethrough,
  Eye, Lock, Move, Settings,
  type LucideIcon,
} from "lucide-react";
import { IconButton } from "./icon-button";

// Paper showcase uses 14px @ stroke 2.5 for 32px buttons, 12px for 24px.
// IconButton itself doesn't size the icon — the consumer passes the icon, sized.
const iconAt = (Icon: LucideIcon, size: number) => (
  <Icon size={size} strokeWidth={2.5} aria-hidden="true" />
);

const meta: Meta<typeof IconButton> = {
  title: "Atoms/Icon Button",
  component: IconButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Toolbar workhorse. **Always pair with a tooltip.** Same 4 roles as Button but ghost is the default. Six states — Active is unique to IconButton (Filled for exclusive tool selection, Tonal for independent toggles).",
      },
    },
  },
  args: {
    icon: iconAt(Plus, 14),
    "aria-label": "Add",
    variant: "ghost",
    size: "standard",
  },
  argTypes: {
    variant:    { control: "radio", options: ["primary", "secondary", "ghost", "danger"] },
    size:       { control: "radio", options: ["standard", "compact"] },
    active:     { control: "radio", options: [false, "filled", "tonal"] },
    disabled:   { control: "boolean" },
    icon: {
      control: { type: "select" },
      options: ["plus", "trash", "move", "settings", "bold", "eye", "lock"],
      mapping: {
        plus:     iconAt(Plus, 14),
        trash:    iconAt(Trash2, 14),
        move:     iconAt(Move, 14),
        settings: iconAt(Settings, 14),
        bold:     iconAt(Bold, 14),
        eye:      iconAt(Eye, 14),
        lock:     iconAt(Lock, 14),
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof IconButton>;

// ─── Single-variant playgrounds ──────────────────────────────────
export const Ghost:     Story = {};
export const Primary:   Story = { args: { variant: "primary",   "aria-label": "Add layer" } };
export const Secondary: Story = { args: { variant: "secondary", "aria-label": "Export" } };
export const Danger:    Story = { args: { variant: "danger", icon: iconAt(Trash2, 14), "aria-label": "Delete" } };
export const Compact:   Story = { args: { size: "compact", icon: iconAt(Plus, 12), "aria-label": "Add" } };
export const Disabled:  Story = { args: { disabled: true, "aria-label": "Add (disabled)" } };

// ─── Four roles × all sizes × disabled · matrix ──────────────────
type IBVariant = "primary" | "secondary" | "ghost" | "danger";
const variantRows: { variant: IBVariant; label: string; desc: string; icon: LucideIcon }[] = [
  { variant: "primary",   label: "Primary",   desc: "Floating action / FAB",         icon: Plus },
  { variant: "secondary", label: "Secondary", desc: "Outlined · floating contexts",  icon: Plus },
  { variant: "ghost",     label: "Ghost",     desc: "Toolbar workhorse · DEFAULT",   icon: Plus },
  { variant: "danger",    label: "Danger",    desc: "Destructive icon",              icon: Trash2 },
];

export const FourRoles: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <div className="grid grid-cols-[240px_1fr_1fr_1fr] gap-opt-lg pb-opt-md border-b border-opt-border-subtle">
        {["Variant", "Standard · 32", "Compact · 24", "Disabled · 32"].map((label) => (
          <div
            key={label}
            className="font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.12em]"
          >
            {label}
          </div>
        ))}
      </div>
      {variantRows.map((row) => (
        <div
          key={row.variant}
          className="grid grid-cols-[240px_1fr_1fr_1fr] gap-opt-lg items-center"
        >
          <div className="flex flex-col gap-[2px]">
            <span className="font-opt-mono text-[11px] font-opt-medium text-opt-text-heading">
              {row.label}
            </span>
            <span className="text-[11px] text-opt-text-secondary">{row.desc}</span>
          </div>
          <div><IconButton variant={row.variant} size="standard" icon={iconAt(row.icon, 14)} aria-label={row.label} /></div>
          <div><IconButton variant={row.variant} size="compact"  icon={iconAt(row.icon, 12)} aria-label={row.label} /></div>
          <div><IconButton variant={row.variant} size="standard" disabled icon={iconAt(row.icon, 14)} aria-label={`${row.label} (disabled)`} /></div>
        </div>
      ))}
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        4 variants · ghost is default for toolbars · primary reserved for FAB / sticky CTAs
      </div>
    </div>
  ),
};

// ─── Active treatments — Filled vs Tonal ─────────────────────────
export const ActiveFilled: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    return (
      <div className="flex flex-col gap-opt-md">
        <div className="font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.12em]">
          Filled · primary tool · only one active at a time
        </div>
        <div className="flex flex-wrap items-center gap-opt-xs p-opt-sm rounded-opt-md bg-opt-surface-raised border border-opt-border-subtle w-fit">
          <IconButton icon={iconAt(MousePointer2, 14)} aria-label="Select" />
          <IconButton icon={iconAt(Hand, 14)}          aria-label="Hand"   />
          <IconButton icon={iconAt(SquareIcon, 14)}    aria-label="Rectangle" active="filled" />
          <IconButton icon={iconAt(CircleIcon, 14)}    aria-label="Ellipse" />
          <IconButton icon={iconAt(Type, 14)}          aria-label="Text"   />
        </div>
        <p className="text-opt-md text-opt-text-secondary max-w-2xl">
          Use <code className="font-opt-mono text-opt-sm">active=&quot;filled&quot;</code> when the user has committed to one
          tool out of a mutually exclusive set — Move, Frame, Pen. Ink fill, white icon.
        </p>
      </div>
    );
  },
};

export const ActiveTonal: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const [bold, setBold] = useState(true);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(true);
    const [strike, setStrike] = useState(false);

    return (
      <div className="flex flex-col gap-opt-md">
        <div className="font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.12em]">
          Tonal · toggle · many can be on at once · click to try
        </div>
        <div className="flex flex-wrap items-center gap-opt-xs p-opt-sm rounded-opt-md bg-opt-surface-raised border border-opt-border-subtle w-fit">
          <IconButton size="compact" icon={iconAt(Bold, 12)}          aria-label="Bold"          active={bold ? "tonal" : false}       onClick={() => setBold((v) => !v)} />
          <IconButton size="compact" icon={iconAt(Italic, 12)}        aria-label="Italic"        active={italic ? "tonal" : false}     onClick={() => setItalic((v) => !v)} />
          <IconButton size="compact" icon={iconAt(Underline, 12)}     aria-label="Underline"     active={underline ? "tonal" : false}  onClick={() => setUnderline((v) => !v)} />
          <IconButton size="compact" icon={iconAt(Strikethrough, 12)} aria-label="Strikethrough" active={strike ? "tonal" : false}     onClick={() => setStrike((v) => !v)} />
        </div>
        <p className="text-opt-md text-opt-text-secondary max-w-2xl">
          Use <code className="font-opt-mono text-opt-sm">active=&quot;tonal&quot;</code> for togglable formatting — Bold,
          Italic, Visibility. Neutral-200 fill, ink icon. <code className="font-opt-mono text-opt-sm">aria-pressed</code>{" "}
          is wired automatically so screen readers announce the toggle state.
        </p>
      </div>
    );
  },
};

// ─── In context · toolbar ────────────────────────────────────────
export const ToolbarInContext: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Toolbar = () => {
      const [tool, setTool] = useState<"select" | "hand" | "rect" | "circle" | "text">("rect");
      const tools: { id: typeof tool; Icon: LucideIcon; label: string }[] = [
        { id: "select", Icon: MousePointer2, label: "Select" },
        { id: "hand",   Icon: Hand,          label: "Hand" },
        { id: "rect",   Icon: SquareIcon,    label: "Rectangle" },
        { id: "circle", Icon: CircleIcon,    label: "Ellipse" },
        { id: "text",   Icon: Type,          label: "Text" },
      ];
      return (
        <div className="flex items-center gap-opt-xs p-opt-sm rounded-opt-md bg-opt-surface-raised border border-opt-border-subtle w-fit">
          {tools.map((t) => (
            <IconButton
              key={t.id}
              icon={iconAt(t.Icon, 14)}
              aria-label={t.label}
              active={tool === t.id ? "filled" : false}
              onClick={() => setTool(t.id)}
            />
          ))}
        </div>
      );
    };
    return (
      <ThemePair
        sample={<Toolbar />}
        caption="32px ghost toolbar — one tool stays committed (Filled), the rest fall back to Ghost. Click to switch. In dark mode the Filled fill inverts so the active tool still reads as 'on'."
      />
    );
  },
};
