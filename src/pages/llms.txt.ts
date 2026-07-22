import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const blogCollection = await getCollection("blog");
  const blogPosts = await Promise.all(
    blogCollection.map(async (post) => ({
      url: new URL(`/blog/${post.id}/index.md`, site).href,
      title: post.data.title,
      publishedDate: post.data.date,
    })),
  );
  const sortedPosts = [...blogPosts].sort(
    (a, b) => b.publishedDate.valueOf() - a.publishedDate.valueOf(),
  );
  const sortedPostLinks = sortedPosts.map((post) => {
    return `- [${post.title}](${post.url})`;
  });

  const md = `
# t28.dev

## Blog posts

${sortedPostLinks.join("\n")}

`.trim();

  return new Response(md);
};
