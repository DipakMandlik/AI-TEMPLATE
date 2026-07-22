import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, s } from "velite";
import { PROVIDERS } from "@ai-template/validation";
import { validateTemplateFrontmatter } from "./src/schema.js";

const templates = defineCollection({
  name: "Template",
  pattern: "templates/**/*.mdx",
  schema: s
    .object({
      // Velite-computed fields — derived from the file itself, not frontmatter.
      templatePath: s.path(),
      code: s.mdx(),
      raw: s.raw(),
      // Frontmatter, validated for real against the shared Zod schema below.
      title: s.string(),
      description: s.string(),
      author: s.object({
        name: s.string(),
        url: s.string().optional(),
        github: s.string().optional(),
      }),
      version: s.string(),
      compatibility: s.array(s.string()),
      tags: s.array(s.string()),
      difficulty: s.string(),
      license: s.string(),
      useCases: s.array(s.string()),
      bestPractices: s.array(s.string()).optional(),
      limitations: s.array(s.string()).optional(),
      examples: s.array(s.object({ title: s.string(), input: s.string(), output: s.string() })),
      changelog: s.array(
        s.object({ version: s.string(), date: s.string(), changes: s.array(s.string()) }),
      ),
      createdAt: s.string(),
      updatedAt: s.string(),
    })
    .transform((data) => {
      // `templatePath` is relative to the content root, so it's prefixed
      // with the collection's own "templates/" pattern segment.
      const [, provider, category, slug] = data.templatePath.split("/");
      const contextPath = `${data.templatePath}.mdx`;
      if (!provider || !category || !slug) {
        throw new Error(`${contextPath} must live at templates/{provider}/{category}/{slug}.mdx`);
      }
      if (!(PROVIDERS as readonly string[]).includes(provider)) {
        throw new Error(
          `${contextPath}: "${provider}" is not a known provider directory (${PROVIDERS.join(", ")})`,
        );
      }
      // Re-validates every frontmatter field against packages/validation's
      // templateMetaSchema — the single, shared source of truth for what a
      // valid template looks like (see docs/adr/0002-content-pipeline.md).
      const meta = validateTemplateFrontmatter(data, contextPath);
      return { ...meta, slug, provider, category, code: data.code, raw: data.raw };
    }),
});

export default defineConfig({
  root: "../../content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },
  collections: { templates },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "github-light" }],
      rehypeAutolinkHeadings,
    ],
  },
});
