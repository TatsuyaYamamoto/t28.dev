import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    resolve: {
      // https://www.eliostruyf.com/symlink-content-astro-portability/
      preserveSymlinks: true,
    },
  },
});
