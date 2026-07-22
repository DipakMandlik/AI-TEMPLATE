import { describe, expect, it } from "vitest";
import { templateHref, templatePath } from "../template-path";

const TEMPLATE = {
  provider: "cursor",
  category: "backend",
  slug: "sql-query-performance-reviewer",
};

describe("templatePath", () => {
  it("joins provider/category/slug", () => {
    expect(templatePath(TEMPLATE)).toBe("cursor/backend/sql-query-performance-reviewer");
  });
});

describe("templateHref", () => {
  it("prefixes the path with /templates/", () => {
    expect(templateHref(TEMPLATE)).toBe("/templates/cursor/backend/sql-query-performance-reviewer");
  });
});
