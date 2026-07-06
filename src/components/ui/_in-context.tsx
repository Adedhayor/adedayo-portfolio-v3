import type { ReactNode } from "react";

/**
 * Shared helper for the component "In Context" stories.
 *
 * Renders one sample twice — Light (`:root`) and Dark (`.dark`) side by side —
 * mirroring the Paper exploration layouts. The dark card scopes `.dark`, so
 * every `--opt-*` semantic token in its subtree resolves to its dark value with
 * no theme toggle. The `w-[920px]` container intentionally overflows any narrow
 * per-component story decorator (e.g. Slider's 320px wrapper), matching how the
 * other composite stories break out.
 *
 * Not a `*.stories.*` file, so Storybook never picks it up as a story.
 */
export function ThemePair({
  sample,
  caption,
}: {
  sample: ReactNode;
  caption: string;
}) {
  return (
    <div className="flex flex-col gap-opt-lg w-[920px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-opt-xl">
        <div className="flex flex-col gap-opt-sm">
          <span className="font-opt-mono text-[10px] font-opt-medium uppercase tracking-[0.14em] text-opt-text-placeholder">
            Light · :root
          </span>
          <div className="rounded-opt-xl bg-opt-surface-base border border-opt-border-subtle p-opt-xl flex justify-center">
            {sample}
          </div>
        </div>
        <div className="flex flex-col gap-opt-sm">
          <span className="font-opt-mono text-[10px] font-opt-medium uppercase tracking-[0.14em] text-opt-text-placeholder">
            Dark · .dark
          </span>
          <div className="dark rounded-opt-xl bg-opt-surface-base border border-opt-border-subtle p-opt-xl flex justify-center">
            {sample}
          </div>
        </div>
      </div>
      <p className="text-opt-md text-opt-text-secondary max-w-3xl">{caption}</p>
    </div>
  );
}
