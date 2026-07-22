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
