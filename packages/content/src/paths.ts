import { fileURLToPath } from "node:url";
import path from "node:path";
import { PROVIDERS } from "@ai-template/validation";

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * Absolute path to `content/templates` at the repo root, regardless of
 * which package or app imports this. The Velite config (Phase 5) and the
 * standalone content validator both resolve templates from here so there
 * is exactly one definition of "where templates live."
 */
export function getTemplatesRoot(): string {
  return path.resolve(packageRoot, "../../../content/templates");
}

export interface ParsedTemplatePath {
  provider: string;
  category: string;
  slug: string;
}

/**
 * Validates a template's `{provider}/{category}/{slug}` path segments —
 * every segment present, and the provider a known one. Shared by the Velite
 * transform (build-time) and scripts/validate-content.ts (standalone) so
 * there is exactly one definition of a valid template path, and exactly one
 * place that needs a fixture test for what an invalid one looks like.
 */
export function parseTemplatePathSegments(
  segments: ReadonlyArray<string | undefined>,
  contextPath: string,
): ParsedTemplatePath {
  const [provider, category, slug, ...rest] = segments;
  if (!provider || !category || !slug || rest.length > 0) {
    throw new Error(`${contextPath} must live at templates/{provider}/{category}/{slug}.mdx`);
  }
  if (!(PROVIDERS as readonly string[]).includes(provider)) {
    throw new Error(
      `${contextPath}: "${provider}" is not a known provider directory (${PROVIDERS.join(", ")})`,
    );
  }
  return { provider, category, slug };
}
