import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FacetSidebar, toggle } from "../facet-sidebar";

const PROVIDERS = [
  { value: "cursor", count: 3 },
  { value: "claude-code", count: 2 },
];
const CATEGORIES = [{ value: "backend", count: 1 }];
const DIFFICULTIES = [{ value: "beginner", count: 4 }];

function renderSidebar(overrides: Partial<React.ComponentProps<typeof FacetSidebar>> = {}) {
  const onProviderToggle = vi.fn();
  const onCategoryToggle = vi.fn();
  const onDifficultyToggle = vi.fn();
  const onClear = vi.fn();

  render(
    <FacetSidebar
      providers={PROVIDERS}
      categories={CATEGORIES}
      difficulties={DIFFICULTIES}
      selectedProviders={[]}
      selectedCategories={[]}
      selectedDifficulties={[]}
      onProviderToggle={onProviderToggle}
      onCategoryToggle={onCategoryToggle}
      onDifficultyToggle={onDifficultyToggle}
      onClear={onClear}
      {...overrides}
    />,
  );

  return { onProviderToggle, onCategoryToggle, onDifficultyToggle, onClear };
}

describe("FacetSidebar", () => {
  it("renders every facet value with its count, using the provider label", () => {
    renderSidebar();
    expect(screen.getByText("Cursor")).toBeInTheDocument();
    expect(screen.getByText("Claude Code")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onProviderToggle with the facet value when its checkbox is clicked", async () => {
    const user = userEvent.setup();
    const { onProviderToggle } = renderSidebar();

    await user.click(screen.getByRole("checkbox", { name: /cursor/i }));
    expect(onProviderToggle).toHaveBeenCalledWith("cursor");
  });

  it("checks a facet's checkbox when it's already selected", () => {
    renderSidebar({ selectedCategories: ["backend"] });
    expect(screen.getByRole("checkbox", { name: /backend/i })).toBeChecked();
  });

  it('shows "Clear all" only when a filter is active, and calls onClear', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <FacetSidebar
        providers={PROVIDERS}
        categories={CATEGORIES}
        difficulties={DIFFICULTIES}
        selectedProviders={[]}
        selectedCategories={[]}
        selectedDifficulties={[]}
        onProviderToggle={vi.fn()}
        onCategoryToggle={vi.fn()}
        onDifficultyToggle={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    expect(screen.queryByRole("button", { name: /clear all/i })).not.toBeInTheDocument();

    const onClear = vi.fn();
    rerender(
      <FacetSidebar
        providers={PROVIDERS}
        categories={CATEGORIES}
        difficulties={DIFFICULTIES}
        selectedProviders={["cursor"]}
        selectedCategories={[]}
        selectedDifficulties={[]}
        onProviderToggle={vi.fn()}
        onCategoryToggle={vi.fn()}
        onDifficultyToggle={vi.fn()}
        onClear={onClear}
      />,
    );
    await user.click(screen.getByRole("button", { name: /clear all/i }));
    expect(onClear).toHaveBeenCalled();
  });
});

describe("toggle", () => {
  it("adds a value not yet present", () => {
    expect(toggle(["a"], "b")).toEqual(["a", "b"]);
  });

  it("removes a value already present", () => {
    expect(toggle(["a", "b"], "a")).toEqual(["b"]);
  });
});
