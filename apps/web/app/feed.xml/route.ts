import { templates } from "@ai-template/content";
import { SITE_URL } from "../../lib/site";

// Required for `output: "export"` (GitHub Pages builds) — without it, Next
// refuses to include a Route Handler in a static export even though this
// one has no per-request logic at all (see feed.xml/route.ts's GET below).
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const sorted = [...templates].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const items = sorted
    .map((template) => {
      const url = `${SITE_URL}/templates/${template.provider}/${template.category}/${template.slug}`;
      return `
    <item>
      <title>${escapeXml(template.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(template.description)}</description>
      <pubDate>${new Date(template.updatedAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AI-TEMPLATE</title>
    <link>${SITE_URL}</link>
    <description>The world's best AI Prompt &amp; AI Agent Template Library — new and updated templates.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=31536000",
    },
  });
}
