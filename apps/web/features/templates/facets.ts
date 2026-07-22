import type { Template } from "@ai-template/content";

export interface FacetCount {
  value: string;
  count: number;
}

function countBy(templates: Template[], getValue: (t: Template) => string): FacetCount[] {
  const counts = new Map<string, number>();
  for (const template of templates) {
    const value = getValue(template);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts, ([value, count]) => ({ value, count })).sort(
    (a, b) => b.count - a.count || a.value.localeCompare(b.value),
  );
}

/** Category/provider/difficulty facets derived from content, not hand-maintained lists. */
export function buildFacets(templates: Template[]) {
  return {
    providers: countBy(templates, (t) => t.provider),
    categories: countBy(templates, (t) => t.category),
    difficulties: countBy(templates, (t) => t.difficulty),
  };
}
