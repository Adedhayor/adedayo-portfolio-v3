import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd, KbdCombo } from "./kbd";

const meta: Meta<typeof Kbd> = {
  title: "Atoms/Kbd",
  component: Kbd,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Keyboard shortcut chip. Single glyphs use 18px squares. Combos chain with 2px gaps — never with \"+\" between keys.",
      },
    },
  },
  argTypes: {
    surface: { control: "radio", options: ["light", "dark", "inline"] },
    size:    { control: "radio", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof Kbd>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = { args: { children: "V" } };
export const Dark:    Story = { args: { surface: "dark", children: "⌘" } };

// ── Three surfaces ──────────────────────────────────────────────
export const Surfaces: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <div className="flex flex-col gap-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">On light · neutral-100 surface</span>
        <KbdCombo>
          <Kbd>V</Kbd><Kbd>T</Kbd><Kbd>⌫</Kbd><Kbd>⌘</Kbd><Kbd>⌥</Kbd><Kbd>↵</Kbd><Kbd>Esc</Kbd>
        </KbdCombo>
        <span className="font-opt-mono text-[10px] text-opt-text-secondary">single key · 18px height · 1px hairline border · neutral-100 bg</span>
      </div>

      <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">On dark · for tooltips & command palette</span>
        <div className="inline-flex p-opt-md bg-opt-ink rounded-opt-sm w-fit">
          <KbdCombo surface="dark">
            <Kbd surface="dark">V</Kbd><Kbd surface="dark">⌘</Kbd><Kbd surface="dark">K</Kbd><Kbd surface="dark">⇧</Kbd><Kbd surface="dark">P</Kbd>
          </KbdCombo>
        </div>
        <span className="font-opt-mono text-[10px] text-opt-text-secondary">neutral-800 bg · neutral-50 text · no border on dark</span>
      </div>

      <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Inline · within prose</span>
        <p className="text-opt-md text-opt-text-primary leading-opt-md">
          Press <Kbd surface="inline">⌘</Kbd><Kbd surface="inline">K</Kbd> to open the command palette,
          or <Kbd surface="inline">?</Kbd> to view all shortcuts.
        </p>
        <span className="font-opt-mono text-[10px] text-opt-text-secondary">16px inline height · 10px glyph · 1px margin</span>
      </div>
    </div>
  ),
};

// ── Three sizes ─────────────────────────────────────────────────
export const Sizes: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const sizes = [
      { size: "sm" as const, label: "sm · 14", spec: "9px glyph · inline prose" },
      { size: "md" as const, label: "md · 18 · default", spec: "11px glyph · menus / tooltips" },
      { size: "lg" as const, label: "lg · 22", spec: "13px glyph · shortcuts panel" },
    ];
    return (
      <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
        <div className="grid grid-cols-[200px_repeat(3,1fr)] gap-opt-md items-center">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Size</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Single key</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Combo</span>
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Word</span>
          {sizes.map((s) => (
            <div key={s.size} className="contents">
              <div className="flex flex-col gap-[2px] py-opt-sm">
                <span className="text-opt-sm font-opt-medium text-opt-text-heading">{s.label}</span>
                <span className="font-opt-mono text-[10px] text-opt-text-secondary">{s.spec}</span>
              </div>
              <div><Kbd size={s.size}>V</Kbd></div>
              <div>
                <KbdCombo size={s.size}>
                  <Kbd size={s.size}>⌘</Kbd><Kbd size={s.size}>K</Kbd>
                </KbdCombo>
              </div>
              <div><Kbd size={s.size}>esc</Kbd></div>
            </div>
          ))}
        </div>
        <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
          3 sizes · sm sits inline · md is default · lg for the shortcuts panel
        </div>
      </div>
    );
  },
};

