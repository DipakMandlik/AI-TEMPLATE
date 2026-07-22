import { templates } from "@ai-template/content";
import { Card, CardHeader, CardTitle, CardDescription } from "@ai-template/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { buildFacets } from "../../features/templates/facets";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse the template library by category — frontend, backend, security, and more.",
  alternates: { canonical: "/categories" },
};

function toTitleCase(slug: string) {
  return slug
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export default function CategoriesPage() {
  const { categories } = buildFacets(templates);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Categories
        </h1>
        <p className="text-[var(--color-muted)]">
          {categories.length} categories across {templates.length} templates. Pick one to jump
          straight to a filtered view of the library.
        </p>
      </div>
      <h2 className="sr-only">Categories</h2>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.value}
            href={`/templates?category=${encodeURIComponent(category.value)}`}
            className="block"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{toTitleCase(category.value)}</CardTitle>
                <CardDescription>
                  {category.count} {category.count === 1 ? "template" : "templates"}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
