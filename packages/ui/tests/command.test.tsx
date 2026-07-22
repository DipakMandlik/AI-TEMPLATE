import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../src/components/command";

describe("Command (standalone, not in a dialog)", () => {
  it("filters items as the input changes and has no axe violations", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Command label="Test command">
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Fruits">
            <CommandItem value="apple">Apple</CommandItem>
            <CommandItem value="banana">Banana</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );

    expect(await axe(container)).toHaveNoViolations();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Search…"), "app");
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();
  });

  it("shows the empty state and calls onSelect", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Command label="Test command">
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandItem value="apple" onSelect={onSelect}>
            Apple
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>,
    );

    await user.click(screen.getByText("Apple"));
    expect(onSelect).toHaveBeenCalledWith("apple");

    await user.type(screen.getByPlaceholderText("Search…"), "zzz");
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });
});

describe("CommandDialog", () => {
  it("renders its content, with a group separator, once open", async () => {
    const { container } = render(
      <CommandDialog open onOpenChange={vi.fn()}>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandGroup heading="One">
            <CommandItem value="a">A</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Two">
            <CommandItem value="b">B</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
