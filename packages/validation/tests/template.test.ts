import { describe, expect, it } from "vitest";
import { templateMetaSchema } from "../src/template";

const VALID_META = {
  title: "React Server Components Reviewer",
  description: "Reviews React 19 Server Component boundaries for correctness and data-flow bugs.",
  author: { name: "Jane Doe", github: "janedoe" },
  version: "1.0.0",
  compatibility: ["cursor", "claude-code"],
  tags: ["react", "server-components", "code-review"],
  difficulty: "intermediate",
  license: "MIT",
  useCases: ["Reviewing PRs that touch app/ router boundaries"],
  bestPractices: ["Keep Server/Client boundaries explicit with 'use client'"],
  limitations: ["Does not evaluate runtime performance"],
  examples: [{ title: "Basic review", input: "Review this page.tsx", output: "Looks correct." }],
  changelog: [{ version: "1.0.0", date: "2026-01-01", changes: ["Initial release"] }],
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

describe("templateMetaSchema", () => {
  it("accepts a fully valid template", () => {
    const result = templateMetaSchema.safeParse(VALID_META);
    expect(result.success).toBe(true);
  });

  it("accepts optional fields being omitted", () => {
    const { bestPractices, limitations, ...rest } = VALID_META;
    void bestPractices;
    void limitations;
    expect(templateMetaSchema.safeParse(rest).success).toBe(true);
  });

  it.each([
    ["missing title", { ...VALID_META, title: undefined }],
    ["short title", { ...VALID_META, title: "Hi" }],
    ["short description", { ...VALID_META, description: "Too short." }],
    ["invalid version", { ...VALID_META, version: "v1" }],
    ["empty compatibility", { ...VALID_META, compatibility: [] }],
    ["unknown provider", { ...VALID_META, compatibility: ["not-a-real-tool"] }],
    ["empty tags", { ...VALID_META, tags: [] }],
    ["too many tags", { ...VALID_META, tags: Array.from({ length: 13 }, (_, i) => `tag-${i}`) }],
    ["invalid difficulty", { ...VALID_META, difficulty: "expert" }],
    ["empty use cases", { ...VALID_META, useCases: [] }],
    ["empty examples", { ...VALID_META, examples: [] }],
    ["empty changelog", { ...VALID_META, changelog: [] }],
    [
      "bad changelog version",
      { ...VALID_META, changelog: [{ version: "1.0", date: "2026-01-01", changes: ["x"] }] },
    ],
    ["bad date format", { ...VALID_META, createdAt: "01/01/2026" }],
  ])("rejects %s", (_name, value) => {
    expect(templateMetaSchema.safeParse(value).success).toBe(false);
  });
});
