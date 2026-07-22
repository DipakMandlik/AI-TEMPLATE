"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@ai-template/ui";
import { PROVIDER_LABELS, type Provider } from "@ai-template/validation";
import { FileText, Home, LayoutGrid, Monitor, Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";
import { NAV_LINKS } from "../../constants/nav";
import { searchTemplates } from "../search";

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": Home,
  "/templates": LayoutGrid,
  "/categories": LayoutGrid,
  "/docs": FileText,
};

const MAX_TEMPLATE_RESULTS = 6;

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const runCommand = React.useCallback((action: () => void) => {
    setOpen(false);
    setQuery("");
    action();
  }, []);

  const trimmedQuery = query.trim();
  const templateResults = React.useMemo(
    () => (trimmedQuery ? searchTemplates(trimmedQuery).slice(0, MAX_TEMPLATE_RESULTS) : []),
    [trimmedQuery],
  );

  const matchesQuery = React.useCallback(
    (...haystack: string[]) =>
      trimmedQuery.length === 0 ||
      haystack.some((value) => value.toLowerCase().includes(trimmedQuery.toLowerCase())),
    [trimmedQuery],
  );

  const navMatches = NAV_LINKS.filter((link) => matchesQuery(link.label, link.description));
  const themeMatches = ["light", "dark", "system"].filter((theme) => matchesQuery(theme, "theme"));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-muted)] shadow-[var(--shadow-soft-sm)] transition-colors hover:bg-[var(--color-brand-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
      >
        <span>Search…</span>
        <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-background)] px-1.5 py-0.5 text-xs">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search templates, categories, and pages…"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {templateResults.length > 0 ? (
            <>
              <CommandGroup heading="Templates">
                {templateResults.map((template) => (
                  <CommandItem
                    key={`${template.provider}/${template.category}/${template.slug}`}
                    value={`template-${template.slug}`}
                    onSelect={() =>
                      runCommand(() =>
                        router.push(
                          `/templates/${template.provider}/${template.category}/${template.slug}`,
                        ),
                      )
                    }
                  >
                    <Sparkles />
                    <span className="flex flex-col">
                      <span>{template.title}</span>
                      <span className="text-xs text-[var(--color-muted)]">
                        {PROVIDER_LABELS[template.provider as Provider]} · {template.category}
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          ) : null}

          {navMatches.length > 0 ? (
            <CommandGroup heading="Navigate">
              {navMatches.map((link) => {
                const Icon = NAV_ICONS[link.href] ?? FileText;
                return (
                  <CommandItem
                    key={link.href}
                    value={`nav-${link.href}`}
                    onSelect={() => runCommand(() => router.push(link.href))}
                  >
                    <Icon />
                    <span>{link.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ) : null}

          {themeMatches.length > 0 ? (
            <>
              <CommandSeparator />
              <CommandGroup heading="Theme">
                {themeMatches.includes("light") && (
                  <CommandItem
                    value="theme-light"
                    onSelect={() => runCommand(() => setTheme("light"))}
                  >
                    <Sun />
                    <span>Light</span>
                    <CommandShortcut>Theme</CommandShortcut>
                  </CommandItem>
                )}
                {themeMatches.includes("dark") && (
                  <CommandItem
                    value="theme-dark"
                    onSelect={() => runCommand(() => setTheme("dark"))}
                  >
                    <Moon />
                    <span>Dark</span>
                    <CommandShortcut>Theme</CommandShortcut>
                  </CommandItem>
                )}
                {themeMatches.includes("system") && (
                  <CommandItem
                    value="theme-system"
                    onSelect={() => runCommand(() => setTheme("system"))}
                  >
                    <Monitor />
                    <span>System</span>
                    <CommandShortcut>Theme</CommandShortcut>
                  </CommandItem>
                )}
              </CommandGroup>
            </>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}
