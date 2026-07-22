import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      // Pure re-export barrel — no logic to cover.
      exclude: ["src/index.ts"],
      thresholds: {
        statements: 70,
        branches: 90,
        functions: 75,
        lines: 70,
      },
    },
  },
});
