import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteMeta } from '../data/site';
import { withBase } from '../utils/paths';

export async function GET(context) {
  const posts = (await getCollection('posts'))
    .filter((post) => !post.data.draft && !post.data.private && !post.data.archived)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const siteUrl = new URL(import.meta.env.BASE_URL, context.site);

  return rss({
    title: siteMeta.siteName,
    description: siteMeta.siteDescription,
    site: siteUrl,
    customData: '<language>zh-CN</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: withBase(`/articles/${post.slug}/`),
    })),
  });
}
