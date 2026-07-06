import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePair } from "./_in-context";
import {
  CheckCircle,
  FileText,
  FilePlus,
  Lock,
  MessageCircle,
  Search,
  XCircle,
} from "lucide-react";
import { Button } from "./button";
import { EmptyState } from "./empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "Molecules/Empty State",
  component: EmptyState,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The \"nothing here yet\" placeholder. Icon, title, description, optional actions — centered in the container it fills. Match the action to the cause: create / clear / request / retry.",
      },
    },
  },
  argTypes: {
    size:   { control: "radio",  options: ["compact", "default", "large"] },
    intent: { control: "select", options: ["neutral", "info", "permission", "error"] },
  },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

// ── Playgrounds ──────────────────────────────────────────────────
export const Default: Story = {
  args: {
    icon: <FilePlus size={16} strokeWidth={1.75} />,
    title: "No canvases yet",
    description: "Create your first canvas to start designing. You can import an existing file or start blank.",
    actions: <Button>New canvas</Button>,
  },
  render: (args) => (
    <div className="w-[360px] h-[280px] flex items-center justify-center bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md">
      <EmptyState {...args} />
    </div>
  ),
};

// ── Three densities ─────────────────────────────────────────────
export const Densities: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-3 gap-opt-md p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-5xl">
      <div className="flex flex-col items-stretch gap-opt-sm">
        <div className="h-[260px] flex items-center justify-center bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md">
          <EmptyState
            size="compact"
            icon={<Search size={14} strokeWidth={1.75} />}
            title="No matches"
            description="Try a different search term."
          />
        </div>
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary text-center">Compact · list void</span>
      </div>
      <div className="flex flex-col items-stretch gap-opt-sm">
        <div className="h-[260px] flex items-center justify-center bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md">
          <EmptyState
            icon={<FileText size={16} strokeWidth={1.75} />}
            title="No canvases yet"
            description="Create your first canvas to start designing. You can import an existing file or start blank."
            actions={<Button>New canvas</Button>}
          />
        </div>
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary text-center">Default · tab panel</span>
      </div>
      <div className="flex flex-col items-stretch gap-opt-sm">
        <div className="h-[260px] flex items-center justify-center bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md">
          <EmptyState
            size="large"
            intent="info"
            icon={<CheckCircle size={20} strokeWidth={1.75} />}
            title="You're all caught up"
            description="No new comments, mentions, or activity since your last visit. Get back to designing, or check older notifications."
            actions={
              <>
                <Button variant="secondary">View archive</Button>
                <Button>Back to canvas</Button>
              </>
            }
          />
        </div>
        <span className="font-opt-mono text-[10px] uppercase tracking-[0.16em] text-opt-text-secondary text-center">Large · first-run</span>
      </div>
    </div>
  ),
};

// ── Four reasons to be empty ────────────────────────────────────
export const UseCases: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-2 gap-opt-md p-opt-xl bg-opt-surface-low rounded-opt-xl max-w-5xl">
      <Wrap>
        <EmptyState
          eyebrow="First run · invite action"
          icon={<FilePlus size={16} strokeWidth={1.75} />}
          title="No canvases yet"
          description="Create your first canvas to start designing."
          actions={<Button>New canvas</Button>}
        />
      </Wrap>
      <Wrap>
        <EmptyState
          eyebrow="No results · clear filters"
          icon={<Search size={16} strokeWidth={1.75} />}
          title='No canvases match "moodboard"'
          description="Try a different search term or clear your filters."
          actions={<Button variant="secondary">Clear filters</Button>}
        />
      </Wrap>
      <Wrap>
        <EmptyState
          eyebrow="Permission · request access"
          intent="permission"
          icon={<Lock size={16} strokeWidth={1.75} />}
          title="Access required"
          description="You don't have access to this canvas. Request it from the owner."
          actions={<Button>Request access</Button>}
        />
      </Wrap>
      <Wrap>
        <EmptyState
          eyebrow="Error · retry"
          intent="error"
          icon={<XCircle size={16} strokeWidth={1.75} />}
          title="Couldn't load canvases"
          description="Check your connection and try again. If this keeps happening, contact support."
          actions={
            <>
              <Button variant="secondary">Contact support</Button>
              <Button>Retry</Button>
            </>
          }
        />
      </Wrap>
    </div>
  ),
};

// ── Sidebar panel · narrow ──────────────────────────────────────
export const SidebarPanel: Story = {
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => {
    const Sample = () => (
      <div className="w-[280px] h-[360px] bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md p-opt-md">
        <h4 className="text-opt-md font-opt-medium text-opt-text-heading mb-opt-md">
          <MessageCircle size={14} strokeWidth={1.75} className="inline mr-opt-xs -mt-[2px]" aria-hidden="true" />
          Comments
        </h4>
        <EmptyState
          icon={<MessageCircle size={16} strokeWidth={1.75} />}
          title="No comments yet"
          description="Pin a comment to any layer to start a thread. Collaborators can reply directly."
        />
      </div>
    );
    return (
      <ThemePair
        sample={<Sample />}
        caption="Empty state inside a narrow sidebar panel — muted icon, title, and one line of guidance. The icon tint and text recede with the theme so the empty panel never shouts."
      />
    );
  },
};

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-opt-surface-raised border border-opt-border-subtle rounded-opt-md flex items-center justify-center min-h-[260px] p-opt-md">
      {children}
    </div>
  );
}
