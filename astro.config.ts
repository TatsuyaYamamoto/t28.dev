import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://t28.dev",
  integrations: [react(), sitemap()],
  vite: {
    resolve: {
      // https://www.eliostruyf.com/symlink-content-astro-portability/
      preserveSymlinks: true,
    },
  },
});
