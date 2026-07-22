import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseOrThrow } from "../src/parse";

describe("parseOrThrow", () => {
  const schema = z.object({ title: z.string().min(1) });

  it("returns parsed data on success", () => {
    expect(parseOrThrow(schema, { title: "Hello" }, "fixture")).toEqual({ title: "Hello" });
  });

  it("throws a readable error listing every issue on failure", () => {
    expect(() => parseOrThrow(schema, { title: "" }, "fixture")).toThrow(/Invalid fixture/);
  });
});
