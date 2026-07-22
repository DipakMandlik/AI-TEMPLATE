import type { z } from "zod";

/**
 * Parse `data` against `schema`, throwing an error whose message lists
 * every issue with its path — used by the content pipeline (Phase 5) so a
 * malformed template fails the build with an actionable message instead
 * of a bare Zod stack trace.
 */
export function parseOrThrow<Schema extends z.ZodTypeAny>(
  schema: Schema,
  data: unknown,
  context: string,
): z.infer<Schema> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid ${context}:\n${issues}`);
  }
  return result.data;
}
