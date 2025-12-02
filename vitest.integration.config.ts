import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["examples/**/*.int-{test,spec}.{ts,tsx,js,jsx}"],
    environment: "node",
    coverage: {
      enabled: false,
    },
  },
});
