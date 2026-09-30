// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://zaemyung.github.io",
  trailingSlash: "ignore",
  integrations: [sitemap()],
  build: { format: "directory" },
  markdown: { shikiConfig: { themes: { light: "github-light", dark: "github-dark" } } },
});
