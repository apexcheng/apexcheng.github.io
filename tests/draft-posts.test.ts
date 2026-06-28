import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const schemaSource = readFileSync('src/content.config.ts', 'utf8');
const homeSource = readFileSync('src/pages/index.astro', 'utf8');
const articlesSource = readFileSync('src/pages/articles/index.astro', 'utf8');
const articleDetailSource = readFileSync('src/pages/articles/[...slug].astro', 'utf8');
const rssSource = readFileSync('src/pages/rss.xml.ts', 'utf8');
const pageSources = [homeSource, articlesSource, articleDetailSource, rssSource];
const templateSource = readFileSync('templates/post.mdx', 'utf8');

describe('draft and private posts', () => {
  it('supports draft and private frontmatter with false defaults', () => {
    expect(schemaSource).toContain('draft: z.boolean().default(false)');
    expect(schemaSource).toContain('private: z.boolean().default(false)');
  });

  it('filters draft posts from public article entry points', () => {
    for (const source of pageSources) {
      expect(source).toContain('!post.data.draft');
    }
  });

  it('filters private posts from public article entry points', () => {
    for (const source of pageSources) {
      expect(source).toContain('!post.data.private');
    }
  });

  it('does not fetch backend APIs from static Astro pages', () => {
    for (const source of pageSources) {
      expect(source).not.toContain('fetch(');
    }
  });

  it('keeps new article templates unpublished by default', () => {
    expect(templateSource).toContain('draft: true');
    expect(templateSource).toContain('private: false');
  });
});
