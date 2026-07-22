import { ThemeToggle } from "@ai-template/ui";
import Link from "next/link";
import { CommandMenu } from "../features/command-palette/command-menu";
import { NAV_LINKS } from "../constants/nav";

export function SiteHeader() {
  return (
    <header className="bg-[var(--color-background)]/80 sticky top-0 z-40 border-b border-[var(--color-border)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-[var(--color-foreground)]"
        >
          AI-TEMPLATE
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {NAV_LINKS.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <CommandMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
