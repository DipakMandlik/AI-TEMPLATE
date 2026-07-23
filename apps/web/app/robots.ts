import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

// Required for `output: "export"` (GitHub Pages builds) — this route has no
// per-request logic, but Next still needs the explicit opt-in.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The dev component-preview route is a dogfooding tool, not content.
      disallow: "/dev/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
