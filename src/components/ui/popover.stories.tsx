import type { Meta, StoryObj } from "@storybook/react-vite";
import { Magnet } from "lucide-react";
import { ThemePair } from "./_in-context";
import { Button } from "./button";
import { Input } from "./input";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "./popover";

const meta: Meta<typeof Popover> = {
  title: "Molecules/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Floating panel anchored to a trigger. Holds rich content too big for a tooltip and too cheap for a dialog — mini-forms, pickers, info cards. If it needs scroll or multi-step, promote to Dialog.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Popover>;

const swatches = [
  "#111111", "#D72638", "#1F8C5E", "#A86D18", "#3656F0", "#F3C419", "#2DAFC4", "#F7F7F7",
];

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <Magnet size={14} strokeWidth={2} aria-hidden="true" />
          <span className="ml-opt-xs">Snap to grid</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader title="Snap to grid">
          Aligns layers to the 8px baseline.
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

// ── Four placements ─────────────────────────────────────────────
export const Placements: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="relative w-[640px] h-[360px] bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md p-opt-2xl">
      <div className="grid grid-cols-2 grid-rows-2 gap-opt-2xl h-full">
        <div className="flex items-center justify-center">
          <Popover defaultOpen>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="compact">Trigger · top</Button>
            </PopoverTrigger>
            <PopoverContent side="top">
              <PopoverHeader title="Snap to grid">Aligns layers to the 8px baseline.</PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-center">
          <Popover defaultOpen>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="compact">Trigger · bottom</Button>
            </PopoverTrigger>
            <PopoverContent side="bottom">
              <PopoverHeader title="Need help?">See the docs at replikit.app/docs.</PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-center">
          <Popover defaultOpen>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="compact">Trigger · right</Button>
            </PopoverTrigger>
            <PopoverContent side="right">
              <PopoverHeader title="Auto-save">Last saved 2 minutes ago.</PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-center">
          <Popover defaultOpen>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="compact">Trigger · left</Button>
            </PopoverTrigger>
            <PopoverContent side="left">
              <PopoverHeader title="Layer locked">Click the lock icon to unlock.</PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  ),
};

// ── Content patterns · picker + share ───────────────────────────
export const ContentPatterns: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    // Static representation of open popovers so both themes render side by side;
    // the live PopoverContent portals to <body> (see Default / Placements). The
    // surface classes mirror PopoverContent exactly so the mock re-themes identically.
    const Card = ({ children }: { children: React.ReactNode }) => (
      <div className="w-[252px] bg-opt-surface-raised dark:bg-opt-neutral-850 border border-opt-border-subtle dark:border-opt-neutral-800 rounded-opt-lg p-[10px] shadow-opt-md dark:shadow-[0_4px_12px_rgba(0,0,0,0.40),0_2px_4px_rgba(0,0,0,0.20)]">
        {children}
      </div>
    );
    const Header = ({ title }: { title: string }) => (
      <div className="flex flex-col gap-[2px] pb-opt-xs">
        <h4 className="text-[13px] font-opt-medium leading-[18px] text-opt-text-heading">{title}</h4>
      </div>
    );
    const Stack = () => (
      <div className="flex flex-col gap-opt-lg">
        {/* Picker · swatches + hex */}
        <Card>
          <Header title="Fill" />
          <div className="flex flex-col gap-opt-sm">
            <div className="grid grid-cols-8 gap-[6px]">
              {swatches.map((c) => (
                <div
                  key={c}
                  className="w-[20px] h-[20px] rounded-opt-sm border border-opt-border-subtle"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-opt-xs">
              <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">HEX</span>
              <Input shellClassName="flex-1" size="compact" defaultValue="#111111" />
            </div>
          </div>
        </Card>

        {/* Share · multi-section */}
        <Card>
          <Header title="Share canvas" />
          <div className="flex flex-col gap-opt-sm">
            <span className="text-[12px] text-opt-accent-success-fill inline-flex items-center gap-[4px]">
              ⌬ Anyone with link · view
            </span>
            <div className="flex items-center gap-opt-xs">
              <Input shellClassName="flex-1" size="compact" defaultValue="replikit.app/c/k9p2x" readOnly />
              <Button size="compact" variant="secondary">Copy</Button>
            </div>
          </div>
        </Card>
      </div>
    );
    return (
      <ThemePair
        sample={<Stack />}
        caption="Popover content patterns — a fill picker and a share panel. The floating surface steps to neutral-850 in dark with a deeper shadow; header, body, swatch borders, the input and the status text all pivot through the semantic layer. Live, interactive popovers (mini-form, color picker) are in Default / Placements."
      />
    );
  },
};
