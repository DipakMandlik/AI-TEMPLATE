import { docs, templates } from "@ai-template/content";
import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/templates`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/docs`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const templateRoutes: MetadataRoute.Sitemap = templates.map((template) => ({
    url: `${SITE_URL}/templates/${template.provider}/${template.category}/${template.slug}`,
    lastModified: template.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const docRoutes: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: `${SITE_URL}/docs/${doc.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...templateRoutes, ...docRoutes];
}
