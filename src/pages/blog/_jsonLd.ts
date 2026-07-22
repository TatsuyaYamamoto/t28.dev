import type { CollectionEntry } from "astro:content";
import type { Graph } from "schema-dts";

import { tatsuyaPersonJsonLd } from "../../helpers/structuredData.ts";

export const createJsonLd = (options: {
  pageUrl: string;
  ogpImageUrl: string;
  post: CollectionEntry<"blog">;
  description: string;
}): Graph => {
  const { post, pageUrl, ogpImageUrl, description } = options;

  return {
    "@context": "https://schema.org",
    "@graph": [
      tatsuyaPersonJsonLd,
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        publisher: {
          "@id": tatsuyaPersonJsonLd["@id"],
        },
        datePublished: post.data.date.toISOString(),
        ...(post.data.modified && {
          dateModified: post.data.modified.toISOString(),
        }),
        mainEntity: {
          "@id": `${options.pageUrl}#blogposting`,
        },
      },
      {
        "@type": "BlogPosting",
        "@id": `${options.pageUrl}#blogposting`,
        url: options.pageUrl,
        // Google recommended properties
        // https://developers.google.com/search/docs/appearance/structured-data/article#article-types
        author: {
          "@id": tatsuyaPersonJsonLd["@id"],
        },
        headline: post.data.title,
        datePublished: post.data.date.toISOString(),
        ...(post.data.modified && {
          dateModified: post.data.modified.toISOString(),
        }),
        image: ogpImageUrl,
        // other properties
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        articleSection: post.data.category,
        inLanguage: "ja",
        description,
      },
    ],
  };
};
