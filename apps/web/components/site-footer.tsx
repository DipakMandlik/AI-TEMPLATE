import Link from "next/link";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Templates", href: "/templates" },
      { label: "Categories", href: "/categories" },
      { label: "Docs", href: "/docs" },
    ],
  },
  {
    heading: "Project",
    links: [
      {
        label: "Roadmap",
        href: "https://github.com/DipakMandlik/AI-TEMPLATE/blob/main/roadmap.md",
      },
      {
        label: "Architecture",
        href: "https://github.com/DipakMandlik/AI-TEMPLATE/blob/main/architecture.md",
      },
      { label: "GitHub", href: "https://github.com/DipakMandlik/AI-TEMPLATE" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col gap-2">
          <span className="text-base font-semibold text-[var(--color-foreground)]">
            AI-TEMPLATE
          </span>
          <p className="max-w-sm text-sm text-[var(--color-muted)]">
            The world&apos;s best AI Prompt &amp; AI Agent Template Library — open source,
            multi-provider, production-ready.
          </p>
        </div>
        {FOOTER_LINKS.map((section) => (
          <div key={section.heading} className="flex flex-col gap-3">
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              {section.heading}
            </span>
            <ul className="flex flex-col gap-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--color-border)] py-6 text-center text-xs text-[var(--color-muted)]">
        MIT Licensed. Built in the open.
      </div>
    </footer>
  );
}
