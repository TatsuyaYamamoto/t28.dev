/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-astro"],
  overrides: [
    // https://github.com/withastro/prettier-plugin-astro?tab=readme-ov-file#recommended-configuration
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
