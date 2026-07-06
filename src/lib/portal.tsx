import { createContext, useContext, type ReactNode } from "react";

/**
 * Portal target for overlay primitives (Select, Popover, Tooltip).
 *
 * By default Radix portals overlays to `document.body`. That's fine when the
 * theme tokens live on `:root`/`<html>`, but breaks when a consumer scopes the
 * theme to a wrapper element (e.g. the editor's `.inkwell-scope dark` shell):
 * a body-portaled menu escapes the scope and renders with the wrong tokens.
 *
 * Consumers that scope their theme can wrap their app in
 * `<PortalContainerProvider container={scopeEl}>` so overlays portal *inside*
 * the themed subtree. With no provider, `usePortalContainer()` returns
 * `undefined` and Radix falls back to `document.body` — unchanged behavior.
 */
const PortalContainerContext = createContext<HTMLElement | null>(null);

export function PortalContainerProvider({
  container,
  children,
}: {
  container: HTMLElement | null;
  children: ReactNode;
}) {
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  );
}

export function usePortalContainer(): HTMLElement | undefined {
  return useContext(PortalContainerContext) ?? undefined;
}
