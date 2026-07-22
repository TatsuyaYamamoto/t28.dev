import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, getEntry, render } from "astro:content";

import { createJsonLd } from "../_jsonLd";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
  }));
};

export const GET: APIRoute = async ({ params, site }) => {
  if (!params.slug) {
    return new Response("not found");
  }

  const post = await getEntry("blog", params.slug);
  if (!post) {
    return new Response("not found");
  }

  const { remarkPluginFrontmatter } = await render(post);

  const title = post.data.title;
  const description = post.data.description ?? remarkPluginFrontmatter.excerpt;
  const pageUrl = new URL(`/blog/${post.id}`, site).href;
  const ogpImageUrl = new URL(`/blog/${post.id}.ogp.png`, site).href;

  const structuredData = createJsonLd({
    pageUrl,
    post,
    ogpImageUrl,
    description,
  });

  const md = `
---
title: ${title}
description: ${description}
---

> Documentation Index  
> Fetch the complete documentation index at: https://t28.dev/llms.txt  
> Use this file to discover all available pages before exploring further.

${post?.body}

\`\`\`json
${JSON.stringify(structuredData)}
\`\`\`
`.trim();

  return new Response(md);
};
