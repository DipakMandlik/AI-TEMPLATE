"use client";

import dynamic from "next/dynamic";
import * as React from "react";

const CommandPaletteContent = dynamic(
  () => import("./command-palette-content").then((mod) => mod.CommandPaletteContent),
  { ssr: false },
);

/**
 * Always-rendered trigger button + global ⌘K listener. The actual palette
 * (cmdk, FlexSearch) is dynamically imported and only ever mounted after
 * the user opens it once — see command-palette-content.tsx.
 */
export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
        setHasOpenedOnce(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setHasOpenedOnce(true);
        }}
        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-muted)] shadow-[var(--shadow-soft-sm)] transition-colors hover:bg-[var(--color-brand-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
      >
        <span>Search…</span>
        <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-background)] px-1.5 py-0.5 text-xs">
          ⌘K
        </kbd>
      </button>
      {hasOpenedOnce ? <CommandPaletteContent open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
