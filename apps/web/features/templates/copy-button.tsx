"use client";

import { Button, cn } from "@ai-template/ui";
import { Check, Copy } from "lucide-react";
import * as React from "react";

export function CopyButton({ text, label = "Copy prompt" }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);

  const onClick = React.useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button variant="secondary" onClick={onClick} aria-live="polite">
      {copied ? <Check className={cn("text-[var(--color-brand-600)]")} /> : <Copy />}
      {copied ? "Copied" : label}
    </Button>
  );
}
