import { describe, expect, it } from "vitest";
import { applyFilters, type TemplateFilters } from "../filters";

const BASE: TemplateFilters = {
  q: "",
  provider: [],
  category: [],
  difficulty: [],
  sort: "updated",
};

describe("applyFilters", () => {
  it("returns everything with no filters applied", () => {
    expect(applyFilters(BASE).length).toBeGreaterThan(0);
  });

  it("filters by provider", () => {
    const results = applyFilters({ ...BASE, provider: ["windsurf"] });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((t) => t.provider === "windsurf")).toBe(true);
  });

  it("filters by multiple providers (OR within a facet)", () => {
    const results = applyFilters({ ...BASE, provider: ["windsurf", "gemini"] });
    expect(results.every((t) => ["windsurf", "gemini"].includes(t.provider))).toBe(true);
    expect(results.some((t) => t.provider === "windsurf")).toBe(true);
    expect(results.some((t) => t.provider === "gemini")).toBe(true);
  });

  it("intersects facets across categories (AND across facets)", () => {
    const results = applyFilters({ ...BASE, provider: ["cursor"], category: ["backend"] });
    expect(results.every((t) => t.provider === "cursor" && t.category === "backend")).toBe(true);
  });

  it("combines search with facet filters", () => {
    const results = applyFilters({ ...BASE, q: "test", provider: ["gemini"] });
    expect(results.every((t) => t.provider === "gemini")).toBe(true);
  });

  it("sorts alphabetically by title", () => {
    const results = applyFilters({ ...BASE, sort: "alphabetical" });
    const titles = results.map((t) => t.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  });

  it("returns an empty array when no template matches every filter", () => {
    expect(applyFilters({ ...BASE, provider: ["windsurf"], category: ["security"] })).toEqual([]);
  });
});
