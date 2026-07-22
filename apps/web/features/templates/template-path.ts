import type { Template } from "@ai-template/content";

/**
 * A template's slug is only unique within its provider/category directory
 * (see content/docs/writing-a-template.mdx), so anything that needs to
 * identify one template globally — routing, the compare feature — uses this
 * triple instead of the bare slug.
 */
export function templatePath(template: Pick<Template, "provider" | "category" | "slug">): string {
  return `${template.provider}/${template.category}/${template.slug}`;
}

export function templateHref(template: Pick<Template, "provider" | "category" | "slug">): string {
  return `/templates/${templatePath(template)}`;
}
