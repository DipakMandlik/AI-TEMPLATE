import { templates } from "@ai-template/content";
import { describe, expect, it } from "vitest";
import { searchTemplates } from "..";

describe("searchTemplates", () => {
  it("returns every template for an empty query", () => {
    expect(searchTemplates("")).toEqual(templates);
    expect(searchTemplates("   ")).toEqual(templates);
  });

  it("matches templates by title", () => {
    const results = searchTemplates("React Server Components");
    expect(results.some((t) => t.slug === "react-server-components-reviewer")).toBe(true);
  });

  it("matches templates by tag", () => {
    const results = searchTemplates("playwright");
    expect(results.some((t) => t.slug === "playwright-e2e-test-generator")).toBe(true);
  });

  it("matches templates by provider", () => {
    const results = searchTemplates("windsurf");
    expect(results.some((t) => t.provider === "windsurf")).toBe(true);
  });

  it("returns no results for a nonsense query", () => {
    expect(searchTemplates("zzzznonexistentquery")).toEqual([]);
  });
});
