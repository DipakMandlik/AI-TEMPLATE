import { templates } from "@ai-template/content";
import { Badge } from "@ai-template/ui";
import { PROVIDER_LABELS, type Provider } from "@ai-template/validation";
import type { Metadata } from "next";
import Link from "next/link";
import { MdxContent } from "../../components/mdx-content";
import { templateHref, templatePath } from "../../features/templates/template-path";

export const metadata: Metadata = {
  title: "Compare templates",
  description: "Side-by-side comparison of two templates from the library.",
};

interface CompareSearchParams {
  compare?: string;
}

function resolveTemplates(compareParam: string | undefined) {
  const paths = (compareParam ?? "").split(",").filter(Boolean);
  return paths
    .map((path) => templates.find((template) => templatePath(template) === path))
    .filter((template) => template !== undefined)
    .slice(0, 2);
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<CompareSearchParams>;
}) {
  const { compare } = await searchParams;
  const selected = resolveTemplates(compare);

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

      {selected.length < 2 ? (
        <p className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8 text-center text-[var(--color-muted)]">
          Pick two templates to compare from the{" "}
          <Link href="/templates" className="text-[var(--color-brand-600)] underline">
            template library
          </Link>{" "}
          — select the &quot;Compare&quot; button on any two cards.
        </p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {selected.map((template) => (
            <article
              key={templatePath(template)}
              className="flex flex-col gap-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <header className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{PROVIDER_LABELS[template.provider as Provider]}</Badge>
                  <Badge variant="outline">{template.category}</Badge>
                  <Badge variant="outline">{template.difficulty}</Badge>
                  <Badge variant="outline">v{template.version}</Badge>
                </div>
                <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
                  <Link href={templateHref(template)} className="hover:underline">
                    {template.title}
                  </Link>
                </h2>
                <p className="text-sm text-[var(--color-muted)]">{template.description}</p>
              </header>

              <ComparisonList title="Use cases" items={template.useCases} />
              {template.bestPractices ? (
                <ComparisonList title="Best practices" items={template.bestPractices} />
              ) : null}
              {template.limitations ? (
                <ComparisonList title="Limitations" items={template.limitations} />
              ) : null}

              <div>
                <h3 className="mb-2 text-sm font-semibold text-[var(--color-foreground)]">
                  Prompt
                </h3>
                <div className="mdx-content max-w-none text-sm">
                  <MdxContent code={template.code} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function ComparisonList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-[var(--color-foreground)]">{title}</h3>
      <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-[var(--color-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
