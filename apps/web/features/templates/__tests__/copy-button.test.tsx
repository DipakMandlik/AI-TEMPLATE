import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyButton } from "../copy-button";

describe("CopyButton", () => {
  it("copies the given text to the clipboard and shows feedback", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<CopyButton text="the prompt content" />);
    await user.click(screen.getByRole("button", { name: "Copy prompt" }));

    expect(writeText).toHaveBeenCalledWith("the prompt content");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });
});
