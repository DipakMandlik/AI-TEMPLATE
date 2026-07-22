import path from "node:path";
import { describe, expect, it } from "vitest";
import { getTemplatesRoot } from "../src/paths";

describe("getTemplatesRoot", () => {
  it("resolves to <repo-root>/content/templates", () => {
    const root = getTemplatesRoot();
    expect(path.isAbsolute(root)).toBe(true);
    expect(root.endsWith(path.join("content", "templates"))).toBe(true);
  });
});
