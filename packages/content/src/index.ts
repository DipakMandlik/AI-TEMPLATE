// Client-safe surface only: the static content data and its types. Node-only
// helpers (getTemplatesRoot, validateTemplateFrontmatter) are build-time
// concerns used internally (velite.config.ts, tests) — exporting them here
// would pull node:url/node:path into any client bundle that imports
// `templates`/`docs`, and break at runtime since browsers don't have them.
export { templates, docs } from "../.velite/index.js";
export type { Template, Doc } from "../.velite/index.js";
