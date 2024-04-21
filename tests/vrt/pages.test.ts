import { test, expect } from "@playwright/test";

const pages = [
  { path: "/", name: "IndexPage" },
  { path: "/blog/render-mermaid-on-astro-site", name: "BlogPostSample" },
];

pages.forEach((target) => {
  test(`${target.name}`, async ({ page }) => {
    await page.goto(target.path);
    await expect(page).toHaveScreenshot({
      fullPage: true,
    });
  });
});
