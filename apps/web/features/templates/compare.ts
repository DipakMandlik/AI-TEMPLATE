import { parseAsArrayOf, parseAsString } from "nuqs";

/** Comparison is a side-by-side view of exactly two templates — see roadmap.md §3.2 #9. */
export const MAX_COMPARE = 2;

export const compareParsers = {
  compare: parseAsArrayOf(parseAsString).withDefault([]),
};

/** Toggles `path` in `list`, capping additions at MAX_COMPARE. Pure — no React, no URL. */
export function toggleCompare(list: string[], path: string): string[] {
  if (list.includes(path)) {
    return list.filter((value) => value !== path);
  }
  if (list.length >= MAX_COMPARE) {
    return list;
  }
  return [...list, path];
}
