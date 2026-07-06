import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Component,
  FilePlus,
  Frame,
  Settings,
  Shapes,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Button } from "./button";
import {
  Menu,
  MenuCheckItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "./menu";

const meta: Meta<typeof Menu> = {
  title: "Molecules/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Dropdown action list. Items with optional icons, shortcuts, dividers, checkboxes, and submenus. 28h items, mono shortcut chip, destructive row last in group.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Menu>;

// ── Playground · file menu ──────────────────────────────────────
export const Default: Story = {
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="secondary">File menu</Button>
      </MenuTrigger>
      <MenuContent align="start">
        <MenuLabel>File</MenuLabel>
        <MenuItem leadingIcon={<FilePlus size={14} strokeWidth={2} />} shortcut="⌘N">
          New canvas
        </MenuItem>
        <MenuItem leadingIcon={<ArrowDownToLine size={14} strokeWidth={2} />} shortcut="⌘I">
          Import…
        </MenuItem>
        <MenuSub>
          <MenuSubTrigger leadingIcon={<ArrowUpFromLine size={14} strokeWidth={2} />}>
            Export
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>PNG</MenuItem>
            <MenuItem>SVG</MenuItem>
            <MenuItem>PDF</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuLabel>Workspace</MenuLabel>
        <MenuItem leadingIcon={<UserPlus size={14} strokeWidth={2} />}>
          Invite collaborators
        </MenuItem>
        <MenuItem leadingIcon={<Settings size={14} strokeWidth={2} />} shortcut="⌘,">
          Settings
        </MenuItem>
        <MenuSeparator />
        <MenuItem destructive leadingIcon={<Trash2 size={14} strokeWidth={2} />} shortcut="⌫">
          Delete canvas
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

// ── Every flavor of row ─────────────────────────────────────────
export const Flavors: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-opt-2xl p-opt-2xl bg-opt-surface-low rounded-opt-xl">
      {/* File menu */}
      <Menu defaultOpen>
        <MenuTrigger asChild>
          <Button variant="secondary" size="compact">File</Button>
        </MenuTrigger>
        <MenuContent align="start">
          <MenuLabel>File</MenuLabel>
          <MenuItem leadingIcon={<FilePlus size={14} strokeWidth={2} />} shortcut="⌘N">New canvas</MenuItem>
          <MenuItem leadingIcon={<ArrowDownToLine size={14} strokeWidth={2} />} shortcut="⌘I">Import…</MenuItem>
          <MenuSub>
            <MenuSubTrigger leadingIcon={<ArrowUpFromLine size={14} strokeWidth={2} />}>Export</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>PNG</MenuItem>
              <MenuItem>SVG</MenuItem>
              <MenuItem>PDF</MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuSeparator />
          <MenuLabel>Workspace</MenuLabel>
          <MenuItem leadingIcon={<UserPlus size={14} strokeWidth={2} />}>Invite collaborators</MenuItem>
          <MenuItem leadingIcon={<Settings size={14} strokeWidth={2} />} shortcut="⌘,">Settings</MenuItem>
          <MenuSeparator />
          <MenuItem destructive leadingIcon={<Trash2 size={14} strokeWidth={2} />} shortcut="⌫">
            Delete canvas
          </MenuItem>
        </MenuContent>
      </Menu>

      {/* View menu — check items */}
      <Menu defaultOpen>
        <MenuTrigger asChild>
          <Button variant="secondary" size="compact">View</Button>
        </MenuTrigger>
        <MenuContent align="start">
          <MenuLabel>View</MenuLabel>
          <MenuCheckItem checked shortcut="⇧G">Show grid</MenuCheckItem>
          <MenuCheckItem checked shortcut="⇧R">Show rulers</MenuCheckItem>
          <MenuCheckItem shortcut="⇧C">Show comments</MenuCheckItem>
          <MenuCheckItem>Show outlines</MenuCheckItem>
          <MenuSeparator />
          <MenuLabel>Theme</MenuLabel>
          <MenuRadioGroup defaultValue="light">
            <MenuRadioItem value="light">Light</MenuRadioItem>
            <MenuRadioItem value="dark">Dark</MenuRadioItem>
            <MenuRadioItem value="system">System</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>

      {/* Edit menu — submenu */}
      <Menu defaultOpen>
        <MenuTrigger asChild>
          <Button variant="secondary" size="compact">Edit</Button>
        </MenuTrigger>
        <MenuContent align="start">
          <MenuLabel>Edit</MenuLabel>
          <MenuItem shortcut="⌘Z">Undo</MenuItem>
          <MenuItem shortcut="⇧⌘Z">Redo</MenuItem>
          <MenuSub>
            <MenuSubTrigger>Convert to…</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem leadingIcon={<Shapes size={14} strokeWidth={2} />}>Shape</MenuItem>
              <MenuItem leadingIcon={<Component size={14} strokeWidth={2} />}>Component</MenuItem>
              <MenuItem leadingIcon={<Frame size={14} strokeWidth={2} />}>Frame</MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuItem shortcut="⌘D">Duplicate</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  ),
};

// ── Context menu · right-click pattern ──────────────────────────
export const ContextMenu: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    // Static representation of the open menu so both themes render side by side;
    // the live MenuContent portals to <body> (see the Default / Flavors stories).
    const item = (name: string, shortcut: string) => (
      <div className="flex items-center justify-between rounded-opt-sm px-opt-sm h-opt-xl hover:bg-opt-interactive-ghost-hover">
        <span className="text-opt-md text-opt-text-primary">{name}</span>
        <span className="font-opt-mono text-opt-sm text-opt-text-secondary">{shortcut}</span>
      </div>
    );
    const MenuCard = () => (
      <div className="w-[240px] rounded-opt-md bg-opt-surface-raised border border-opt-border-subtle shadow-opt-md p-[4px]">
        {item("Copy style", "⌥⌘C")}
        {item("Paste style", "⌥⌘V")}
        <div className="my-[4px] border-t border-opt-border-subtle" />
        {item("Duplicate", "⌘D")}
        {item("Lock layer", "⌘L")}
        <div className="my-[4px] border-t border-opt-border-subtle" />
        <div className="flex items-center gap-opt-sm rounded-opt-sm px-opt-sm h-opt-xl">
          <Trash2 size={14} strokeWidth={2} className="text-opt-accent-danger-fill" aria-hidden="true" />
          <span className="text-opt-md text-opt-accent-danger-fill flex-1">Delete layer</span>
          <span className="font-opt-mono text-opt-sm text-opt-accent-danger-fill">⌫</span>
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<MenuCard />}
        caption="Right-click menu — grouped actions split by hairline separators, shortcuts right-aligned, the destructive item in red with a leading icon. Hover fill and text pivot with the theme."
      />
    );
  },
};