// ── Combinations · chained vs single chip ───────────────────────
export const Combinations: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <div className="flex flex-col gap-opt-md">
        <div className="flex items-baseline gap-opt-md">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Chained · default</span>
          <span className="font-opt-mono text-[10px] text-opt-text-secondary">one chip per modifier · 2px gap · keys read independently</span>
        </div>
        <div className="flex items-center gap-opt-md">
          <KbdCombo>
            <Kbd>⌘</Kbd><Kbd>⇧</Kbd><Kbd>P</Kbd>
          </KbdCombo>
          <KbdCombo>
            <Kbd>⌥</Kbd><Kbd>⌫</Kbd>
          </KbdCombo>
          <KbdCombo>
            <Kbd>Ctrl</Kbd><Kbd>K</Kbd>
          </KbdCombo>
        </div>
      </div>

      <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
        <div className="flex items-baseline gap-opt-md">
          <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Single chip · compact</span>
          <span className="font-opt-mono text-[10px] text-opt-text-secondary">one chip wraps the whole combo · no inner separators · use when space is tight</span>
        </div>
        <div className="flex items-center gap-opt-md">
          <Kbd>⌘⇧P</Kbd>
          <Kbd>⌥⌫</Kbd>
          <Kbd>Ctrl+K</Kbd>
        </div>
      </div>

      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        Chained for menus & cheatsheets · single chip for tooltips & inline labels
      </div>
    </div>
  ),
};

// ── In context · Shortcuts panel (light + dark) ─────────────────
// Kbd's `surface` is not theme-aware (light = neutral-100 + hairline,
// dark = neutral-800, no border), so each column passes its own surface —
// matching the Paper sample exactly.
type ShortcutGroup = { label: string; items: { name: string; keys: string[] }[] };

const SHORTCUTS: ShortcutGroup[] = [
  { label: "Tools", items: [
    { name: "Move", keys: ["V"] },
    { name: "Frame", keys: ["F"] },
  ] },
  { label: "Edit", items: [
    { name: "Duplicate", keys: ["⌘", "D"] },
    { name: "Command palette", keys: ["⌘", "K"] },
  ] },
];

