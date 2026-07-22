import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "../page";

describe("Home", () => {
  it("renders the hero heading and primary CTAs", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /the world's best ai prompt & ai agent template library/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Browse templates" }).length).toBeGreaterThan(0);
  });

  it("renders the why-AI-TEMPLATE comparison table", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "Why AI-TEMPLATE" })).toBeInTheDocument();
    expect(
      screen.getByText("Runs fully self-hosted, zero required SaaS accounts"),
    ).toBeInTheDocument();
  });
});
