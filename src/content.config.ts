import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['AI Agent', '影刀RPA', 'Skill', '数据处理']),
    tags: z.array(z.string()),
    minutes: z.number(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    private: z.boolean().default(false),
  }),
});

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

export const collections = { posts, docs };
