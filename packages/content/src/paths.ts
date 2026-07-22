import { fileURLToPath } from "node:url";
import path from "node:path";

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
