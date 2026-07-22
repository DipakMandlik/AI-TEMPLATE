import { describe, expect, it } from "vitest";
import { MAX_COMPARE, toggleCompare } from "../compare";

describe("toggleCompare", () => {
  it("adds a path to an empty list", () => {
    expect(toggleCompare([], "a/b/c")).toEqual(["a/b/c"]);
  });

  it("removes a path already in the list", () => {
    expect(toggleCompare(["a/b/c"], "a/b/c")).toEqual([]);
  });

  it("keeps both selections in order when adding a second", () => {
    expect(toggleCompare(["a/b/c"], "d/e/f")).toEqual(["a/b/c", "d/e/f"]);
  });

  it(`refuses to add beyond MAX_COMPARE (${MAX_COMPARE})`, () => {
    const full = Array.from({ length: MAX_COMPARE }, (_, i) => `p${i}/c/s`);
    expect(toggleCompare(full, "one-too-many/c/s")).toEqual(full);
  });

  it("still allows removing one from a full list", () => {
    const full = Array.from({ length: MAX_COMPARE }, (_, i) => `p${i}/c/s`);
    expect(toggleCompare(full, full[0]!)).toEqual(full.slice(1));
  });
});
