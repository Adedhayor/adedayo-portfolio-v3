import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Search,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Input } from "./input";
import { ThemePair } from "./_in-context";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Text fields. 1.5px border, 2px radius. Five shapes share the same shell — text, search, with-clear, number-with-unit, password. Six states; error is the only place red appears on an Input.",
      },
    },
  },
  args: {
    placeholder: "Project name",
    size: "standard",
    state: "default",
  },
  argTypes: {
    size:        { control: "radio", options: ["standard", "compact"] },
    state:       { control: "radio", options: ["default", "success", "warning", "error"] },
    disabled:    { control: "boolean" },
    placeholder: { control: "text" },
    type:        { control: "radio", options: ["text", "search", "number", "password", "email", "url"] },
    // Slot props are ReactNode / callbacks — Storybook's auto-arg generation
    // hands `{}` to ReactNode props, which crashes the input because the
    // component renders `{leadingIcon && <span>{leadingIcon}</span>}` and
    // `{}` is truthy but not renderable. Hide them from the controls panel.
    leadingIcon:    { table: { disable: true }, control: false },
    trailingIcon:   { table: { disable: true }, control: false },
    onClear:        { table: { disable: true }, control: false },
    clearable:      { table: { disable: true }, control: false },
    unit:           { table: { disable: true }, control: false },
    shellClassName: { table: { disable: true }, control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

const SHELL = "w-[320px]";
const SHELL_NARROW = "w-[160px]";

// ── Single-variant playgrounds ──────────────────────────────────
export const Default:    Story = { args: { shellClassName: SHELL } };
export const Compact:    Story = { args: { shellClassName: SHELL, size: "compact" } };
export const Disabled:   Story = { args: { shellClassName: SHELL, disabled: true } };
export const WithValue:  Story = {
  args: { shellClassName: SHELL, defaultValue: "Hero section", placeholder: "Project name" },
};

// ── Five shapes — matches Paper variants section ────────────────
export const FiveShapes: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const [search, setSearch] = useState("hero section");
    const [num, setNum] = useState("240");
    const [pwd, setPwd] = useState("supersecret");

    return (
      <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
        {[
          {
            label: "Text",
            desc: "Default input",
            spec: 'type="text" · placeholder',
            field: <Input shellClassName={SHELL} placeholder="Project name" />,
          },
          {
            label: "Search",
            desc: "Leading icon",
            spec: "14px icon · 8px gap",
            field: (
              <Input
                shellClassName={SHELL}
                type="search"
                placeholder="Search layers…"
                leadingIcon={<Search size={14} strokeWidth={2} />}
              />
            ),
          },
          {
            label: "With clear",
            desc: "Trailing X · clears value",
            spec: "12px clear icon · 20px hit area",
            field: (
              <Input
                shellClassName={SHELL}
                leadingIcon={<Search size={14} strokeWidth={2} />}
                clearable
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />
            ),
          },
          {
            label: "Number",
            desc: "Property panel · with unit",
            spec: "mono digits · trailing unit",
            field: (
              <Input
                shellClassName={SHELL_NARROW}
                type="number"
                unit="px"
                value={num}
                onChange={(e) => setNum(e.target.value)}
              />
            ),
          },
          {
            label: "Password",
            desc: "Masked · toggle visibility",
            spec: 'type="password" · eye toggle',
            field: (
              <Input
                shellClassName={SHELL}
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            ),
          },
        ].map((row) => (
          <div key={row.label} className="grid grid-cols-[200px_320px_1fr] gap-opt-lg items-center">
            <div className="flex flex-col gap-[2px]">
              <span className="font-opt-mono text-[11px] font-opt-medium text-opt-text-heading">
                {row.label}
              </span>
              <span className="text-[11px] text-opt-text-secondary">{row.desc}</span>
            </div>
            {row.field}
            <span className="font-opt-mono text-[11px] text-opt-text-secondary">{row.spec}</span>
          </div>
        ))}
        <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
          5 variants · all 32px height · 1.5px border neutral-200 · radius 2px
        </div>
      </div>
    );
  },
};

