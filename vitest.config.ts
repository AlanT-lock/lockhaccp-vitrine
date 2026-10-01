import { defineConfig } from "vitest/config";
import path from "path";
import { articles } from "./scripts/blog/plugin-articles.mjs";

export default defineConfig({
  plugins: [articles()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: { environment: "node", include: ["src/**/*.test.ts", "scripts/**/*.test.mjs"] },
});
