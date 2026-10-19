import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const rssPath = 'src/pages/rss.xml.ts';
const layoutSource = readFileSync('src/layouts/SiteLayout.astro', 'utf8');

describe('rss feed', () => {
  it('defines a static rss route from public posts only', () => {
    expect(existsSync(rssPath)).toBe(true);

    const rssSource = readFileSync(rssPath, 'utf8');
    expect(rssSource).toContain("getCollection('posts')");
    expect(rssSource).toContain('!post.data.draft');
    expect(rssSource).toContain('!post.data.private');
    expect(rssSource).toContain('@astrojs/rss');
    expect(rssSource).toContain('new URL(import.meta.env.BASE_URL, context.site)');
  });

  it('advertises rss in the shared document head', () => {
    expect(layoutSource).toContain('type="application/rss+xml"');
    expect(layoutSource).toContain('withBase(siteMeta.rssPath)');
  });
});
