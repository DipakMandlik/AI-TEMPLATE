import { z } from "zod";

/**
 * Every AI tool a template can declare compatibility with. Kept as one flat
 * enum (not a union of "first-class" vs. "other") so every provider is an
 * equal citizen in the schema — the taxonomy gap this project exists to fix
 * (see roadmap.md §3.2 #7).
 */
export const PROVIDERS = [
  "claude-code",
  "cursor",
  "openai",
  "gemini",
  "copilot",
  "windsurf",
  "codex",
  "aider",
  "cline",
  "roo-code",
  "continue-dev",
  "custom",
] as const;

export const providerSchema = z.enum(PROVIDERS);

export type Provider = z.infer<typeof providerSchema>;

export const PROVIDER_LABELS: Record<Provider, string> = {
  "claude-code": "Claude Code",
  cursor: "Cursor",
  openai: "OpenAI",
  gemini: "Gemini",
  copilot: "GitHub Copilot",
  windsurf: "Windsurf",
  codex: "Codex",
  aider: "Aider",
  cline: "Cline",
  "roo-code": "Roo Code",
  "continue-dev": "Continue.dev",
  custom: "Custom Agent",
};
