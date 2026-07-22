import { templates } from "@ai-template/content";
import { Skeleton } from "@ai-template/ui";
import type { Metadata } from "next";
import { Suspense } from "react";
import { buildFacets } from "../../features/templates/facets";
import { TemplatesExplorer } from "../../features/templates/templates-explorer";

export const metadata: Metadata = {
  title: "Templates",
  description: "Browse production-ready AI prompt and agent templates across every major tool.",
  // Every filter/search combination lives at this same path via query
  // params — canonicalize to the bare URL so they aren't indexed as
  // separate pages.
  alternates: { canonical: "/templates" },
};

/**
 * Sized to the real template count (not a fixed placeholder count) so the
 * skeleton's height closely matches the real grid once TemplatesExplorer
 * hydrates — a mismatch here was measurably causing layout shift (CLS) as
 * the footer jumped when the real, taller grid replaced a shorter skeleton.
 */
function ExplorerSkeleton({ resultCount }: { resultCount: number }) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <Skeleton className="h-96 w-full lg:w-64 lg:shrink-0" />
      <div className="grid flex-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: resultCount }, (_, i) => (
          <Skeleton key={i} className="h-56 w-full" />
        ))}
      </div>
    </div>
  );
}

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
      <Suspense fallback={<ExplorerSkeleton resultCount={templates.length} />}>
        <TemplatesExplorer />
      </Suspense>
    </main>
  );
}
