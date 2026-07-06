import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import { Frame, Hand, MousePointer2, PenTool, Square, Circle, Type } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from "./tooltip";
import { IconButton } from "./icon-button";

const meta: Meta<typeof Tooltip> = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Dark bubble for icon-only buttons. Ink #111 bg, 12/500 neutral-50 text, 200ms open delay. Arrow is a 12×6 SVG flush against the bubble.",
      },
    },
  },
  argTypes: {
    side: { control: "radio", options: ["top", "right", "bottom", "left"] },
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

// ── Playground ───────────────────────────────────────────────────
export const Default: Story = {
  args: { label: "Move tool", side: "top" },
  render: (args) => (
    <Tooltip {...args}>
      <IconButton
        variant="secondary"
        icon={<MousePointer2 size={16} strokeWidth={2} />}
        aria-label="Move tool"
      />
    </Tooltip>
  ),
};

export const WithShortcut: Story = {
  args: { label: "Move", shortcut: "V" },
  render: Default.render,
};

export const WithDescription: Story = {
  args: { label: "Auto-layout", description: "Stacks children with consistent spacing" },
  render: Default.render,
};

// ── Four sides ──────────────────────────────────────────────────
export const Positions: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <TooltipProvider delayDuration={0}>
      <div className="grid grid-cols-4 gap-opt-2xl p-opt-2xl bg-opt-surface-low rounded-opt-xl">
        {([
          { side: "top",    label: "Move tool", icon: <MousePointer2 size={16} strokeWidth={2} />, cap: "top · default" },
          { side: "right",  label: "Frame",     icon: <Square size={16} strokeWidth={2} />,        cap: "right" },
          { side: "bottom", label: "Ellipse",   icon: <Circle size={16} strokeWidth={2} />,        cap: "bottom" },
          { side: "left",   label: "Pen",       icon: <PenTool size={16} strokeWidth={2} />,       cap: "left" },
        ] as const).map((p) => (
          <div key={p.side} className="flex flex-col items-center gap-opt-md">
            <TooltipRoot open>
              <TooltipTrigger asChild>
                <IconButton variant="secondary" icon={p.icon} aria-label={p.label} />
              </TooltipTrigger>
              <TooltipContent side={p.side}>{p.label}</TooltipContent>
            </TooltipRoot>
            <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary mt-opt-md">
              {p.cap}
            </span>
          </div>
        ))}
      </div>
    </TooltipProvider>
  ),
};

// ── Three densities ─────────────────────────────────────────────
export const Densities: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <TooltipProvider delayDuration={0}>
      <div className="grid grid-cols-3 gap-opt-2xl p-opt-2xl bg-opt-surface-low rounded-opt-xl">
        <Cell label="Label only · 24px" caption="One or two words. Identifies the action behind an icon.">
          <TooltipRoot open>
            <TooltipTrigger asChild>
              <IconButton variant="secondary" icon={<Hand size={16} strokeWidth={2} />} aria-label="Move" />
            </TooltipTrigger>
            <TooltipContent>Move</TooltipContent>
          </TooltipRoot>
        </Cell>
        <Cell label="With shortcut · 24px" caption="For toolbar items with a keyboard shortcut. Kbd chip uses neutral-800 on Ink.">
          <TooltipRoot open>
            <TooltipTrigger asChild>
              <IconButton variant="secondary" icon={<Hand size={16} strokeWidth={2} />} aria-label="Move" />
            </TooltipTrigger>
            <TooltipContent shortcut="V">Move</TooltipContent>
          </TooltipRoot>
        </Cell>
        <Cell label="With description · auto" caption="Onboarding or unfamiliar terms. Max 2 lines.">
          <TooltipRoot open>
            <TooltipTrigger asChild>
              <IconButton variant="secondary" icon={<Frame size={16} strokeWidth={2} />} aria-label="Auto-layout" />
            </TooltipTrigger>
            <TooltipContent description="Stacks children with consistent spacing">
              Auto-layout
            </TooltipContent>
          </TooltipRoot>
        </Cell>
      </div>
    </TooltipProvider>
  ),
};

// ── Toolbar example ─────────────────────────────────────────────
export const Toolbar: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Toolbar = () => (
      <TooltipProvider delayDuration={200} skipDelayDuration={0}>
        <div className="inline-flex items-center gap-[2px] p-[4px] rounded-opt-sm bg-opt-surface-raised border border-opt-border-default">
          {[
            { label: "Move",    shortcut: "V", icon: <MousePointer2 size={16} strokeWidth={2} /> },
            { label: "Hand",    shortcut: "H", icon: <Hand size={16} strokeWidth={2} /> },
            { label: "Frame",   shortcut: "F", icon: <Square size={16} strokeWidth={2} /> },
            { label: "Ellipse", shortcut: "O", icon: <Circle size={16} strokeWidth={2} /> },
            { label: "Text",    shortcut: "T", icon: <Type size={16} strokeWidth={2} /> },
          ].map((t) => (
            <TooltipRoot key={t.label}>
              <TooltipTrigger asChild>
                <IconButton variant="ghost" size="compact" icon={t.icon} aria-label={t.label} />
              </TooltipTrigger>
              <TooltipContent shortcut={t.shortcut}>{t.label}</TooltipContent>
            </TooltipRoot>
          ))}
        </div>
      </TooltipProvider>
    );
    return (
      <ThemePair
        sample={<Toolbar />}
        caption="Icon-only toolbar — hover any tool for its tooltip. The bubble stays dark in both themes (a focused overlay reads the same everywhere), while the toolbar surface itself pivots light ↔ dark."
      />
    );
  },
};

function Cell({ label, caption, children }: { label: string; caption: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-opt-2xl">
      <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">{label}</span>
      <div className="self-center">{children}</div>
      <span className="text-[11px] text-opt-text-secondary leading-[16px]">{caption}</span>
    </div>
  );
}
