import { templates } from "@ai-template/content";
import type { Metadata } from "next";
import { FacetSidebar } from "../../features/templates/facet-sidebar";
import { buildFacets } from "../../features/templates/facets";
import { TemplateCard } from "../../features/templates/template-card";

export const metadata: Metadata = {
  title: "Templates",
  description: "Browse production-ready AI prompt and agent templates across every major tool.",
};

export default function TemplatesPage() {
  const facets = buildFacets(templates);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Templates
        </h1>
        <p className="text-[var(--color-muted)]">
          {templates.length} production-ready templates across {facets.providers.length} providers
          and {facets.categories.length} categories.
        </p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <FacetSidebar
          providers={facets.providers}
          categories={facets.categories}
          difficulties={facets.difficulties}
        />
        <div className="grid flex-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={`${template.provider}/${template.category}/${template.slug}`}
              template={template}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