// ── Six states — matches Paper states section ───────────────────
export const SixStates: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <div className="grid grid-cols-3 gap-opt-lg">
        {[
          { label: "Default",    spec: "border neutral-200 · placeholder", field: <Input shellClassName="w-full" placeholder="Project name" /> },
          { label: "Hover",      spec: "border lifts to neutral-300",      field: <Input shellClassName="w-full" placeholder="Project name" /> },
          { label: "Focused",    spec: "border ink · 2px ring 12%",        field: <Input shellClassName="w-full" autoFocus defaultValue="Hero section" /> },
          { label: "With value", spec: "text primary · border at rest",    field: <Input shellClassName="w-full" defaultValue="Hero section" /> },
          { label: "Error",      spec: "border red-500 · ring 12% red",    field: <Input shellClassName="w-full" state="error" defaultValue="Hero section" /> },
          { label: "Disabled",   spec: "bg neutral-50 · border neutral-100", field: <Input shellClassName="w-full" disabled placeholder="Project name" /> },
        ].map((s) => (
          <div key={s.label} className="flex flex-col gap-opt-sm">
            {s.field}
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
        6 states · focus ring = 2px ink at 12% opacity · error uses red-500 (only) · no red without error
      </div>
    </div>
  ),
};

// ── Three validation feedback states ────────────────────────────
export const Validation: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-md">
      {[
        {
          label: "Username",
          state: "success" as const,
          value: "adedayo-rk",
          message: "Username available",
          fieldIcon: <CheckCircle size={14} strokeWidth={2.5} className="text-opt-green-700 dark:text-opt-green-500" />,
        },
        {
          label: "Username",
          state: "warning" as const,
          value: "adedayo",
          message: "Short usernames are hard to find later",
          fieldIcon: <AlertTriangle size={14} strokeWidth={2.5} className="text-opt-amber-700 dark:text-opt-amber-500" />,
        },
        {
          label: "Username",
          state: "error" as const,
          value: "replikit",
          message: "Username already taken",
          fieldIcon: <AlertCircle size={14} strokeWidth={2.5} className="text-opt-red-700 dark:text-opt-red-400" />,
        },
      ].map((row, i) => (
        <div key={i} className="flex flex-col gap-opt-xs">
          <label className="text-opt-md font-opt-medium text-opt-text-heading">{row.label}</label>
          <Input
            shellClassName="w-full"
            state={row.state}
            defaultValue={row.value}
            trailingIcon={row.fieldIcon}
          />
          <Input.FieldMessage variant={row.state}>{row.message}</Input.FieldMessage>
        </div>
      ))}
    </div>
  ),
};

// ── Composition · label + helper / error ────────────────────────
export const Composition: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      {/* Two heights */}
      <div className="flex flex-col gap-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
          Two heights
        </span>
        <div className="flex gap-opt-2xl items-end">
          <div className="flex flex-col gap-[6px]">
            <span className="font-opt-mono text-[11px] text-opt-text-secondary">
              Standard · 32 · forms &amp; dialogs
            </span>
            <Input shellClassName="w-[280px]" defaultValue="Hero section" />
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="font-opt-mono text-[11px] text-opt-text-secondary">
              Compact · 24 · property panel
            </span>
            <Input size="compact" shellClassName="w-[200px]" defaultValue="Hero section" />
          </div>
        </div>
      </div>

      {/* Full composition · label + helper / error */}
      <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">
          Full composition · label + helper / error
        </span>
        <div className="grid grid-cols-2 gap-opt-2xl items-start max-w-[680px]">
          {/* With helper */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-baseline gap-opt-xs">
              <label className="text-[13px] font-opt-medium text-opt-text-heading">
                Project name
              </label>
              <span className="text-[11px] text-opt-text-secondary">Optional</span>
            </div>
            <Input shellClassName="w-full" placeholder="My new project" />
            <Input.FieldMessage variant="helper">
              Lowercase letters, numbers, and dashes only. Used in the URL.
            </Input.FieldMessage>
          </div>

          {/* With error */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-opt-medium text-opt-text-heading">
              Project name
            </label>
            <Input shellClassName="w-full" state="error" defaultValue="hero/section" />
            <Input.FieldMessage variant="error">
              Slashes aren't allowed in project names
            </Input.FieldMessage>
          </div>
        </div>
      </div>

      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        Label 13/500 · 6px gap to input · helper 11/400 · error helper uses red-700
      </div>
    </div>
  ),
};

// ── In context · Property panel (light + dark) ──────────────────
function NumField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-opt-sm min-w-0">
      <span className="w-[14px] shrink-0 font-opt-mono text-[10px] uppercase text-opt-text-placeholder">
        {label}
      </span>
      <Input size="compact" unit="px" defaultValue={value} shellClassName="w-full min-w-0" />
    </div>
  );
}

export const InContext: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Panel = () => (
      <div className="w-[440px] rounded-opt-lg bg-opt-surface-raised border border-opt-border-subtle p-opt-lg flex flex-col gap-opt-md">
        <span className="text-opt-lg font-opt-semibold text-opt-text-heading">
          Properties
        </span>
        <div className="grid grid-cols-2 gap-opt-sm">
          <NumField label="W" value="1440" />
          <NumField label="H" value="900" />
          <NumField label="X" value="240" />
          <NumField label="Y" value="160" />
        </div>
        <div className="flex items-center gap-opt-sm pt-opt-sm border-t border-opt-border-subtle">
          <span className="w-[34px] shrink-0 font-opt-mono text-[10px] uppercase text-opt-text-placeholder">
            Name
          </span>
          <Input shellClassName="w-full" size="compact" defaultValue="Hero section" />
        </div>
      </div>
    );
    return (
      <ThemePair
        sample={<Panel />}
        caption="Compact (24px) inputs in a property panel, paired with a fixed-width label slot so W / H / X / Y always line up. The unit suffix is baked into the field, not typed. Focus gets the Ink border + soft ring — in dark mode the ring inverts to a faint white glow."
      />
    );
  },
};

