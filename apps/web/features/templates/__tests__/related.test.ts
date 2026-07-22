import { describe, expect, it } from "vitest";
import { relatedTemplates } from "../related";

function fixture(slug: string, category: string, updatedAt: string) {
  return { slug, category, updatedAt } as never;
}

describe("relatedTemplates", () => {
  it("returns other templates in the same category, most recently updated first", () => {
    const current = fixture("current", "frontend", "2026-01-01");
    const all = [
      current,
      fixture("older", "frontend", "2025-01-01"),
      fixture("newer", "frontend", "2026-06-01"),
      fixture("other-category", "backend", "2026-12-01"),
    ];

    expect(relatedTemplates(all, current).map((t) => t.slug)).toEqual(["newer", "older"]);
  });

  it("respects the limit", () => {
    const current = fixture("current", "frontend", "2026-01-01");
    const all = [
      current,
      fixture("a", "frontend", "2026-01-02"),
      fixture("b", "frontend", "2026-01-03"),
      fixture("c", "frontend", "2026-01-04"),
    ];

    expect(relatedTemplates(all, current, 2)).toHaveLength(2);
  });

  it("returns an empty array when no other template shares the category", () => {
    const current = fixture("current", "security", "2026-01-01");
    expect(relatedTemplates([current], current)).toEqual([]);
  });
});
