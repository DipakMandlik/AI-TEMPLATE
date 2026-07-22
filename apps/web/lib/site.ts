/**
 * Canonical origin for absolute URLs (metadataBase, sitemap, RSS, OG images).
 * Override with NEXT_PUBLIC_SITE_URL when deploying to a real domain — see
 * content/docs/deployment.mdx.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-template.dev";
