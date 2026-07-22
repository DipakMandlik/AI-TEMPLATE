import type { Template } from "@ai-template/content";
import { parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs";
import { searchTemplates } from "../search";

export const SORTS = ["updated", "created", "alphabetical"] as const;
export type Sort = (typeof SORTS)[number];

/** Shared between useQueryStates (client) and any future server-side parsing of the same URL shape. */
export const filterParsers = {
  q: parseAsString.withDefault(""),
  provider: parseAsArrayOf(parseAsString).withDefault([]),
  category: parseAsArrayOf(parseAsString).withDefault([]),
  difficulty: parseAsArrayOf(parseAsString).withDefault([]),
  sort: parseAsStringLiteral(SORTS).withDefault("updated"),
};

export interface TemplateFilters {
  q: string;
  provider: string[];
  category: string[];
  difficulty: string[];
  sort: Sort;
}

function sortTemplates(templates: Template[], sort: Sort): Template[] {
  const sorted = [...templates];
  switch (sort) {
    case "updated":
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case "created":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
}

/** Pure filter/sort pipeline — search, then facet intersection, then sort. Unit-testable without React. */
export function applyFilters(filters: TemplateFilters): Template[] {
  const searched = searchTemplates(filters.q);
  const filtered = searched.filter(
    (template) =>
      (filters.provider.length === 0 || filters.provider.includes(template.provider)) &&
      (filters.category.length === 0 || filters.category.includes(template.category)) &&
      (filters.difficulty.length === 0 || filters.difficulty.includes(template.difficulty)),
  );
  return sortTemplates(filtered, filters.sort);
}
