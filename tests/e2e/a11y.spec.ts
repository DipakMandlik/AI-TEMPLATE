import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Scans every real route for axe-core violations. Serious/critical
 * violations fail the build outright; anything less isn't asserted here so
 * this stays a hard accessibility gate rather than a style-preference lint.
 */
const ROUTES = [
  "/",
  "/templates",
  "/templates/cursor/frontend/react-server-components-reviewer",
  "/categories",
  "/docs",
  "/docs/getting-started",
  "/compare",
  "/compare?compare=claude-code/backend/rest-api-error-handling-reviewer,claude-code/documentation/api-reference-generator",
];

for (const route of ROUTES) {
  test(`${route} has no serious or critical accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrCritical = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );
    expect(
      seriousOrCritical,
      seriousOrCritical
        .map(
          (v) =>
            `${v.id}: ${v.description}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`,
        )
        .join("\n\n"),
    ).toEqual([]);
  });
}
