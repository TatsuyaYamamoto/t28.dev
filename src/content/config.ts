import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    category: z.string().default("Tech"),
  }),
});

const roundup = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

const sWorksAchievement = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
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
  roundup,
  ["s-works-achievement"]: sWorksAchievement,
};
