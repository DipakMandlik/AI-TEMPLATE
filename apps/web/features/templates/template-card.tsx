import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ai-template/ui";
import { PROVIDER_LABELS, type Provider } from "@ai-template/validation";
import Link from "next/link";
import type { Template } from "@ai-template/content";

export function TemplateCard({ template }: { template: Template }) {
  return (
    <Link
      href={`/templates/${template.provider}/${template.category}/${template.slug}`}
      className="block rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
    >
      <Card className="flex h-full flex-col">
        <CardHeader>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge>{PROVIDER_LABELS[template.provider as Provider]}</Badge>
            <Badge variant="outline">{template.difficulty}</Badge>
          </div>
          <CardTitle>{template.title}</CardTitle>
          <CardDescription>{template.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto flex flex-wrap gap-1.5">
          {template.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-brand-50)] px-2 py-0.5 text-xs text-[var(--color-brand-700)]"
            >
              {tag}
            </span>
          ))}
        </CardContent>
      </Card>
    </Link>
  );
}
