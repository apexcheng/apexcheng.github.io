import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const contentConfigSource = readFileSync('src/content.config.ts', 'utf8');
const seriesDataSource = readFileSync('src/data/series.ts', 'utf8');
const seriesIndexSource = readFileSync('src/pages/series/index.astro', 'utf8');
const seriesDetailSource = readFileSync('src/pages/series/[series].astro', 'utf8');
const articleDetailSource = readFileSync('src/pages/articles/[...slug].astro', 'utf8');
const layoutSource = readFileSync('src/layouts/SiteLayout.astro', 'utf8');

describe('series feature', () => {
  it('defines series metadata and article frontmatter fields', () => {
    expect(seriesDataSource).toContain("'personal-blog'");
    expect(seriesDataSource).toContain('这个博客是怎么搭起来的');
    expect(contentConfigSource).toContain('series: z.enum(seriesIds).optional()');
    expect(contentConfigSource).toContain('seriesOrder: z.number().int().positive().optional()');
  });

  it('builds a series library and ordered reading route', () => {
    expect(seriesIndexSource).toContain('seriesMetaList');
    expect(seriesIndexSource).toContain('postCount');
    expect(seriesDetailSource).toContain('getStaticPaths');
    expect(seriesDetailSource).toContain('(a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0)');
    expect(seriesDetailSource).toContain('/articles/${post.slug}/');
  });

  it('connects series navigation with article reading', () => {
    expect(layoutSource).toContain("active?: 'home' | 'articles' | 'series' | 'projects' | 'about'");
    expect(layoutSource).toContain('href={withBase(\'/series/\')}>系列</a>');
    expect(articleDetailSource).toContain("active={post.data.series ? 'series' : 'articles'}");
    expect(articleDetailSource).toContain('previousSeriesPost');
    expect(articleDetailSource).toContain('nextSeriesPost');
    expect(articleDetailSource).toContain('已读到最后一篇');
  });
});
