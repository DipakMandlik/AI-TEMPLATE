import { expect, test } from "@playwright/test";

test("browsing from the library to a template detail page", async ({ page }) => {
  await page.goto("/templates");
  await expect(page.getByRole("heading", { level: 1, name: "Templates" })).toBeVisible();

  await page.getByRole("link", { name: /react server components reviewer/i }).click();

  await expect(
    page.getByRole("heading", { level: 1, name: "React Server Components Reviewer" }),
  ).toBeVisible();
  await expect(page.getByText("AI-TEMPLATE Maintainers")).toBeVisible();
  await expect(page.getByRole("heading", { name: "The prompt" })).toBeVisible();
});

test("search, filter, and open a template — the golden path", async ({ page }) => {
  await page.goto("/templates");
  await expect(page.getByText("11 templates")).toBeVisible();

  // Search narrows results and the URL reflects the query.
  await page.getByPlaceholder("Search templates…").fill("react");
  await expect(page).toHaveURL(/[?&]q=react/);
  await expect(page.getByText("2 templates")).toBeVisible();

  // Clear the search, then filter by a provider facet instead.
  await page.getByPlaceholder("Search templates…").fill("");
  const windsurfCheckbox = page
    .getByRole("checkbox")
    .locator("xpath=../..")
    .filter({ hasText: "Windsurf" })
    .getByRole("checkbox");
  await windsurfCheckbox.click();
  await expect(page).toHaveURL(/[?&]provider=windsurf/);
  await expect(page.getByText("1 template", { exact: true })).toBeVisible();

  // The filter survives a reload (URL-restorable).
  await page.reload();
  await expect(windsurfCheckbox).toBeChecked();

  // Open the one remaining template from the filtered grid.
  await page.getByRole("link", { name: /tailwind v4 migration assistant/i }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Tailwind v4 Migration Assistant" }),
  ).toBeVisible();
});

test("command palette searches real template content", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /search/i }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await dialog.getByPlaceholder(/search templates/i).fill("dockerfile");
  await expect(dialog.getByText("Dockerfile Multi-Stage Optimizer")).toBeVisible();

  await dialog.getByText("Dockerfile Multi-Stage Optimizer").click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Dockerfile Multi-Stage Optimizer" }),
  ).toBeVisible();
});

test("comparing two templates side by side", async ({ page }) => {
  await page.goto("/templates");

  const cards = page.locator("main .grid > *");
  await cards.nth(0).getByRole("button", { name: "Compare" }).click();
  await cards.nth(1).getByRole("button", { name: "Compare" }).click();

  const compareBar = page.getByRole("region", { name: "Template comparison" });
  await expect(compareBar).toBeVisible();
  const compareLink = compareBar.getByRole("link", { name: "Compare" });
  await expect(compareLink).toBeEnabled();

  await compareLink.click();
  await expect(page.getByRole("heading", { level: 1, name: "Compare templates" })).toBeVisible();
  // Two template columns, each with its own "The prompt" section.
  await expect(page.getByRole("heading", { name: "The prompt" })).toHaveCount(2);
});

test("copy prompt button copies the raw template to the clipboard", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "clipboard-read permission is chromium-only");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/templates/cursor/frontend/react-server-components-reviewer");

  await page.getByRole("button", { name: "Copy prompt" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();

  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText).toContain("You are reviewing a Next.js App Router change");
});
