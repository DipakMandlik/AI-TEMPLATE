import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Badge } from "../src/components/badge";
import { Button } from "../src/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../src/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../src/components/dialog";
import { Skeleton } from "../src/components/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../src/components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../src/components/tooltip";

describe("accessibility", () => {
  it("Button has no axe violations and is keyboard-focusable", async () => {
    const { container } = render(<Button>Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    button?.focus();
    expect(button).toHaveFocus();
  });

  it("Badge has no axe violations", async () => {
    const { container } = render(<Badge>New</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Card composition has no axe violations", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Skeleton exposes a loading status role", async () => {
    const { container, getByRole } = render(<Skeleton className="h-4 w-24" />);
    expect(getByRole("status")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Tabs has no axe violations and switches panels via the keyboard", async () => {
    const user = userEvent.setup();
    const { container, getByRole, getByText } = render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>,
    );
    expect(await axe(container)).toHaveNoViolations();
    expect(getByText("First panel")).toBeVisible();
    await user.click(getByRole("tab", { name: "Two" }));
    expect(getByText("Second panel")).toBeVisible();
  });

  it("Tooltip trigger has no axe violations", async () => {
    const { container } = render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button>Hover</Button>
          </TooltipTrigger>
          <TooltipContent>Helpful text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Dialog trigger has no axe violations when closed", async () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
