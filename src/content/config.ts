import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
  }),
});

export const collections = {
  blog,
};
