import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbAuto,
} from "./breadcrumb";
import { ThemePair } from "./_in-context";

const meta: Meta<typeof Breadcrumb> = {
  title: "Atoms/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Where am I? Path from root to current page with chevron separators. Parent items at 13/400 muted; current page steps up to 13/500 ink. When the path exceeds 3 levels, middle items collapse into a clickable ellipsis chip.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#">Projects</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="#">Marketing</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Hero section</BreadcrumbItem>
    </Breadcrumb>
  ),
};

// ── Three shapes ────────────────────────────────────────────────
export const Shapes: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <div className="flex flex-col gap-opt-md">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Default · text only</span>
        <Breadcrumb>
          <BreadcrumbItem href="#">Projects</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#">Marketing</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>Hero section</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">With leading icon · home anchor</span>
        <Breadcrumb>
          <BreadcrumbItem href="#" leadingIcon={<Home size={12} strokeWidth={2} />} aria-label="Home" />
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#">Projects</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#">Marketing</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>Hero section</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="flex flex-col gap-opt-md pt-opt-md border-t border-opt-border-subtle">
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Truncated · long paths collapse to ellipsis</span>
        <Breadcrumb>
          <BreadcrumbItem href="#">Projects</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbEllipsis />
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#">Marketing</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>Hero section</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        3 shapes · default · with icon · truncated · current item bolds + darkens
      </div>
    </div>
  ),
};

// ── Three link states ───────────────────────────────────────────
export const States: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-xl p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <div className="grid grid-cols-3 gap-opt-2xl items-start">
        <div className="flex flex-col gap-opt-md">
          <BreadcrumbItemPreview>
            <a href="#" className="text-[13px] text-opt-text-secondary hover:text-opt-text-heading hover:underline underline-offset-2">Marketing</a>
          </BreadcrumbItemPreview>
          <div className="flex flex-col gap-[2px]">
            <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Default</span>
            <span className="font-opt-mono text-[10px] text-opt-text-secondary">muted link</span>
          </div>
        </div>
        <div className="flex flex-col gap-opt-md">
          <BreadcrumbItemPreview>
            <span className="text-[13px] text-opt-text-heading underline underline-offset-2">Marketing</span>
          </BreadcrumbItemPreview>
          <div className="flex flex-col gap-[2px]">
            <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Hover</span>
            <span className="font-opt-mono text-[10px] text-opt-text-secondary">ink + underline</span>
          </div>
        </div>
        <div className="flex flex-col gap-opt-md">
          <BreadcrumbItemPreview>
            <span className="text-[13px] font-opt-medium text-opt-text-heading">Hero section</span>
          </BreadcrumbItemPreview>
          <div className="flex flex-col gap-[2px]">
            <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Current</span>
            <span className="font-opt-mono text-[10px] text-opt-text-secondary">ink + 500 weight</span>
          </div>
        </div>
      </div>
      <div className="pt-opt-sm border-t border-opt-border-subtle font-opt-mono text-[10px] uppercase text-opt-text-secondary tracking-[0.16em]">
        Three states per item · current is the last in the chain, never a link
      </div>
    </div>
  ),
};

// ── Auto-build with truncation ──────────────────────────────────
export const AutoTruncated: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-opt-md p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-4xl">
      <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary">Auto · 6-level path with maxItems=4</span>
      <BreadcrumbAuto
        maxItems={4}
        items={[
          { label: "Projects", href: "#" },
          { label: "Replikit",   href: "#" },
          { label: "Design system", href: "#" },
          { label: "Atoms",     href: "#" },
          { label: "Navigation", href: "#" },
          { label: "Breadcrumb" },
        ]}
      />
    </div>
  ),
};

function BreadcrumbItemPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex">{children}</div>
  );
}

// ── In context · Page header (light + dark) ─────────────────────
export const InContext: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Header = () => (
      <div className="w-[460px] flex flex-col gap-opt-sm">
        <Breadcrumb>
          <BreadcrumbItem href="#">Projects</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#">Marketing</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>Hero section</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="text-opt-2xl font-opt-semibold text-opt-text-heading tracking-[-0.01em]">
          Hero section
        </h1>
        <span className="text-opt-md text-opt-text-secondary">
          Last edited 2h ago · 4 collaborators
        </span>
      </div>
    );
    return (
      <ThemePair
        sample={<Header />}
        caption="Standard page header: the breadcrumb sits just above the page title, with the current crumb echoing the title in the same words at a smaller size. Parent crumbs stay muted; the current crumb steps up to Ink."
      />
    );
  },
};
