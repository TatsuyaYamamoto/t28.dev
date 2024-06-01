import type { Config } from "@pandacss/dev";

const globalVars: NonNullable<Config["globalVars"]> = {
  "--font-family-s-works": "sans-serif",

  "--border-solid-accent": "1px solid var(--color-accent)",
  "--border-solid-transparent": "1px solid transparent",

  "--color-primary": "#005b99",
  "--color-primary-light": "#0a95ef",
  "--color-text": "#2e353f",
  "--color-text-light": "#4f5969",
  "--color-heading": "#1a202c",
  "--color-accent": "#d1dce5",
  "--color-accent-soft": "#e7ecef",
  "--color-post-background": "#fcfcfc",

  "--color-black": "#000000",
  "--colors-white": "#ffffff",

  "--color-s-works": "#ffc69e",
  "--color-twitter": "#1da1f2",
  "--color-github": "#000000",
};

export default globalVars;
