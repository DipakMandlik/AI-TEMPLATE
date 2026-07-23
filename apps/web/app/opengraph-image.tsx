import { ImageResponse } from "next/og";

// Required for `output: "export"` (GitHub Pages builds) — this route has no
// per-request logic, but Next still needs the explicit opt-in.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        background: "#215cd0",
        color: "white",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>AI-TEMPLATE</div>
      <div style={{ display: "flex", fontSize: 32, opacity: 0.9, maxWidth: 900 }}>
        The world&apos;s best AI Prompt &amp; AI Agent Template Library
      </div>
    </div>,
    { ...size },
  );
}
