import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteMeta } from '../data/site';

export async function GET(context) {
  const posts = (await getCollection('posts'))
    .filter((post) => !post.data.draft && !post.data.private)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: siteMeta.siteName,
    description: siteMeta.siteDescription,
    site: context.site,
    customData: '<language>zh-CN</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/articles/${post.slug}/`,
    })),
  });
}
