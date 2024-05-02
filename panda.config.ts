import { defineConfig } from "@pandacss/dev";

import globalCss from "./src/styles/globalStyles.ts";
import globalVars from "./src/styles/globalVars.ts";
import { keyframes } from "./src/styles/keyframes";

export default defineConfig({
  jsxFramework: "react",

  // Whether to use css reset
  preflight: false,

  // Where to look for your css declarations
  include: [
    "./src/**/*.{ts,tsx,js,jsx,astro}",
    "./pages/**/*.{ts,tsx,js,jsx,astro}",
  ],

  strictTokens: true,
  strictPropertyValues: true,

  globalVars,
  globalCss,

  // Useful for theme customization
  theme: {
    extend: {
      keyframes,
    },
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
});
