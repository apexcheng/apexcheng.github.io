import { defineCollection, z } from 'astro:content';
import { categories } from './data/categories';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(categories),
    tags: z.array(z.string()),
    minutes: z.number(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    private: z.boolean().default(false),
  }),
});

export const collections = { posts };
