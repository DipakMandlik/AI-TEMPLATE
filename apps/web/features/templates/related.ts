import type { Template } from "@ai-template/content";

/** Other templates in the same category, most-recently-updated first. */
export function relatedTemplates(all: Template[], current: Template, limit = 3): Template[] {
  return all
    .filter((t) => t.category === current.category && t.slug !== current.slug)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}
