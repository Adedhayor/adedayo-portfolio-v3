import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import { useState } from "react";
import { FormField } from "./form-field";
import { Input } from "./input";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta: Meta<typeof FormField> = {
  title: "Molecules/Form Field",
  component: FormField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A labeled control with help, validation, and required indication. The smallest unit of a form — Input wrapped in semantic structure. Help and Message swap in the same row so layout never shifts.",
      },
    },
  },
  argTypes: {
    state:    { control: "radio", options: ["default", "success", "warning", "error"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    label:    { control: "text" },
    help:     { control: "text" },
    message:  { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof FormField>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  args: {
    label: "Workspace name",
    required: true,
    help: "3–32 characters. Visible to your team.",
  },
  render: (args) => (
    <div className="w-[320px]">
      <FormField {...args}>
        <Input placeholder="Acme Studios" />
      </FormField>
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    label: "Email",
    required: true,
    state: "error",
    message: "Enter a valid email address",
  },
  render: (args) => (
    <div className="w-[320px]">
      <FormField {...args}>
        <Input state="error" defaultValue="ade@acme" type="email" />
      </FormField>
    </div>
  ),
};

// ── Seven states snapshot ───────────────────────────────────────
export const States: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-5xl">
      <div className="grid grid-cols-3 gap-opt-2xl">
        <FormField label="Project name" help="Default · empty · no help shown">
          <Input placeholder="e.g. Spring campaign" />
        </FormField>
        <FormField label="Project name" help="Focused · 2px Ink ring">
          <Input autoFocus defaultValue="Spring" />
        </FormField>
        <FormField label="Project name" help="Filled · resting">
          <Input defaultValue="Spring campaign 2026" />
        </FormField>

        <FormField
          label="Email"
          required
          state="error"
          message="Enter a valid email address"
        >
          <Input state="error" type="email" defaultValue="ade@acme" />
        </FormField>
        <FormField
          label="Workspace URL"
          state="success"
          message="Available · acme-studios.replikit.app"
        >
          <Input state="success" defaultValue="acme-studios" />
        </FormField>
        <FormField
          label="Password"
          state="warning"
          message="Weak · add a number or symbol"
        >
          <Input state="warning" type="password" defaultValue="abcdef" />
        </FormField>

        <FormField
          label="Plan tier"
          disabled
          help="Managed by your admin · not editable here"
        >
          <Input defaultValue="Pro · annual" disabled />
        </FormField>
      </div>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        7 states · 4 hues · message replaces help when validation fires
      </div>
    </div>
  ),
};

// ── Stacked into a flow ─────────────────────────────────────────
export const StackedFlow: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    function CreateWorkspaceForm() {
      const [url, setUrl] = useState("acme-studios");
      const [email, setEmail] = useState("ade@acme");
      return (
        <div className="w-[400px] p-opt-xl bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md flex flex-col gap-opt-md">
          <h3 className="text-opt-lg font-opt-semibold text-opt-text-heading">Create workspace</h3>
          <FormField label="Workspace name" required help="Visible to your team.">
            <Input defaultValue="Acme Studios" />
          </FormField>
          <FormField
            label="Workspace URL"
            state={url.length > 3 ? "success" : "default"}
            message={url.length > 3 ? "Available" : undefined}
          >
            <Input
              state={url.length > 3 ? "success" : "default"}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </FormField>
          <FormField
            label="Email"
            required
            state={email.includes(".") ? "default" : "error"}
            message={email.includes(".") ? undefined : "Enter a valid email address"}
          >
            <Input
              state={email.includes(".") ? "default" : "error"}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
          <div className="flex justify-end gap-opt-sm pt-opt-sm">
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Create workspace</Button>
          </div>
        </div>
      );
    }
    return (
      <ThemePair
        sample={<CreateWorkspaceForm />}
        caption="Stacked form flow — required marks, inline help, and per-field success / error states. The validation colors and input shells all pivot with the theme."
      />
    );
  },
};

// ── With Select control ─────────────────────────────────────────
export const WithSelect: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="w-[320px]">
      <FormField label="Role" required help="Used for permissions & display.">
        <Select defaultValue="designer">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="marketer">Marketer</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </div>
  ),
};
