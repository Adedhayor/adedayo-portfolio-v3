import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import {
  Plus,
  Download,
  Check,
  Trash2,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Settings,
} from "lucide-react";
import { Button } from "./button";

// Lucide icons inherit `currentColor` from the button's text-* class.
// Paper showcase used 14px @ stroke 2.5 — we match that.
const icon = (Icon: typeof Plus) => (
  <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
);

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Four roles (primary / secondary / ghost / danger), two sizes (standard 32px / compact 24px), five states. Primary handles every default action. Secondary partners with primary on dialogs. Ghost belongs in toolbars and inline contexts. Danger is destructive only — Delete, Remove, Revoke.",
      },
    },
  },
  args: {
    children: "Save changes",
    variant: "primary",
    size: "standard",
  },
  argTypes: {
    variant: { control: "radio", options: ["primary", "secondary", "ghost", "danger"] },
    size:    { control: "radio", options: ["standard", "compact"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
    leadingIcon: {
      control: { type: "select" },
      options: ["none", "plus", "download", "check", "trash", "settings"],
      mapping: {
        none: undefined,
        plus: icon(Plus),
        download: icon(Download),
        check: icon(Check),
        trash: icon(Trash2),
        settings: icon(Settings),
      },
    },
    trailingIcon: {
      control: { type: "select" },
      options: ["none", "arrowRight", "chevronDown", "externalLink"],
      mapping: {
        none: undefined,
        arrowRight: icon(ArrowRight),
        chevronDown: icon(ChevronDown),
        externalLink: icon(ExternalLink),
      },
    },
    type: { control: "radio", options: ["button", "submit", "reset"] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

// ─── Single-variant playgrounds ──────────────────────────────────
export const Primary:   Story = {};
export const Secondary: Story = { args: { variant: "secondary", children: "Cancel" } };
export const Ghost:     Story = { args: { variant: "ghost",     children: "Learn more" } };
export const Danger:    Story = { args: { variant: "danger",    children: "Delete project" } };
export const Compact:   Story = { args: { size: "compact",      children: "Save" } };
export const Disabled:  Story = { args: { disabled: true } };

// ─── Four roles × all sizes × disabled · matrix ──────────────────
const variantRows = [
  { variant: "primary",   label: "Primary",   desc: "Default action · Ink",      std: "Save changes",   compact: "Save" },
  { variant: "secondary", label: "Secondary", desc: "Outlined · 1.5px border",   std: "Cancel",         compact: "Cancel" },
  { variant: "ghost",     label: "Ghost",     desc: "Text-only · no border",     std: "Learn more",     compact: "More" },
  { variant: "danger",    label: "Danger",    desc: "Destructive only",          std: "Delete project", compact: "Delete" },
] as const;

export const FourRoles: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <div className="grid grid-cols-[200px_1fr_1fr_1fr] gap-opt-lg pb-opt-md border-b border-opt-border-subtle">
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
          className="grid grid-cols-[200px_1fr_1fr_1fr] gap-opt-lg items-center"
        >
          <div className="flex flex-col gap-[2px]">
            <span className="font-opt-mono text-[11px] font-opt-medium text-opt-text-heading">
              {row.label}
            </span>
            <span className="text-[11px] text-opt-text-secondary">{row.desc}</span>
          </div>
          <div><Button variant={row.variant} size="standard">{row.std}</Button></div>
          <div><Button variant={row.variant} size="compact">{row.compact}</Button></div>
          <div><Button variant={row.variant} size="standard" disabled>{row.std}</Button></div>
        </div>
      ))}
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        4 variants · 2 sizes · radius 2px · label 13/500 standard · 12/500 compact
      </div>
    </div>
  ),
};

// ─── Leading icon ────────────────────────────────────────────────
export const LeadingIcon: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-md">
      <div className="font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.12em]">
        Leading icon · 6px gap · 12px padding on icon side, 14px on label side
      </div>
      <div className="flex flex-wrap items-center gap-opt-md">
        <Button leadingIcon={icon(Plus)}>New layer</Button>
        <Button variant="secondary" leadingIcon={icon(Download)}>Export</Button>
        <Button variant="ghost"     leadingIcon={icon(Check)}>Apply</Button>
        <Button variant="danger"    leadingIcon={icon(Trash2)}>Delete</Button>
      </div>
    </div>
  ),
};

// ─── Trailing icon ───────────────────────────────────────────────
export const TrailingIcon: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-md">
      <div className="font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.12em]">
        Trailing icon · select / step / external
      </div>
      <div className="flex flex-wrap items-center gap-opt-md">
        <Button variant="secondary" trailingIcon={icon(ChevronDown)}>Designer</Button>
        <Button                     trailingIcon={icon(ArrowRight)}>Continue</Button>
        <Button variant="ghost"     trailingIcon={icon(ExternalLink)}>Open docs</Button>
      </div>
    </div>
  ),
};

// ─── Icon only · square (preview of A02 IconButton) ──────────────
export const IconOnly: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-md">
      <div className="font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.12em]">
        Icon only · square · always pair with tooltip (covered in A02 IconButton)
      </div>
      <div className="flex flex-wrap items-center gap-opt-md">
        <Button                   leadingIcon={icon(Plus)}     aria-label="Add" />
        <Button variant="secondary" leadingIcon={icon(Download)} aria-label="Download" />
        <Button variant="ghost"    leadingIcon={icon(Settings)} aria-label="Settings" />
        <Button variant="danger"   leadingIcon={icon(Trash2)}   aria-label="Delete" />
      </div>
    </div>
  ),
};

// ─── In context · dialog footer ──────────────────────────────────
export const InDialog: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Dialog = () => (
      <div className="w-[400px] flex flex-col gap-opt-lg p-opt-xl rounded-opt-xl bg-opt-surface-raised shadow-opt-md border border-opt-border-subtle">
        <div className="flex flex-col gap-opt-xs">
          <h3 className="text-opt-2xl font-opt-semibold text-opt-text-heading">Delete this project?</h3>
          <p className="text-opt-md text-opt-text-secondary">
            All layers, revisions, and shared links will be permanently removed. This can't be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-opt-sm">
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger">Delete project</Button>
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<Dialog />}
        caption="Dialog footer — secondary Cancel + danger Delete. Danger is the only red in the action layer; in dark mode the secondary's border and the danger fill both hold contrast on the raised surface."
      />
    );
  },
};
