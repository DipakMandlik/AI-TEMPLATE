import { docs } from "@ai-template/content";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdxContent } from "../../../components/mdx-content";
import { DocsNav } from "../../../features/docs/docs-nav";

interface PageParams {
  slug: string;
}

function sortedDocs() {
  return [...docs].sort((a, b) => a.order - b.order);
}

export function generateStaticParams(): PageParams[] {
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/docs/${slug}` },
  };
}

export default async function DocPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);
  if (!doc) notFound();

  const ordered = sortedDocs();
  const index = ordered.findIndex((d) => d.slug === slug);
  const previous = index > 0 ? ordered[index - 1] : undefined;
  const next = index < ordered.length - 1 ? ordered[index + 1] : undefined;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-8 lg:flex-row">
        <DocsNav activeSlug={slug} />
        <div className="mdx-content max-w-none flex-1">
          <h1 className="!mt-0 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
            {doc.title}
          </h1>
          <p className="text-lg text-[var(--color-muted)]">{doc.description}</p>
          <MdxContent code={doc.code} />
          <nav className="mt-12 flex items-center justify-between border-t border-[var(--color-border)] pt-6 text-sm">
            {previous ? (
              <Link
                href={`/docs/${previous.slug}`}
                className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                <ArrowLeft className="size-4" />
                {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/docs/${next.slug}`}
                className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                {next.title}
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </div>
    </main>
  );
}
