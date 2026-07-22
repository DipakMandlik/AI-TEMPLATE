import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ai-template/ui";
import { PROVIDER_LABELS, type Provider } from "@ai-template/validation";
import { Check, Scale } from "lucide-react";
import Link from "next/link";
import type { Template } from "@ai-template/content";
import { templateHref } from "./template-path";

export interface TemplateCardProps {
  template: Template;
  /** Compare-mode props are all optional — plain listings render without the toggle. */
  isComparing?: boolean;
  compareDisabled?: boolean;
  onCompareToggle?: () => void;
}

/**
 * The whole card is clickable via a "stretched link" (an absolutely
 * positioned anchor covering the card) rather than wrapping the card in an
 * `<a>` — the compare toggle is a real `<button>`, and interactive content
 * (a button) can't validly nest inside an anchor's content model.
 */
export function TemplateCard({
  template,
  isComparing = false,
  compareDisabled = false,
  onCompareToggle,
}: TemplateCardProps) {
  return (
    <Card className="relative flex h-full flex-col">
      <Link
        href={templateHref(template)}
        className="absolute inset-0 z-0 rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
      >
        <span className="sr-only">{template.title}</span>
      </Link>
      <CardHeader>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{PROVIDER_LABELS[template.provider as Provider]}</Badge>
            <Badge variant="outline">{template.difficulty}</Badge>
          </div>
          {onCompareToggle ? (
            <button
              type="button"
              aria-pressed={isComparing}
              disabled={compareDisabled}
              onClick={onCompareToggle}
              className="relative z-10 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                borderColor: isComparing ? "var(--color-brand-600)" : "var(--color-border)",
                color: isComparing ? "var(--color-brand-600)" : "var(--color-muted)",
                background: isComparing ? "var(--color-brand-50)" : "transparent",
              }}
            >
              {isComparing ? <Check className="size-3" /> : <Scale className="size-3" />}
              Compare
            </button>
          ) : null}
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
  );
}
