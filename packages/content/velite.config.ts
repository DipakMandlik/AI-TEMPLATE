import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, s } from "velite";
import { parseTemplatePathSegments } from "./src/paths.js";
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
      // with the collection's own "templates/" pattern segment — the leading
      // element of the split is that "templates" segment itself, discarded.
      const [, ...pathSegments] = data.templatePath.split("/");
      const contextPath = `${data.templatePath}.mdx`;
      const { provider, category, slug } = parseTemplatePathSegments(pathSegments, contextPath);
      // Re-validates every frontmatter field against packages/validation's
      // templateMetaSchema — the single, shared source of truth for what a
      // valid template looks like (see docs/adr/0002-content-pipeline.md).
      const meta = validateTemplateFrontmatter(data, contextPath);
      return { ...meta, slug, provider, category, code: data.code, raw: data.raw };
    }),
});

const docs = defineCollection({
  name: "Doc",
  pattern: "docs/**/*.mdx",
  schema: s
    .object({
      docPath: s.path(),
      code: s.mdx(),
      title: s.string(),
      description: s.string(),
      // Nav order within the docs sidebar; lower sorts first.
      order: s.number().default(0),
    })
    .transform((data) => {
      const [, slug] = data.docPath.split("/");
      if (!slug) {
        throw new Error(`${data.docPath}.mdx must live directly under docs/{slug}.mdx`);
      }
      return {
        slug,
        title: data.title,
        description: data.description,
        order: data.order,
        code: data.code,
      };
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
  collections: { templates, docs },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "github-light-high-contrast" }],
      rehypeAutolinkHeadings,
    ],
  },
});
