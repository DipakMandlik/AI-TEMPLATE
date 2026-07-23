import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["**/*.test.tsx", "**/*.test.ts"],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "features/**/*.{ts,tsx}"],
      exclude: [
        "**/__tests__/**",
        // Next.js route/layout Server Components and metadata-route
        // conventions (sitemap, robots, RSS, OG/Twitter/favicon images) —
        // exercised by Playwright e2e and manual verification against a
        // real build, not unit-testable the way plain components are.
        "app/**/page.tsx",
        "app/**/layout.tsx",
        "app/**/sitemap.ts",
        "app/**/robots.ts",
        "app/**/opengraph-image.tsx",
        "app/**/twitter-image.tsx",
        "app/favicon.png/route.tsx",
        "app/apple-touch-icon.png/route.tsx",
        "app/feed.xml/route.ts",
        // Thin MDX runtime + presentational shell components, exercised by
        // e2e on every real page (every route renders the header/footer;
        // every template/doc page renders MdxContent).
        "components/mdx-content.tsx",
        "components/site-header.tsx",
        "components/site-footer.tsx",
        "features/docs/docs-nav.tsx",
        // Orchestrates the already-unit-tested facet/compare/search pieces;
        // covered end-to-end by the golden-path and comparison e2e specs.
        "features/templates/templates-explorer.tsx",
        // Client-Component render shell for /compare (searchParams read +
        // JSX) — the resolveTemplates/compare logic it uses is already unit
        // tested (compare.ts); this file itself is covered by the e2e
        // comparison flow spec.
        "features/templates/compare-view.tsx",
      ],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 75,
        lines: 85,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
