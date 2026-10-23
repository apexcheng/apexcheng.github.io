import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { seriesMetaList } from '../src/data/series';
import { parseStageRange } from '../src/utils/series-learning';

const contentConfigSource = readFileSync('src/content.config.ts', 'utf8');
const seriesDataSource = readFileSync('src/data/series.ts', 'utf8');
const seriesIndexSource = readFileSync('src/pages/series/index.astro', 'utf8');
const seriesDetailSource = readFileSync('src/pages/series/[series].astro', 'utf8');
const articleDetailSource = readFileSync('src/pages/articles/[...slug].astro', 'utf8');
const layoutSource = readFileSync('src/layouts/SiteLayout.astro', 'utf8');
const headerSource = readFileSync('src/components/SiteHeader.astro', 'utf8');

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
    expect(headerSource).toContain("{ id: 'articles', label: '文章', path: '/articles/' }");
    expect(headerSource).not.toContain("{ id: 'series', label: '系列', path: '/series/' }");
    expect(headerSource).toContain("active === 'series' && item.id === 'articles'");
    expect(seriesIndexSource).toContain('<ContentViewTabs active="series" />');
    expect(articleDetailSource).toContain("active={post.data.series ? 'series' : 'articles'}");
    expect(articleDetailSource).toContain('previousSeriesPost');
    expect(articleDetailSource).toContain('nextSeriesPost');
    expect(articleDetailSource).toContain('本系列最后一篇');
  });

  it('keeps the approved Excel and Python stage ranges contiguous without duplication', () => {
    const expected = { 'excel-functions': 9, 'python-basics': 11 } as const;
    for (const [id, count] of Object.entries(expected)) {
      const series = seriesMetaList.find((item) => item.id === id);
      expect(series && 'learningStages' in series).toBe(true);
      const numbers = series && 'learningStages' in series
        ? series.learningStages.flatMap((stage) => {
            const { start, end } = parseStageRange(stage.range);
            return Array.from({ length: end - start + 1 }, (_, index) => start + index);
          })
        : [];
      expect(numbers).toEqual(Array.from({ length: count }, (_, i) => i + 1));
    }
    const excel = seriesMetaList.find((item) => item.id === 'excel-functions');
    expect(excel && 'learningStages' in excel && excel.learningStages.map((stage) => stage.range))
      .toEqual(['01–03', '04–06', '07–08', '09']);
  });

  it('reuses the existing series navigation and adds stage anchors and resource shortcuts', () => {
    expect(seriesDetailSource).toContain('parseStageRange(stage.range)');
    expect(seriesDetailSource).toContain('id={stage.anchor}');
    expect(seriesDetailSource).toContain('href={`#${stage.anchor}`}');
    expect(seriesDetailSource).toContain('id="series-resources"');
    expect(seriesDetailSource).toContain('posts.find((post) => post.data.seriesOrder === 11)');
    expect(seriesDetailSource).toContain('/articles/${post.slug}/');
  });
});
