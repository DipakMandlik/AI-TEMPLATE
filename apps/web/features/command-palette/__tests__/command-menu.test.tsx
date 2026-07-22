import { ThemeProvider } from "@ai-template/ui";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandMenu } from "../command-menu";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function renderMenu() {
  return render(
    <ThemeProvider>
      <CommandMenu />
    </ThemeProvider>,
  );
}

describe("CommandMenu", () => {
  it("opens the dialog when the trigger button is clicked", async () => {
    const user = userEvent.setup();
    renderMenu();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /search/i }));
    // The palette is dynamically imported on first open, so it may not be
    // in the DOM synchronously after the click.
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search templates, categories, and pages/i),
    ).toBeInTheDocument();
  });

  it("shows every nav link when the query is empty, grouped under Navigate", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: /search/i }));
    await screen.findByRole("dialog");

    expect(screen.getByText("Navigate")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /templates/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /categories/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /docs/i })).toBeInTheDocument();
  });

  it("navigates to a nav link and closes the dialog when selected", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: /search/i }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("option", { name: /templates/i }));
    expect(push).toHaveBeenCalledWith("/templates");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("filters to matching templates by search query", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: /search/i }));
    await screen.findByRole("dialog");

    await user.type(
      screen.getByPlaceholderText(/search templates, categories, and pages/i),
      "playwright",
    );
    expect(screen.getByText("Templates")).toBeInTheDocument();
    expect(screen.getByText(/playwright e2e test generator/i)).toBeInTheDocument();
  });
});
