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

export interface CommandPaletteContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * The actual palette — cmdk, the FlexSearch-backed template search, and
 * every command. Pulled out of command-menu.tsx and dynamically imported
 * from there so this (and the ~50KB of cmdk + search it drags in) isn't
 * part of the JS every page has to load just to render a trigger button.
 */
export function CommandPaletteContent({ open, onOpenChange }: CommandPaletteContentProps) {
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const { setTheme } = useTheme();

  const runCommand = React.useCallback(
    (action: () => void) => {
      onOpenChange(false);
      setQuery("");
      action();
    },
    [onOpenChange],
  );

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
    <CommandDialog open={open} onOpenChange={onOpenChange} shouldFilter={false}>
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
                <CommandItem value="theme-dark" onSelect={() => runCommand(() => setTheme("dark"))}>
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
  );
}

export default CommandPaletteContent;
