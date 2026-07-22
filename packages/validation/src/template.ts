import { z } from "zod";
import { providerSchema } from "./provider.js";

const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export const difficultySchema = z.enum(DIFFICULTIES);
export type Difficulty = z.infer<typeof difficultySchema>;

export const templateAuthorSchema = z.object({
  name: z.string().min(1, "author name is required"),
  url: z.string().url().optional(),
  github: z.string().min(1).optional(),
});

export const templateExampleSchema = z.object({
  title: z.string().min(3).max(120),
  input: z.string().min(1, "example input cannot be empty"),
  output: z.string().min(1, "example output cannot be empty"),
});

export const templateChangelogEntrySchema = z.object({
  version: z.string().regex(SEMVER_PATTERN, "changelog version must be semver (e.g. 1.0.0)"),
  date: z.string().regex(DATE_PATTERN, "changelog date must be YYYY-MM-DD"),
  changes: z.array(z.string().min(1)).min(1, "changelog entry needs at least one change"),
});

/**
 * Validated shape of a template's YAML frontmatter. `slug`, `provider`, and
 * `category` are NOT part of this schema — they're derived from the file's
 * own path (`content/templates/{provider}/{category}/{slug}.mdx`) by the
 * Velite config, so there is exactly one source of truth for them.
 */
export const templateMetaSchema = z.object({
  title: z.string().min(3, "title must be at least 3 characters").max(80),
  description: z.string().min(20, "description must be at least 20 characters").max(240),
  author: templateAuthorSchema,
  version: z.string().regex(SEMVER_PATTERN, "version must be semver (e.g. 1.0.0)"),
  compatibility: z.array(providerSchema).min(1, "must declare at least one compatible provider"),
  tags: z.array(z.string().min(1)).min(1, "must have at least one tag").max(12),
  difficulty: difficultySchema,
  license: z.string().min(1, "license (SPDX identifier) is required"),
  useCases: z.array(z.string().min(1)).min(1, "must list at least one use case"),
  bestPractices: z.array(z.string().min(1)).optional(),
  limitations: z.array(z.string().min(1)).optional(),
  examples: z.array(templateExampleSchema).min(1, "must include at least one example"),
  changelog: z
    .array(templateChangelogEntrySchema)
    .min(1, "must include at least one changelog entry"),
  createdAt: z.string().regex(DATE_PATTERN, "createdAt must be YYYY-MM-DD"),
  updatedAt: z.string().regex(DATE_PATTERN, "updatedAt must be YYYY-MM-DD"),
});

export type TemplateMeta = z.infer<typeof templateMetaSchema>;
export type TemplateAuthor = z.infer<typeof templateAuthorSchema>;
export type TemplateExample = z.infer<typeof templateExampleSchema>;
export type TemplateChangelogEntry = z.infer<typeof templateChangelogEntrySchema>;
