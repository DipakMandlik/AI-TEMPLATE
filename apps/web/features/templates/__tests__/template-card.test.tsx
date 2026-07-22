import type { Template } from "@ai-template/content";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TemplateCard } from "../template-card";

const TEMPLATE = {
  provider: "cursor",
  category: "backend",
  slug: "sql-query-performance-reviewer",
  title: "SQL Query Performance Reviewer",
  description: "Reviews SQL for missing indexes and N+1 patterns.",
  difficulty: "advanced",
  tags: ["sql", "performance"],
} as unknown as Template;

describe("TemplateCard", () => {
  it("renders as a link to the template's detail page", () => {
    render(<TemplateCard template={TEMPLATE} />);
    expect(screen.getByRole("link", { name: TEMPLATE.title })).toHaveAttribute(
      "href",
      "/templates/cursor/backend/sql-query-performance-reviewer",
    );
  });

  it("renders no compare button when onCompareToggle is omitted", () => {
    render(<TemplateCard template={TEMPLATE} />);
    expect(screen.queryByRole("button", { name: /compare/i })).not.toBeInTheDocument();
  });

  it("calls onCompareToggle (not navigation) when the compare button is clicked", async () => {
    const user = userEvent.setup();
    const onCompareToggle = vi.fn();
    render(<TemplateCard template={TEMPLATE} onCompareToggle={onCompareToggle} />);

    await user.click(screen.getByRole("button", { name: /compare/i }));
    expect(onCompareToggle).toHaveBeenCalledTimes(1);
  });

  it("disables the compare button when compareDisabled is set", () => {
    render(<TemplateCard template={TEMPLATE} onCompareToggle={vi.fn()} compareDisabled />);
    expect(screen.getByRole("button", { name: /compare/i })).toBeDisabled();
  });

  it("marks the compare button pressed when isComparing is true", () => {
    render(<TemplateCard template={TEMPLATE} onCompareToggle={vi.fn()} isComparing />);
    expect(screen.getByRole("button", { name: /compare/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
