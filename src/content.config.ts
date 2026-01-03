import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./docs/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    modified: z.date().optional(),
    category: z.string().default("Tech"),
  }),
});

const sWorksAchievement = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./docs/s-works-achievement" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      description: z.string(),
      project: z.union([
        z.literal("ラブライブ！シリーズ"),
        z.literal("ラブライブ！虹ヶ咲学園スクールアイドル同好会"),
        z.literal("こどものままでもママになりたい！"),
      ]),
      heroImage: image(),
      links: z
        .object({
          label: z.string(),
          href: z.string(),
          type: z.union([z.literal("twitter"), z.literal("external")]),
        })
        .array(),
    }),
});

export const collections = {
  blog,
  ["s-works-achievement"]: sWorksAchievement,
};
