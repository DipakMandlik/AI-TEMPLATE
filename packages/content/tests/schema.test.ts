import { describe, expect, it } from "vitest";
import { validateTemplateFrontmatter } from "../src/schema";

const VALID_FRONTMATTER = {
  title: "React Server Components Reviewer",
  description: "Reviews React 19 Server Component boundaries for correctness and data-flow bugs.",
  author: { name: "Jane Doe", github: "janedoe" },
  version: "1.0.0",
  compatibility: ["cursor", "claude-code"],
  tags: ["react", "server-components", "code-review"],
  difficulty: "intermediate",
  license: "MIT",
  useCases: ["Reviewing PRs that touch app/ router boundaries"],
  examples: [{ title: "Basic review", input: "Review this page.tsx", output: "Looks correct." }],
  changelog: [{ version: "1.0.0", date: "2026-01-01", changes: ["Initial release"] }],
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

describe("validateTemplateFrontmatter", () => {
  it("returns the parsed metadata for a fully valid fixture", () => {
    const result = validateTemplateFrontmatter(VALID_FRONTMATTER, "templates/ok.mdx");
    expect(result.title).toBe(VALID_FRONTMATTER.title);
    expect(result.compatibility).toEqual(["cursor", "claude-code"]);
  });

  it("throws, naming the offending context path, for a malformed fixture", () => {
    const malformed = { ...VALID_FRONTMATTER, version: "not-semver", useCases: [] };
    expect(() => validateTemplateFrontmatter(malformed, "templates/bad-template.mdx")).toThrow(
      /templates\/bad-template\.mdx/,
    );
  });

  it("throws when a required field is missing entirely", () => {
    const { description: _description, ...missingDescription } = VALID_FRONTMATTER;
    expect(() =>
      validateTemplateFrontmatter(missingDescription, "templates/bad-template.mdx"),
    ).toThrow();
  });
});
