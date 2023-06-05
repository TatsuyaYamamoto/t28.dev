import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, getEntry } from "astro:content";

import { getBlogPostOgpImageResponse } from "../../../components/OgpImage";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
  }));
};

export const get: APIRoute = async ({ params }) => {
  if (!params.slug) {
    return { body: "not found", encoding: "utf8" };
  }

  const post = await getEntry("blog", params.slug);

  return getBlogPostOgpImageResponse({
    title: post?.data.title ?? "No title",
  });
};
