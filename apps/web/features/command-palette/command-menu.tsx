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
import { FileText, Home, LayoutGrid, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";
import { NAV_LINKS } from "../../constants/nav";

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": Home,
  "/templates": LayoutGrid,
  "/categories": LayoutGrid,
  "/docs": FileText,
};

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
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
    action();
  }, []);

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
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search templates, categories, and pages…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {NAV_LINKS.map((link) => {
              const Icon = NAV_ICONS[link.href] ?? FileText;
              return (
                <CommandItem
                  key={link.href}
                  value={`${link.label} ${link.description}`}
                  onSelect={() => runCommand(() => router.push(link.href))}
                >
                  <Icon />
                  <span>{link.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem value="Light theme" onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun />
              <span>Light</span>
              <CommandShortcut>Theme</CommandShortcut>
            </CommandItem>
            <CommandItem value="Dark theme" onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon />
              <span>Dark</span>
              <CommandShortcut>Theme</CommandShortcut>
            </CommandItem>
            <CommandItem value="System theme" onSelect={() => runCommand(() => setTheme("system"))}>
              <Monitor />
              <span>System</span>
              <CommandShortcut>Theme</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
