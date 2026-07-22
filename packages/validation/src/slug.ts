import { z } from "zod";

/**
 * A URL-safe, kebab-case identifier — used by template slugs, category
 * slugs, and provider ids. Shared here so the rule can't drift between
 * the content schema (Phase 5) and any future form/API validation.
 */
export const slugSchema = z
  .string()
  .min(2, "must be at least 2 characters")
  .max(80, "must be at most 80 characters")
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "must be lowercase kebab-case (e.g. react-server-components)");

export type Slug = z.infer<typeof slugSchema>;
