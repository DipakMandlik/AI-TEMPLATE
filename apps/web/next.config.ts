import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal workspace packages ship raw TypeScript source; Next needs to
  // run its own compiler over them instead of treating them as prebuilt
  // node_modules.
  transpilePackages: ["@ai-template/ui", "@ai-template/content"],
  // The Playwright webServer (and some CI sandboxes) reach the dev server
  // via 127.0.0.1 rather than localhost.
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [
      {
        // /compare is server-rendered per-request (it reads searchParams),
        // so Next gives it Next's default no-store — but its output is a
        // pure function of the query string against build-time-fixed
        // template data, exactly as cacheable as the statically generated
        // pages, which all get s-maxage=31536000 automatically.
        source: "/compare",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=31536000" }],
      },
    ];
  },
};

export default nextConfig;
