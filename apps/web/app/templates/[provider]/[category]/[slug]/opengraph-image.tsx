import { templates } from "@ai-template/content";
import { PROVIDER_LABELS, type Provider } from "@ai-template/validation";
import { ImageResponse } from "next/og";

// Required for `output: "export"` (GitHub Pages builds) — this route has no
// per-request logic beyond generateStaticParams below.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface PageParams {
  provider: string;
  category: string;
  slug: string;
}

export function generateStaticParams(): PageParams[] {
  return templates.map((t) => ({ provider: t.provider, category: t.category, slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<PageParams> }) {
  const { provider, category, slug } = await params;
  const template = templates.find(
    (t) => t.provider === provider && t.category === category && t.slug === slug,
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#215cd0",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 32, fontWeight: 700, opacity: 0.85 }}>
        AI-TEMPLATE
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>
          {template?.title ?? "Template not found"}
        </div>
        {template ? (
          <div style={{ display: "flex", gap: 16, fontSize: 28, opacity: 0.9 }}>
            <span>{PROVIDER_LABELS[template.provider as Provider]}</span>
            <span>·</span>
            <span style={{ textTransform: "capitalize" }}>{template.category}</span>
            <span>·</span>
            <span style={{ textTransform: "capitalize" }}>{template.difficulty}</span>
          </div>
        ) : null}
      </div>
    </div>,
    { ...size },
  );
}
