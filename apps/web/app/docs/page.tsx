import { docs } from "@ai-template/content";
import { Card, CardHeader, CardTitle, CardDescription } from "@ai-template/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { DocsNav } from "../../features/docs/docs-nav";

export const metadata: Metadata = {
  title: "Docs",
  description: "Getting started, architecture, and contribution guides for AI-TEMPLATE.",
  alternates: { canonical: "/docs" },
};

export default function DocsIndexPage() {
  const sorted = [...docs].sort((a, b) => a.order - b.order);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Documentation
        </h1>
        <p className="text-[var(--color-muted)]">
          Everything you need to run, extend, and contribute to AI-TEMPLATE.
        </p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <DocsNav />
        <div className="grid flex-1 gap-6 sm:grid-cols-2">
          <h2 className="sr-only">Guides</h2>
          {sorted.map((doc) => (
            <Link key={doc.slug} href={`/docs/${doc.slug}`} className="block">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
