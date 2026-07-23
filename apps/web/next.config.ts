import type { NextConfig } from "next";

// Set only by .github/workflows/deploy-pages.yml — GitHub Pages serves a
// project site (not a custom domain) from https://<owner>.github.io/<repo>/,
// so the app needs a basePath and a fully static (server-free) build. Every
// other deployment target (Vercel, self-host — see
// content/docs/deployment.mdx) keeps the default server build.
const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
const basePath = "/AI-TEMPLATE";

const nextConfig: NextConfig = {
  // Internal workspace packages ship raw TypeScript source; Next needs to
  // run its own compiler over them instead of treating them as prebuilt
  // node_modules.
  transpilePackages: ["@ai-template/ui", "@ai-template/content"],
  // The Playwright webServer (and some CI sandboxes) reach the dev server
  // via 127.0.0.1 rather than localhost.
  allowedDevOrigins: ["127.0.0.1"],
  ...(isGithubPagesBuild ? { output: "export", basePath, assetPrefix: basePath } : {}),
  // Exposed to client code for the handful of plain `<a>` tags that link to
  // Route Handlers (e.g. /feed.xml) rather than pages — next/link would
  // auto-prefix basePath, but those must stay plain anchors so the browser
  // does a full navigation instead of an RSC prefetch against a non-page.
  env: { NEXT_PUBLIC_BASE_PATH: isGithubPagesBuild ? basePath : "" },
};

export default nextConfig;
