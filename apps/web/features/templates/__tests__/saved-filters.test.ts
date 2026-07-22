import { beforeEach, describe, expect, it } from "vitest";
import { deleteSavedFilter, loadSavedFilters, saveFilter } from "../saved-filters";
import type { TemplateFilters } from "../filters";

const FILTERS: TemplateFilters = {
  q: "",
  provider: ["cursor"],
  category: ["frontend"],
  difficulty: [],
  sort: "updated",
};

describe("saved filters", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns an empty list when nothing is saved", () => {
    expect(loadSavedFilters()).toEqual([]);
  });

  it("saves and reloads a filter preset", () => {
    saveFilter("My Cursor frontend templates", FILTERS);
    expect(loadSavedFilters()).toEqual([
      { name: "My Cursor frontend templates", filters: FILTERS },
    ]);
  });

  it("overwrites an existing preset with the same name", () => {
    saveFilter("preset", FILTERS);
    saveFilter("preset", { ...FILTERS, provider: ["gemini"] });
    const saved = loadSavedFilters();
    expect(saved).toHaveLength(1);
    expect(saved[0]?.filters.provider).toEqual(["gemini"]);
  });

  it("rejects an empty name", () => {
    expect(() => saveFilter("   ", FILTERS)).toThrow();
  });

  it("deletes a preset by name", () => {
    saveFilter("a", FILTERS);
    saveFilter("b", FILTERS);
    deleteSavedFilter("a");
    expect(loadSavedFilters().map((f) => f.name)).toEqual(["b"]);
  });
});
