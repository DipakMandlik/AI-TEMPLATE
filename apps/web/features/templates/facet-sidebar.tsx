"use client";

import { PROVIDER_LABELS, type Provider } from "@ai-template/validation";
import type { FacetCount } from "./facets";

function toggle(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

function FacetGroup({
  title,
  facets,
  selected,
  onToggle,
  labelFor,
}: {
  title: string;
  facets: FacetCount[];
  selected: string[];
  onToggle: (value: string) => void;
  labelFor?: (value: string) => string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {title}
      </legend>
      <ul className="flex flex-col gap-1">
        {facets.map((facet) => (
          <li key={facet.value}>
            <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-[var(--color-foreground)]">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="size-4 rounded border-[var(--color-border)] accent-[var(--color-brand-600)]"
                  checked={selected.includes(facet.value)}
                  onChange={() => onToggle(facet.value)}
                />
                <span className="capitalize">{labelFor ? labelFor(facet.value) : facet.value}</span>
              </span>
              <span className="text-[var(--color-muted)]">{facet.count}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export interface FacetSidebarProps {
  providers: FacetCount[];
  categories: FacetCount[];
  difficulties: FacetCount[];
  selectedProviders: string[];
  selectedCategories: string[];
  selectedDifficulties: string[];
  onProviderToggle: (value: string) => void;
  onCategoryToggle: (value: string) => void;
  onDifficultyToggle: (value: string) => void;
  onClear: () => void;
}

/** Interactive, multi-select facet sidebar — instant client-side filtering, no network round-trip. */
export function FacetSidebar({
  providers,
  categories,
  difficulties,
  selectedProviders,
  selectedCategories,
  selectedDifficulties,
  onProviderToggle,
  onCategoryToggle,
  onDifficultyToggle,
  onClear,
}: FacetSidebarProps) {
  const hasActiveFilters =
    selectedProviders.length > 0 ||
    selectedCategories.length > 0 ||
    selectedDifficulties.length > 0;

  return (
    <aside className="flex w-full flex-col gap-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft-sm)] lg:w-64 lg:shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-foreground)]">Filters</span>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-[var(--color-brand-600)] hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>
      <FacetGroup
        title="Providers"
        facets={providers}
        selected={selectedProviders}
        onToggle={onProviderToggle}
        labelFor={(value) => PROVIDER_LABELS[value as Provider] ?? value}
      />
      <FacetGroup
        title="Categories"
        facets={categories}
        selected={selectedCategories}
        onToggle={onCategoryToggle}
      />
      <FacetGroup
        title="Difficulty"
        facets={difficulties}
        selected={selectedDifficulties}
        onToggle={onDifficultyToggle}
      />
    </aside>
  );
}

export { toggle };
