"use client";

import { Search } from "lucide-react";
import { useQueryStates } from "nuqs";
import * as React from "react";
import { searchTemplates } from "../search";
import { FacetSidebar, toggle } from "./facet-sidebar";
import { buildFacets } from "./facets";
import { applyFilters, filterParsers, SORTS, type Sort } from "./filters";
import { SavedFiltersPanel } from "./saved-filters-panel";
import { TemplateCard } from "./template-card";

const SORT_LABELS: Record<Sort, string> = {
  updated: "Recently updated",
  created: "Recently added",
  alphabetical: "Alphabetical",
};

/**
 * Owns the URL-synced filter state (nuqs) and composes search input, sort,
 * saved filters, the facet sidebar, and the result grid. Every filter
 * combination is reflected in the URL and restorable from it.
 */
export function TemplatesExplorer() {
  const [filters, setFilters] = useQueryStates(filterParsers);

  const searchScoped = React.useMemo(() => searchTemplates(filters.q), [filters.q]);
  const facets = React.useMemo(() => buildFacets(searchScoped), [searchScoped]);
  const results = React.useMemo(() => applyFilters(filters), [filters]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            value={filters.q}
            onChange={(event) => setFilters({ q: event.target.value })}
            placeholder="Search templates…"
            aria-label="Search templates"
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          Sort by
          <select
            value={filters.sort}
            onChange={(event) => setFilters({ sort: event.target.value as Sort })}
            className="h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
          >
            {SORTS.map((sort) => (
              <option key={sort} value={sort}>
                {SORT_LABELS[sort]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <SavedFiltersPanel current={filters} onApply={(preset) => setFilters(preset)} />

      <div className="flex flex-col gap-8 lg:flex-row">
        <FacetSidebar
          providers={facets.providers}
          categories={facets.categories}
          difficulties={facets.difficulties}
          selectedProviders={filters.provider}
          selectedCategories={filters.category}
          selectedDifficulties={filters.difficulty}
          onProviderToggle={(value) => setFilters({ provider: toggle(filters.provider, value) })}
          onCategoryToggle={(value) => setFilters({ category: toggle(filters.category, value) })}
          onDifficultyToggle={(value) =>
            setFilters({ difficulty: toggle(filters.difficulty, value) })
          }
          onClear={() => setFilters({ provider: [], category: [], difficulty: [] })}
        />
        <div className="flex-1">
          <p className="mb-4 text-sm text-[var(--color-muted)]">
            {results.length} template{results.length === 1 ? "" : "s"}
          </p>
          {results.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((template) => (
                <TemplateCard
                  key={`${template.provider}/${template.category}/${template.slug}`}
                  template={template}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8 text-center text-[var(--color-muted)]">
              No templates match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
