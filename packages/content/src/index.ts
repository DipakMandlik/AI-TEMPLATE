// Client-safe surface only: the static template data and its type. Node-only
// helpers (getTemplatesRoot, validateTemplateFrontmatter) are build-time
// concerns used internally (velite.config.ts, tests) — exporting them here
// would pull node:url/node:path into any client bundle that imports
// `templates`, and break at runtime since browsers don't have them.
export { templates } from "../.velite/index.js";
export type { Template } from "../.velite/index.js";
