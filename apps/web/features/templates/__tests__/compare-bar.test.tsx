import type { Template } from "@ai-template/content";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CompareBar } from "../compare-bar";

function fixture(slug: string, title: string): Template {
  return { provider: "cursor", category: "backend", slug, title } as unknown as Template;
}

describe("CompareBar", () => {
  it("renders nothing when no templates are selected", () => {
    const { container } = render(
      <CompareBar templates={[]} onRemove={vi.fn()} onClear={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("lists each selected template and disables Compare below the cap", () => {
    render(
      <CompareBar templates={[fixture("a", "Template A")]} onRemove={vi.fn()} onClear={vi.fn()} />,
    );
    expect(screen.getByText("Template A")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compare" })).toBeDisabled();
  });

  it("enables a Compare link once two templates are selected", () => {
    render(
      <CompareBar
        templates={[fixture("a", "Template A"), fixture("b", "Template B")]}
        onRemove={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    const link = screen.getByRole("link", { name: "Compare" });
    expect(link).toHaveAttribute("href", "/compare?compare=cursor/backend/a,cursor/backend/b");
  });

  it("calls onRemove with the removed template's path", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <CompareBar templates={[fixture("a", "Template A")]} onRemove={onRemove} onClear={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: /remove template a/i }));
    expect(onRemove).toHaveBeenCalledWith("cursor/backend/a");
  });

  it("calls onClear when Clear is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(
      <CompareBar templates={[fixture("a", "Template A")]} onRemove={vi.fn()} onClear={onClear} />,
    );
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onClear).toHaveBeenCalled();
  });
});
