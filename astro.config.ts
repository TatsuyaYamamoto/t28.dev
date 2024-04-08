import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import svgr from "vite-plugin-svgr";

import { inferDescriptionMetaPlugin } from "./src/plugins/inferDescriptionMetaPlugin";
import { mermaidRemarkPlugin } from "./src/plugins/mermaidRemarkPlugin.ts";

export default defineConfig({
  site: "https://t28.dev",
  // **開発サーバー** のルーティングを合わせる動作の設定をします
  trailingSlash: "ignore",
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
    rehypePlugins: [inferDescriptionMetaPlugin],
    remarkPlugins: [mermaidRemarkPlugin],
  },
  vite: {
    plugins: [svgr()],
    resolve: {
      // https://www.eliostruyf.com/symlink-content-astro-portability/
      preserveSymlinks: true,
    },
  },
});
