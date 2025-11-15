import { defineConfig } from "@pandacss/dev";

import globalVars from "./src/styles/globalVars.ts";
import { keyframes } from "./src/styles/keyframes";
import { container } from "./src/styles/patterns.ts";

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

  // Useful for theme customization
  theme: {
    extend: {
      keyframes,
    },
  },

  patterns: {
    extend: {
      container,
    },
  },
});
