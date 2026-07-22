"use client";

import { Button } from "@ai-template/ui";
import { Bookmark, X } from "lucide-react";
import * as React from "react";
import type { TemplateFilters } from "./filters";
import { deleteSavedFilter, loadSavedFilters, saveFilter, type SavedFilter } from "./saved-filters";

export function SavedFiltersPanel({
  current,
  onApply,
}: {
  current: TemplateFilters;
  onApply: (filters: TemplateFilters) => void;
}) {
  const [saved, setSaved] = React.useState<SavedFilter[]>([]);
  const [naming, setNaming] = React.useState(false);
  const [name, setName] = React.useState("");

  // Read from localStorage only after mount, so server and client markup
  // match — hydrating from a browser-only store, not deriving state that
  // could be computed during render.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setSaved(loadSavedFilters()), []);

  const hasActiveFilters =
    current.q !== "" ||
    current.provider.length > 0 ||
    current.category.length > 0 ||
    current.difficulty.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {saved.map((preset) => (
        <span
          key={preset.name}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-1 pl-3 pr-1 text-xs text-[var(--color-foreground)]"
        >
          <button type="button" onClick={() => onApply(preset.filters)} className="hover:underline">
            {preset.name}
          </button>
          <button
            type="button"
            aria-label={`Delete saved filter "${preset.name}"`}
            onClick={() => setSaved(deleteSavedFilter(preset.name))}
            className="rounded-full p-0.5 text-[var(--color-muted)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-foreground)]"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}

      {naming ? (
        <form
          className="flex items-center gap-1"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            setSaved(saveFilter(name, current));
            setName("");
            setNaming(false);
          }}
        >
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Filter name"
            className="h-8 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
          />
          <Button type="submit" size="sm">
            Save
          </Button>
        </form>
      ) : hasActiveFilters ? (
        <Button variant="ghost" size="sm" onClick={() => setNaming(true)}>
          <Bookmark />
          Save current filters
        </Button>
      ) : null}
    </div>
  );
}
