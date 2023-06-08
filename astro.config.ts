import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import svgr from "vite-plugin-svgr";

import { inferDescriptionMetaPlugin } from "./src/plugins/inferDescriptionMetaPlugin";

export default defineConfig({
  site: "https://t28.dev",
  trailingSlash: "always",
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    rehypePlugins: [inferDescriptionMetaPlugin],
  },
  vite: {
    plugins: [svgr()],
    resolve: {
      // https://www.eliostruyf.com/symlink-content-astro-portability/
      preserveSymlinks: true,
    },
  },
  experimental: {
    assets: true,
  },
});
