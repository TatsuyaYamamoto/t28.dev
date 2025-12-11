import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";
import svgr from "vite-plugin-svgr";

import { inferDescriptionMetaPlugin } from "./src/plugins/inferDescriptionMetaPlugin";

export default defineConfig({
  site: "https://t28.dev",
  // **開発サーバー** のルーティングを合わせる動作の設定をします
  trailingSlash: "ignore",
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid"],
    },
    shikiConfig: {
      theme: "github-light",
    },
    rehypePlugins: [inferDescriptionMetaPlugin, rehypeMermaid],
    remarkRehype: {
      footnoteLabelProperties: {
        className: [
          // 'sr-only'
        ],
      },
    },
  },
  build: {
    format: "file",
  },
  vite: {
    plugins: [svgr(), tailwindcss()],
    optimizeDeps: {
      exclude: [
        // https://github.com/withastro/astro/issues/9722
        "mind-ar",
      ],
    },
  },
});
