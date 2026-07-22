import { PROVIDER_LABELS, type Provider } from "@ai-template/validation";
import type { FacetCount } from "./facets";

function FacetGroup({
  title,
  facets,
  labelFor,
}: {
  title: string;
  facets: FacetCount[];
  labelFor?: (value: string) => string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {title}
      </h3>
      <ul className="flex flex-col gap-1">
        {facets.map((facet) => (
          <li
            key={facet.value}
            className="flex items-center justify-between text-sm text-[var(--color-foreground)]"
          >
            <span className="capitalize">{labelFor ? labelFor(facet.value) : facet.value}</span>
            <span className="text-[var(--color-muted)]">{facet.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Static facet summary derived from content. Read-only for now — interactive
 * multi-select filtering with URL sync lands in Phase 6.
 */
export function FacetSidebar({
  providers,
  categories,
  difficulties,
}: {
  providers: FacetCount[];
  categories: FacetCount[];
  difficulties: FacetCount[];
}) {
  return (
    <aside className="flex w-full flex-col gap-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft-sm)] lg:w-64 lg:shrink-0">
      <FacetGroup
        title="Providers"
        facets={providers}
        labelFor={(value) => PROVIDER_LABELS[value as Provider] ?? value}
      />
      <FacetGroup title="Categories" facets={categories} />
      <FacetGroup title="Difficulty" facets={difficulties} />
    </aside>
  );
}
