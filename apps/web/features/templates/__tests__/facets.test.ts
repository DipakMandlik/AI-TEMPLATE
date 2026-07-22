import { describe, expect, it } from "vitest";
import { buildFacets } from "../facets";

function fixture(overrides: Partial<{ provider: string; category: string; difficulty: string }>) {
  return {
    provider: "cursor",
    category: "frontend",
    difficulty: "beginner",
    ...overrides,
  } as never;
}

describe("buildFacets", () => {
  it("counts templates by provider, category, and difficulty", () => {
    const templates = [
      fixture({ provider: "cursor", category: "frontend" }),
      fixture({ provider: "cursor", category: "backend" }),
      fixture({ provider: "claude-code", category: "frontend", difficulty: "advanced" }),
    ];

    const facets = buildFacets(templates);

    expect(facets.providers).toEqual([
      { value: "cursor", count: 2 },
      { value: "claude-code", count: 1 },
    ]);
    expect(facets.categories).toEqual([
      { value: "frontend", count: 2 },
      { value: "backend", count: 1 },
    ]);
    expect(facets.difficulties).toEqual([
      { value: "beginner", count: 2 },
      { value: "advanced", count: 1 },
    ]);
  });

  it("returns empty facets for an empty template list", () => {
    expect(buildFacets([])).toEqual({ providers: [], categories: [], difficulties: [] });
  });
});
