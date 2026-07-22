import { expect, test } from "@playwright/test";

test("home page renders the hero heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /the world's best ai prompt & ai agent template library/i,
    }),
  ).toBeVisible();
});

test("command palette opens via keyboard shortcut and navigates", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog");

  // Confirm the client component has hydrated (its onClick fires) before
  // trusting a raw keypress — otherwise the shortcut can land before React
  // attaches the keydown listener on a cold `next dev` compile.
  await page.getByRole("button", { name: /search/i }).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.keyboard.press("ControlOrMeta+k");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByPlaceholder(/search templates/i)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("theme toggle switches to dark mode and persists across reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("every primary nav link resolves to a real page", async ({ page }) => {
  await page.goto("/");
  const expectations: Array<[string, string]> = [
    ["Templates", "Templates"],
    ["Categories", "Categories"],
    ["Docs", "Documentation"],
  ];
  for (const [navLabel, heading] of expectations) {
    await page.getByRole("link", { name: navLabel, exact: true }).first().click();
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await page.goBack();
  }
});

test("browsing from Categories to a filtered template list", async ({ page }) => {
  await page.goto("/categories");
  await page.getByRole("link", { name: /backend/i }).click();
  await expect(page).toHaveURL(/\/templates\?category=backend/);
  await expect(page.getByRole("checkbox", { name: /backend/i })).toBeChecked();
});
