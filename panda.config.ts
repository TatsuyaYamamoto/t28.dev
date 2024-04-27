import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: false,

  // Where to look for your css declarations
  include: [
    "./src/**/*.{ts,tsx,js,jsx,astro}",
    "./pages/**/*.{ts,tsx,js,jsx,astro}",
  ],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },
  patterns: {
    extend: {
      container: {
        transform(props) {
          const pandaDefault = {
            position: "relative",
            maxWidth: "8xl",
            mx: "auto",
            px: { base: "4", md: "6", lg: "8" },
            ...props,
          };

          return {
            ...pandaDefault,
            maxWidth: "1200px",
            mx: "auto",
            px: "var(--spacing-4)",
          };
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
