import { parseOrThrow, templateMetaSchema, type TemplateMeta } from "@ai-template/validation";

/**
 * Re-validates a template's frontmatter against the shared Zod schema. Used
 * both by the Velite transform (build-time) and by scripts/validate-content.ts
 * (standalone, CI-fast) so there is exactly one set of rules for what a valid
 * template looks like — not one for Velite and a looser one for everything else.
 */
export function validateTemplateFrontmatter(data: unknown, context: string): TemplateMeta {
  return parseOrThrow(templateMetaSchema, data, context);
}
