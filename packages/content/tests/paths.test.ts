import path from "node:path";
import { describe, expect, it } from "vitest";
import { getTemplatesRoot, parseTemplatePathSegments } from "../src/paths";

describe("getTemplatesRoot", () => {
  it("resolves to <repo-root>/content/templates", () => {
    const root = getTemplatesRoot();
    expect(path.isAbsolute(root)).toBe(true);
    expect(root.endsWith(path.join("content", "templates"))).toBe(true);
  });
});

describe("parseTemplatePathSegments", () => {
  it("parses a valid provider/category/slug path", () => {
    expect(parseTemplatePathSegments(["cursor", "backend", "sql-reviewer"], "context")).toEqual({
      provider: "cursor",
      category: "backend",
      slug: "sql-reviewer",
    });
  });

  it.each([
    ["missing everything", []],
    ["missing category and slug", ["cursor"]],
    ["missing slug", ["cursor", "backend"]],
    ["extra segment beyond slug", ["cursor", "backend", "slug", "extra"]],
  ])("rejects a malformed path (%s)", (_name, segments) => {
    expect(() => parseTemplatePathSegments(segments, "templates/bad.mdx")).toThrowError(
      /must live at templates\/\{provider\}\/\{category\}\/\{slug\}\.mdx/,
    );
  });

  it("rejects an unknown provider directory", () => {
    expect(() =>
      parseTemplatePathSegments(["not-a-real-tool", "backend", "slug"], "templates/bad.mdx"),
    ).toThrowError(/"not-a-real-tool" is not a known provider directory/);
  });
});
