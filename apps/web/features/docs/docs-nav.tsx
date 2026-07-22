import { docs } from "@ai-template/content";
import { cn } from "@ai-template/ui";
import Link from "next/link";

/** Ordered sidebar nav shared by every docs page — sorted by frontmatter `order`. */
export function DocsNav({ activeSlug }: { activeSlug?: string }) {
  const sorted = [...docs].sort((a, b) => a.order - b.order);

  return (
    <nav aria-label="Documentation" className="flex w-full flex-col gap-1 lg:w-56 lg:shrink-0">
      {sorted.map((doc) => (
        <Link
          key={doc.slug}
          href={`/docs/${doc.slug}`}
          className={cn(
            "rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors",
            doc.slug === activeSlug
              ? "bg-[var(--color-brand-50)] font-medium text-[var(--color-brand-700)]"
              : "text-[var(--color-muted)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-foreground)]",
          )}
        >
          {doc.title}
        </Link>
      ))}
    </nav>
  );
}
