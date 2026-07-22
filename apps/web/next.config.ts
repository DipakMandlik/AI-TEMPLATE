import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal workspace packages ship raw TypeScript source; Next needs to
  // run its own compiler over them instead of treating them as prebuilt
  // node_modules.
  transpilePackages: ["@ai-template/ui"],
  // The Playwright webServer (and some CI sandboxes) reach the dev server
  // via 127.0.0.1 rather than localhost.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
