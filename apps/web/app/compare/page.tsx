import { Skeleton } from "@ai-template/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CompareView } from "../../features/templates/compare-view";

export const metadata: Metadata = {
  title: "Compare templates",
  description: "Side-by-side comparison of two templates from the library.",
};

function CompareSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function ComparePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <Link href="/templates" className="text-sm text-[var(--color-muted)] hover:underline">
          ← All templates
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Compare templates
        </h1>
      </div>
      <Suspense fallback={<CompareSkeleton />}>
        <CompareView />
      </Suspense>
    </main>
  );
}
