import type { TemplateFilters } from "./filters";

const STORAGE_KEY = "ai-template:saved-filters";

export interface SavedFilter {
  name: string;
  filters: TemplateFilters;
}

function readStorage(): SavedFilter[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(filters: SavedFilter[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
}

/** All filter presets saved locally in this browser (future: synced to an account, architecture.md §7). */
export function loadSavedFilters(): SavedFilter[] {
  return readStorage();
}

/** Saves (or overwrites, by name) a filter preset and returns the updated list. */
export function saveFilter(name: string, filters: TemplateFilters): SavedFilter[] {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Filter name cannot be empty.");
  const next = [...readStorage().filter((f) => f.name !== trimmed), { name: trimmed, filters }];
  writeStorage(next);
  return next;
}

/** Deletes a filter preset by name and returns the updated list. */
export function deleteSavedFilter(name: string): SavedFilter[] {
  const next = readStorage().filter((f) => f.name !== name);
  writeStorage(next);
  return next;
}
