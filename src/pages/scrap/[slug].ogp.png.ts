import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, getEntry } from "astro:content";

import { getBlogPostOgpImageResponse } from "../../components/OgpImage";

export const getStaticPaths: GetStaticPaths = async () => {
  const collection = await getCollection("scrap");
  return collection.map((post) => ({
    params: { slug: post.slug },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  if (!params.slug) {
    return new Response("not found");
  }

  const post = await getEntry("scrap", params.slug);

  return getBlogPostOgpImageResponse({
    title: post?.data.title ?? "No title",
  });
};
