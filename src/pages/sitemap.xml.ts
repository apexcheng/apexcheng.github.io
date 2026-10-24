import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { categoryMetaList } from '../data/categories';
import { projects, projectPath } from '../data/projects';
import { seriesMetaList } from '../data/series';

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Missing Astro site configuration for sitemap');
  const posts = (await getCollection('posts')).filter((post) => !post.data.draft && !post.data.private && !post.data.archived);
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];
  const paths = [
    '/', '/articles/', '/series/', '/projects/', '/about/',
    ...categoryMetaList.map((category) => `/articles/category/${encodeURIComponent(category.name)}/`),
    ...tags.map((tag) => `/articles/tag/${encodeURIComponent(tag)}/`),
    ...posts.map((post) => `/articles/${post.slug}/`),
    ...seriesMetaList.map((series) => `/series/${series.id}/`),
    ...projects.map(projectPath),
  ];
  const urls = [...new Set(paths)].sort().map((path) => new URL(path, site).href);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${url.replaceAll('&', '&amp;')}</loc></url>`),
    '</urlset>',
  ].join('\n');
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
