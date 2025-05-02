import { test, expect } from "@playwright/test";

const pages = [
  { path: "/", name: "t28.dev top page" },
  {
    path: "/blog/render-mermaid-on-astro-site",
    name: "blog post page (example)",
  },
  {
    path: "/blog/render-mermaid-on-astro-site.ogp.png",
    name: "blog post ogp image (example)",
  },
  { path: "/s-works", name: "s-works top page" },
  {
    path: "/s-works/achievement/tokimeki_message",
    name: "s-works achievement page (example)",
  },
];

pages.forEach((target) => {
  test(`${target.name}`, async ({ page }) => {
    await page.goto(target.path);
    await expect(page).toHaveScreenshot({
      fullPage: true,
      timeout: 30_000,
    });
  });
});
