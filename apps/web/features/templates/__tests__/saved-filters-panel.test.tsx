import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TemplateFilters } from "../filters";
import { SavedFiltersPanel } from "../saved-filters-panel";

const ACTIVE_FILTERS: TemplateFilters = {
  q: "",
  provider: ["cursor"],
  category: [],
  difficulty: [],
  sort: "updated",
};

const EMPTY_FILTERS: TemplateFilters = {
  q: "",
  provider: [],
  category: [],
  difficulty: [],
  sort: "updated",
};

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  window.localStorage.clear();
});

describe("SavedFiltersPanel", () => {
  it("shows no bookmark button when no filters are active", () => {
    render(<SavedFiltersPanel current={EMPTY_FILTERS} onApply={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /save current filters/i })).not.toBeInTheDocument();
  });

  it("saves a filter preset by name and lists it", async () => {
    const user = userEvent.setup();
    render(<SavedFiltersPanel current={ACTIVE_FILTERS} onApply={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /save current filters/i }));
    await user.type(screen.getByPlaceholderText("Filter name"), "Cursor only");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText("Cursor only")).toBeInTheDocument();
  });

  it("applies a saved preset when clicked", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<SavedFiltersPanel current={ACTIVE_FILTERS} onApply={onApply} />);

    await user.click(screen.getByRole("button", { name: /save current filters/i }));
    await user.type(screen.getByPlaceholderText("Filter name"), "Cursor only");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await user.click(await screen.findByText("Cursor only"));
    expect(onApply).toHaveBeenCalledWith(ACTIVE_FILTERS);
  });

  it("deletes a saved preset", async () => {
    const user = userEvent.setup();
    render(<SavedFiltersPanel current={ACTIVE_FILTERS} onApply={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /save current filters/i }));
    await user.type(screen.getByPlaceholderText("Filter name"), "Cursor only");
    await user.click(screen.getByRole("button", { name: /^save$/i }));
    expect(await screen.findByText("Cursor only")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete saved filter/i }));
    expect(screen.queryByText("Cursor only")).not.toBeInTheDocument();
  });
});
