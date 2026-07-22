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
