import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

describe('article archiving', () => {
  it('keeps archived articles at their original URLs with a visible status', () => {
    const article = read('src/pages/articles/[...slug].astro');
    expect(article).toContain("!post.data.draft && !post.data.private");
    expect(article).not.toContain("!post.data.draft && !post.data.private && !post.data.archived");
    expect(article).toContain('post.data.archived && <span class="article-pin-badge">已归档</span>');
    expect(article).toContain('post.data.archived && <p class="article-archive-note">');
    expect(read('templates/post.mdx')).toContain('archived: false');
  });

  it('removes archived articles from normal discovery and feeds', () => {
    const files = [
      'src/pages/home-redesign-1.astro',
      'src/pages/home-redesign-2.astro',
      'src/pages/home-redesign-3.astro',
      'src/pages/home-redesign.astro',
      'src/pages/articles/category/[category].astro',
      'src/pages/articles/tag/[tag].astro',
      'src/pages/series/index.astro',
      'src/pages/series/[series].astro',
      'src/pages/rss.xml.ts',
      'src/pages/sitemap.xml.ts',
      'src/components/SiteHeader.astro',
    ];
    for (const path of files) {
      expect(read(path), path).toContain('!post.data.draft && !post.data.private && !post.data.archived');
    }
    expect(read('src/pages/articles/[...slug].astro')).toContain('!item.data.archived');
    expect(read('src/utils/article-reading.ts')).toContain('!post.data.archived');
    expect(read('src/pages/articles/index.astro')).toContain('posts.filter((post) => !post.data.archived)');
  });
});
