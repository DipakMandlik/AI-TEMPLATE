import { ImageResponse } from "next/og";

// Served at an explicit path (not the `apple-icon` file convention) because
// Next's auto-generated favicon <link> href isn't basePath-prefixed under
// `output: "export"` — see the manual `icons` entry in app/layout.tsx, which
// resolves against `metadataBase` (already basePath-aware) instead.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#215cd0",
        color: "white",
        fontSize: 108,
        fontWeight: 700,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      A
    </div>,
    { width: 180, height: 180 },
  );
}
