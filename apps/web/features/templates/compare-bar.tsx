"use client";

import { Button } from "@ai-template/ui";
import type { Template } from "@ai-template/content";
import { Scale, X } from "lucide-react";
import Link from "next/link";
import { MAX_COMPARE } from "./compare";

export interface CompareBarProps {
  templates: Template[];
  onRemove: (path: string) => void;
  onClear: () => void;
}

/** Floating bar that appears once at least one template is selected for comparison. */
export function CompareBar({ templates, onRemove, onClear }: CompareBarProps) {
  if (templates.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Template comparison"
      className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-soft-lg)]"
    >
      <Scale className="size-4 shrink-0 text-[var(--color-muted)]" />
      <ul className="flex flex-wrap items-center gap-2">
        {templates.map((template) => (
          <li
            key={`${template.provider}/${template.category}/${template.slug}`}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-50)] py-1 pl-3 pr-1 text-xs text-[var(--color-brand-700)]"
          >
            {template.title}
            <button
              type="button"
              aria-label={`Remove ${template.title} from comparison`}
              onClick={() => onRemove(`${template.provider}/${template.category}/${template.slug}`)}
              className="rounded-full p-0.5 hover:bg-[var(--color-brand-100)]"
            >
              <X className="size-3" />
            </button>
          </li>
        ))}
      </ul>
      <div className="ml-1 flex items-center gap-2">
        {templates.length < MAX_COMPARE ? (
          <Button size="sm" disabled title={`Pick ${MAX_COMPARE} templates to compare`}>
            Compare
          </Button>
        ) : (
          <Button asChild size="sm">
            <Link
              href={`/compare?compare=${templates.map((t) => `${t.provider}/${t.category}/${t.slug}`).join(",")}`}
            >
              Compare
            </Link>
          </Button>
        )}
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-[var(--color-muted)] hover:underline"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
