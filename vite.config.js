import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  test: {
    exclude: ["e2etests/**", "node_modules/**"],
    globals: true,
    // ui: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["html"],
      reportsDirectory: "./coverage",
    },
  },
  plugins: [tailwindcss()],
});
