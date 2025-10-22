import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

export const GET: APIRoute = async (context) => {
  if (!context.site) {
    throw new Error(`"context.site" is not defined.`);
  }

  const posts = await getCollection("blog");

  const rssFeedItems = await Promise.all(
    posts.map(async ({ body, slug, data: { title, description, date } }) => {
      const html = await marked.parse(body);

      return {
        title,
        description,
        pubDate: date,
        content: DOMPurify.sanitize(html),
        link: `/blog/${slug}/`,
      } satisfies RSSFeedItem;
    }),
  );

  // Sort items by pubDate in descending order
  rssFeedItems.sort((a, b) => {
    return b.pubDate.getTime() - a.pubDate.getTime();
  });

  return rss({
    title: "t28.dev",
    description: "t28's blog",
    site: context.site,
    items: rssFeedItems,
    // https://www.rssboard.org/rss-language-codes
    customData: `<language>ja</language>`,
    // https://docs.astro.build/ja/guides/rss/#%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E3%82%B7%E3%83%BC%E3%83%88%E3%81%AE%E8%BF%BD%E5%8A%A0
    stylesheet: "/rss/styles.xsl",
  });
};
