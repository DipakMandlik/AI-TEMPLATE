import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";
import { afterEach, expect, vi } from "vitest";

expect.extend(toHaveNoViolations);

// @testing-library/react only auto-registers afterEach(cleanup) when it
// detects test-framework globals; this config doesn't enable `test.globals`.
afterEach(() => cleanup());

// jsdom doesn't implement matchMedia; next-themes' ThemeProvider (used by
// ThemeToggle) reads it on mount to resolve the "system" theme.
vi.stubGlobal(
  "matchMedia",
  vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
);
