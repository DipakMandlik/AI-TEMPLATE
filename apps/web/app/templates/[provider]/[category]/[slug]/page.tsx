import { templates } from "@ai-template/content";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@ai-template/ui";
import { PROVIDER_LABELS, type Provider } from "@ai-template/validation";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdxContent } from "../../../../../components/mdx-content";
import { CopyButton } from "../../../../../features/templates/copy-button";
import { DownloadButton } from "../../../../../features/templates/download-button";
import { relatedTemplates } from "../../../../../features/templates/related";
import { TemplateCard } from "../../../../../features/templates/template-card";
import { templateGithubUrl } from "../../../../../lib/github";
import { SITE_URL } from "../../../../../lib/site";

interface PageParams {
  provider: string;
  category: string;
  slug: string;
}

function findTemplate({ provider, category, slug }: PageParams) {
  return templates.find(
    (t) => t.provider === provider && t.category === category && t.slug === slug,
  );
}

export function generateStaticParams(): PageParams[] {
  return templates.map((t) => ({ provider: t.provider, category: t.category, slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const template = findTemplate(await params);
  if (!template) return {};
  const path = `/templates/${template.provider}/${template.category}/${template.slug}`;
  return {
    title: template.title,
    description: template.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: template.title,
      description: template.description,
      publishedTime: template.createdAt,
      modifiedTime: template.updatedAt,
      tags: template.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: template.title,
      description: template.description,
    },
  };
}

export default async function TemplateDetailPage({ params }: { params: Promise<PageParams> }) {
  const template = findTemplate(await params);
  if (!template) notFound();

  const related = relatedTemplates(templates, template);
  const path = `/templates/${template.provider}/${template.category}/${template.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Templates", item: `${SITE_URL}/templates` },
      {
        "@type": "ListItem",
        position: 2,
        name: template.category,
        item: `${SITE_URL}/templates?category=${template.category}`,
      },
      { "@type": "ListItem", position: 3, name: template.title, item: `${SITE_URL}${path}` },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: template.title,
    description: template.description,
    datePublished: template.createdAt,
    dateModified: template.updatedAt,
    keywords: template.tags.join(", "),
    author: { "@type": "Person", name: template.author.name },
    license: template.license,
    url: `${SITE_URL}${path}`,
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
      <script
        type="application/ld+json"
        // Built entirely from this template's own frontmatter/build-time
        // data — no user input reaches this serialization.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Link href="/templates" className="text-sm text-[var(--color-muted)] hover:underline">
        ← All templates
      </Link>

      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{PROVIDER_LABELS[template.provider as Provider]}</Badge>
          <Badge variant="outline">{template.category}</Badge>
          <Badge variant="outline">{template.difficulty}</Badge>
          <Badge variant="outline">v{template.version}</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
          {template.title}
        </h1>
        <p className="text-lg text-[var(--color-muted)]">{template.description}</p>
        <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--color-muted)]">
          <div>
            <dt className="inline font-medium text-[var(--color-foreground)]">Author: </dt>
            <dd className="inline">{template.author.name}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-[var(--color-foreground)]">License: </dt>
            <dd className="inline">{template.license}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-[var(--color-foreground)]">Updated: </dt>
            <dd className="inline">{template.updatedAt}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-brand-50)] px-2 py-0.5 text-xs text-[var(--color-brand-700)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <CopyButton text={template.raw} />
          <DownloadButton text={template.raw} filename={`${template.slug}.mdx`} />
          <a
            href={templateGithubUrl(template.provider, template.category, template.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-foreground)] shadow-[var(--shadow-soft-sm)] transition-colors hover:bg-[var(--color-brand-50)]"
          >
            <ExternalLink className="size-4" />
            Open in GitHub
          </a>
        </div>
      </header>

      <div className="mdx-content max-w-none">
        <MdxContent code={template.code} />
      </div>

      {template.compatibility.length > 0 ? (
        <Section title="Compatibility">
          <div className="flex flex-wrap gap-1.5">
            {template.compatibility.map((provider) => (
              <Badge key={provider} variant="outline">
                {PROVIDER_LABELS[provider as Provider]}
              </Badge>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Use cases">
        <BulletList items={template.useCases} />
      </Section>

      {template.bestPractices?.length ? (
        <Section title="Best practices">
          <BulletList items={template.bestPractices} />
        </Section>
      ) : null}

      {template.limitations?.length ? (
        <Section title="Limitations">
          <BulletList items={template.limitations} />
        </Section>
      ) : null}

      <Section title="Examples">
        <div className="flex flex-col gap-4">
          {template.examples.map((example) => (
            <Card key={example.title}>
              <CardHeader>
                <CardTitle className="text-base">{example.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div>
                  <p className="mb-1 font-medium text-[var(--color-muted)]">Input</p>
                  <pre className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] p-3">
                    <code>{example.input}</code>
                  </pre>
                </div>
                <div>
                  <p className="mb-1 font-medium text-[var(--color-muted)]">Expected output</p>
                  <pre className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] p-3">
                    <code>{example.output}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Version history">
        <ol className="flex flex-col gap-3">
          {[...template.changelog].reverse().map((entry) => (
            <li key={entry.version} className="text-sm">
              <span className="font-medium text-[var(--color-foreground)]">v{entry.version}</span>{" "}
              <span className="text-[var(--color-muted)]">— {entry.date}</span>
              <BulletList items={entry.changes} className="mt-1" />
            </li>
          ))}
        </ol>
      </Section>

      {related.length > 0 ? (
        <Section title="Related templates">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <TemplateCard key={`${t.provider}/${t.category}/${t.slug}`} template={t} />
            ))}
          </div>
        </Section>
      ) : null}
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-8">
      <h2 className="text-xl font-semibold text-[var(--color-foreground)]">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul
      className={`flex list-disc flex-col gap-1.5 pl-5 text-[var(--color-foreground)] ${className}`}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
