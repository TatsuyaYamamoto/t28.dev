import type { Config } from "@pandacss/dev";

const globalVars: NonNullable<Config["globalVars"]> = {
  "--spacing-px": "1px",
  "--spacing-0": "0",
  "--spacing-1": "0.25rem",
  "--spacing-2": "0.5rem",
  "--spacing-3": "0.75rem",
  "--spacing-4": "1rem",
  "--spacing-5": "1.25rem",
  "--spacing-6": "1.5rem",
  "--spacing-8": "2rem",
  "--spacing-10": "2.5rem",
  "--spacing-12": "3rem",
  "--spacing-16": "4rem",
  "--spacing-20": "5rem",
  "--spacing-24": "6rem",
  "--spacing-32": "8rem",
  "--fontSize-root": "16px",
  "--lineHeight-none": "1",
  "--lineHeight-tight": "1.1",
  "--lineHeight-normal": "1.5",
  "--lineHeight-relaxed": "1.7", // original value -> 1.625
  /* 1.200 Minor Third Type Scale */
  "--fontSize-0": "0.833rem",
  "--fontSize-1": "1rem",
  "--fontSize-2": "1.2rem",
  "--fontSize-3": "1.44rem",
  "--fontSize-4": "1.728rem",
  "--fontSize-5": "2.074rem",
  "--fontSize-6": "2.488rem",
  "--fontSize-7": "2.986rem",

  "--font-family-s-works": "sans-serif",

  "--border-solid-accent": "1px solid var(--color-accent)",
  "--border-solid-transparent": "1px solid transparent",

  "--color-primary": "#005b99",
  "--color-primary-light": "#0a95ef",
  "--color-text": "#2e353f",
  "--color-text-light": "#4f5969",
  "--color-heading": "#1a202c",
  "--color-heading-black": "black",
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
