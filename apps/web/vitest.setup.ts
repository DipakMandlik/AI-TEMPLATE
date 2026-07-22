import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";
import { afterEach, expect, vi } from "vitest";

expect.extend(toHaveNoViolations);

// @testing-library/react only auto-registers afterEach(cleanup) when it
// detects test-framework globals; this config doesn't enable `test.globals`.
afterEach(() => cleanup());

// jsdom doesn't implement IntersectionObserver; framer-motion's `whileInView`
// (used by the landing page feature grid) needs it to mount at all.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

// jsdom doesn't implement ResizeObserver either; cmdk (the command palette)
// observes item sizes to manage keyboard-navigable scrolling.
class MockResizeObserver implements ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

vi.stubGlobal("ResizeObserver", MockResizeObserver);

// jsdom doesn't implement scrollIntoView; cmdk calls it to keep the active
// item visible as arrow keys move selection.
Element.prototype.scrollIntoView = () => {};

// jsdom doesn't implement matchMedia; next-themes' ThemeProvider reads it on
// mount to resolve the "system" theme (used by ThemeToggle and CommandMenu).
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
