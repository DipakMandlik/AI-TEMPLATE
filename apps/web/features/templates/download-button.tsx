"use client";

import { Button } from "@ai-template/ui";
import { Download } from "lucide-react";

export function DownloadButton({ text, filename }: { text: string; filename: string }) {
  const onClick = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="secondary" onClick={onClick}>
      <Download />
      Download
    </Button>
  );
}
