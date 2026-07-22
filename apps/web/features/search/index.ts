import { templates } from "@ai-template/content";
import { Document } from "flexsearch";

interface SearchDoc {
  [key: string]: string | number;
  id: number;
  title: string;
  description: string;
  tags: string;
  category: string;
  provider: string;
}

/**
 * Built once, at module scope, from the static `templates` array bundled at
 * build time — not per-keystroke, not over the network (architecture.md §5,
 * ADR-0004).
 */
function buildIndex(): Document<SearchDoc> {
  const index = new Document<SearchDoc>({
    document: {
      id: "id",
      index: ["title", "description", "tags", "category", "provider"],
    },
    tokenize: "forward",
  });
  templates.forEach((template, id) => {
    index.add({
      id,
      title: template.title,
      description: template.description,
      tags: template.tags.join(" "),
      category: template.category,
      provider: template.provider,
    });
  });
  return index;
}

let index: Document<SearchDoc> | undefined;

/** Templates matching `query`, ranked by FlexSearch relevance. Empty query returns all templates. */
export function searchTemplates(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return templates;

  index ??= buildIndex();
  const results = index.search(trimmed, { enrich: true, merge: true, limit: templates.length });
  return results
    .map((result) => templates[result.id as number])
    .filter((template) => template !== undefined);
}
