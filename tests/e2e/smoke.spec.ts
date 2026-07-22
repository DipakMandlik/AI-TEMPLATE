import { expect, test } from "@playwright/test";

test("home page renders the AI-TEMPLATE heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "AI-TEMPLATE" })).toBeVisible();
});
