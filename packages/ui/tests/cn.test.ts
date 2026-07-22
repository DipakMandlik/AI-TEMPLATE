import { describe, expect, it } from "vitest";
import { cn } from "../src/cn";

describe("cn", () => {
  it("joins truthy class values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("resolves conflicting Tailwind utilities, keeping the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("merges conditional variant objects", () => {
    expect(cn("base", { "text-brand-600": true, "text-muted": false })).toBe("base text-brand-600");
  });
});