export const InContext: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Panel = ({ surface }: { surface: "light" | "dark" }) => (
      <div className="w-[420px] rounded-opt-lg bg-opt-surface-raised border border-opt-border-subtle p-opt-md">
        <div className="flex items-center justify-between pb-opt-sm border-b border-opt-border-subtle">
          <span className="text-opt-lg font-opt-semibold text-opt-text-heading">
            Keyboard shortcuts
          </span>
          <Kbd surface={surface}>?</Kbd>
        </div>
        {SHORTCUTS.map((g) => (
          <div key={g.label} className="pt-opt-sm">
            <span className="block py-opt-xs font-opt-mono text-[10px] uppercase tracking-[0.12em] text-opt-text-placeholder">
              {g.label}
            </span>
            {g.items.map((it) => (
              <div
                key={it.name}
                className="flex items-center justify-between py-opt-xs"
              >
                <span className="text-opt-md text-opt-text-primary">{it.name}</span>
                <KbdCombo surface={surface}>
                  {it.keys.map((k) => (
                    <Kbd key={k} surface={surface}>{k}</Kbd>
                  ))}
                </KbdCombo>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
    return (
      <div className="flex flex-col gap-opt-lg w-[920px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-opt-xl">
          <div className="flex flex-col gap-opt-sm">
            <span className="font-opt-mono text-[10px] font-opt-medium uppercase tracking-[0.14em] text-opt-text-placeholder">
              Light · :root
            </span>
            <div className="rounded-opt-xl bg-opt-surface-base border border-opt-border-subtle p-opt-xl flex justify-center">
              <Panel surface="light" />
            </div>
          </div>
          <div className="flex flex-col gap-opt-sm">
            <span className="font-opt-mono text-[10px] font-opt-medium uppercase tracking-[0.14em] text-opt-text-placeholder">
              Dark · .dark
            </span>
            <div className="dark rounded-opt-xl bg-opt-surface-base border border-opt-border-subtle p-opt-xl flex justify-center">
              <Panel surface="dark" />
            </div>
          </div>
        </div>
        <p className="text-opt-md text-opt-text-secondary max-w-3xl">
          Shortcuts panel grouped by category, kbd chip right-aligned. The light
          variant uses the neutral-100 fill + 1px hairline; dark drops the border
          and lifts to neutral-800 so the chip stays legible without competing.
        </p>
      </div>
    );
  },
};

// ── In context · Menu & command palette (kbd pairings) ──────────
export const MenuPairings: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-lg w-[920px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-opt-xl">
        {/* Menu item · trailing kbd (light) */}
        <div className="flex flex-col gap-opt-sm">
          <span className="font-opt-mono text-[10px] font-opt-medium uppercase tracking-[0.14em] text-opt-text-placeholder">
            Menu item · trailing kbd
          </span>
          <div className="rounded-opt-xl bg-opt-surface-base border border-opt-border-subtle p-opt-xl flex justify-center">
            <div className="w-[260px] rounded-opt-md bg-opt-surface-raised border border-opt-border-subtle shadow-opt-md p-[4px]">
              {[
                { name: "Duplicate", keys: ["⌘", "D"], active: true },
                { name: "Group selection", keys: ["⌘", "G"], active: false },
                { name: "Send to back", keys: ["⌘", "⇧", "["], active: false },
              ].map((it) => (
                <div
                  key={it.name}
                  className={`flex items-center justify-between rounded-opt-sm px-opt-sm h-opt-xl ${
                    it.active ? "bg-opt-interactive-ghost-hover" : ""
                  }`}
                >
                  <span className="text-opt-md text-opt-text-primary">{it.name}</span>
                  <KbdCombo>
                    {it.keys.map((k) => (
                      <Kbd key={k}>{k}</Kbd>
                    ))}
                  </KbdCombo>
                </div>
              ))}
              <div className="my-[4px] border-t border-opt-border-subtle" />
              <div className="flex items-center justify-between rounded-opt-sm px-opt-sm h-opt-xl">
                <span className="text-opt-md text-opt-accent-danger-fill">Delete</span>
                <Kbd>⌫</Kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Command palette (always dark) */}
        <div className="flex flex-col gap-opt-sm">
          <span className="font-opt-mono text-[10px] font-opt-medium uppercase tracking-[0.14em] text-opt-text-placeholder">
            Command palette · dark
          </span>
          <div className="rounded-opt-xl bg-opt-surface-base border border-opt-border-subtle p-opt-xl flex justify-center">
            <div className="dark w-[320px] rounded-opt-md bg-opt-neutral-900 border border-opt-neutral-800 shadow-opt-md p-[6px]">
              <div className="flex items-center justify-between px-opt-sm h-opt-2xl border-b border-opt-neutral-800 mb-[4px]">
                <span className="text-opt-md text-opt-neutral-400">Search commands…</span>
                <Kbd surface="dark">esc</Kbd>
              </div>
              <div className="flex items-center justify-between rounded-opt-sm px-opt-sm h-opt-xl bg-opt-neutral-800">
                <span className="text-opt-md text-opt-neutral-50">Add hero section</span>
                <Kbd surface="dark">↵</Kbd>
              </div>
              <div className="flex items-center justify-between rounded-opt-sm px-opt-sm h-opt-xl">
                <span className="text-opt-md text-opt-neutral-300">Publish project</span>
                <KbdCombo surface="dark">
                  <Kbd surface="dark">⌘</Kbd>
                  <Kbd surface="dark">⇧</Kbd>
                  <Kbd surface="dark">P</Kbd>
                </KbdCombo>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-opt-md text-opt-text-secondary max-w-3xl">
        Menu items pair label-left, kbd-right. The command palette stays dark in
        both themes to read like a focused console — the same kbd primitive on a
        neutral-800 surface, no border.
      </p>
    </div>
  ),
};
