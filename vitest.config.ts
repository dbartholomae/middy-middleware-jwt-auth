import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: [
      "src/**/*.{test,spec}.{ts,tsx,js,jsx}",
    ],
    environment: "node",
    coverage: {
      enabled: true,
      provider: "v8",
      reportsDirectory: "coverage",
      reporter: ["text", "lcov"],
      all: true,
      include: ["src/**/*"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
