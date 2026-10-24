import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { formatPostDate } from '../src/utils/dates';

const articlesSource = readFileSync('src/pages/articles/index.astro', 'utf8');
const articleListSource = readFileSync('src/components/ArticleList.astro', 'utf8');
const articlePageSource = readFileSync('src/pages/articles/[...slug].astro', 'utf8');
const categorySource = readFileSync('src/pages/articles/category/[category].astro', 'utf8');
const tabsSource = readFileSync('src/components/ContentViewTabs.astro', 'utf8');
const contentConfigSource = readFileSync('src/content.config.ts', 'utf8');

describe('articles page category filter', () => {
  it('filters categories inside the articles page while keeping category archives', () => {
    expect(articlesSource).toContain('data-category-filter');
    expect(articlesSource).toContain('?category=${encodeURIComponent(category.name)}');
    expect(articlesSource).toContain('URLSearchParams(window.location.search)');
    expect(articlesSource).toContain('history.replaceState');
    expect(articlesSource).not.toContain('/articles/category/${encodeURIComponent(category.name)}/');
    expect(articleListSource).toContain('data-article-list');
    expect(articleListSource).toContain('data-article-item');
    expect(articleListSource).toContain('data-category={post.data.category}');
    expect(categorySource).toContain('getStaticPaths');
    expect(articlesSource).toContain('!post.data.draft && !post.data.private');
    expect(articlesSource).toContain("includeSeries || !item.getAttribute('data-series')");
    expect(articlesSource).toContain('(!category || itemCategory === category)');
    expect(articlesSource).toContain('terms.every');
    expect(articlesSource).toContain('data-articles-search');
    expect(articlesSource).toContain("searchInput.addEventListener('input'");
    expect(articlesSource).toContain("url.searchParams.set('q', query)");
    expect(articleListSource).toContain('data-search-text=');
    expect(articlesSource).toContain("post.data.category !== '视觉实验室'");
    expect(articlesSource).toContain("(category === '视觉实验室' || itemCategory !== '视觉实验室')");
    expect(articlesSource).toContain('standaloneOfficialPosts.length');
    expect(articlesSource).toContain('activePosts.filter((post) => !post.data.series)');
    expect(articlesSource).toContain('<ArticleList posts={posts} hideSeries hideVisualLab showPinned inlineMeta />');
    expect(articleListSource).toContain("data-series={post.data.series ?? ''}");
    expect(articleListSource).toContain('(hideSeries && post.data.series)');
  });

  it('defaults to independent articles with a separate series tab and supports legacy series links', () => {
    expect(tabsSource).toContain('独立文章');
    expect(tabsSource).toContain('专题系列');
    expect(articlesSource).not.toContain('data-include-series');
    expect(articlesSource).toContain('data-count-standalone');
    expect(articlesSource).toContain('data-count-all');
    expect(articlesSource).toContain("includeSeries = new URLSearchParams(window.location.search).get('series') === '1'");
    expect(articlesSource).toContain("url.searchParams.set('series', '1')");
    expect(articlesSource).toContain("includeSeries = false;");
    expect(articlesSource).toContain('item.hidden = !isVisible');
  });

  it('filters featured articles using the existing metadata and composes with other filters', () => {
    expect(contentConfigSource).toContain('featured: z.boolean().default(false)');
    expect(articleListSource).toContain("data-featured={post.data.featured ? 'true' : 'false'}");
    expect(articlesSource).toContain('data-featured-only');
    expect(articlesSource).toContain('只看精选');
    expect(articlesSource).toContain("(!featuredOnly || item.getAttribute('data-featured') === 'true')");
    expect(articlesSource).toContain("(!category || itemCategory === category)");
    expect(articlesSource).toContain('terms.every');
    expect(articlesSource).toContain("featuredOnlyButton.addEventListener('click'");
    expect(articlesSource).toContain("featuredOnlyButton.setAttribute('aria-pressed'");
    expect(articlesSource).toContain("url.searchParams.set('featured', '1')");
    expect(articlesSource).toContain("url.searchParams.delete('featured')");
    expect(articlesSource).toContain("get('featured') === '1'");
    expect(articlesSource).toContain('applySort(currentSort)');
  });

  it('hides archived posts by default but includes them on demand without losing filter state', () => {
    expect(contentConfigSource).toContain('archived: z.boolean().default(false)');
    expect(articleListSource).toContain("data-archived={post.data.archived ? 'true' : 'false'}");
    expect(articlesSource).toContain('data-include-archived');
    expect(articlesSource).toContain('包含已归档');
    expect(articlesSource).toContain("(includeArchived || item.getAttribute('data-archived') !== 'true')");
    expect(articlesSource).toContain("get('archived') === '1'");
    expect(articlesSource).toContain("url.searchParams.set('archived', '1')");
    expect(articlesSource).toContain("url.searchParams.delete('archived')");
    expect(articlesSource).toContain("includeArchivedInput.addEventListener('change'");
    expect(articlesSource).toContain('data-count-all-archived');
    expect(articlesSource).toContain('data-count-standalone-archived');
    expect(articleListSource).toContain('已归档');
  });

  it('sorts visible articles by publish date or update date in place', () => {
    expect(articlesSource).toContain('data-sort-menu');
    expect(articlesSource).toContain('data-sort-label');
    expect(articlesSource).toContain('data-sort-option data-sort-value="date"');
    expect(articlesSource).toContain('data-sort-option data-sort-value="updated"');
    expect(articlesSource).not.toContain('<select');
    expect(articlesSource).toContain('applySort(currentSort)');
    expect(articlesSource).toContain("currentSort = option.getAttribute('data-sort-value')");
    expect(articlesSource).toContain("sortMenu.addEventListener('keydown'");
    expect(articlesSource).toContain("event.key === 'Escape'");
    expect(articlesSource).toContain('list.appendChild(item)');
    expect(articlesSource).toContain("list.querySelectorAll('[data-article-item]')");
    expect(articleListSource).toContain('data-published-at={post.data.date.valueOf()}');
    expect(articleListSource).toContain('data-updated-at={(post.data.updated ?? post.data.date).valueOf()}');
    expect(contentConfigSource).toContain('updated: z.coerce.date().optional()');
  });

  it('keeps pinned articles ahead of the selected time sort', () => {
    expect(contentConfigSource).toContain('pinned: z.boolean().default(false)');
    expect(articleListSource).toContain("data-pinned={post.data.pinned ? 'true' : 'false'}");
    expect(articleListSource).toContain('showPinned && post.data.pinned');
    expect(articlesSource).toContain('Number(b.data.pinned) - Number(a.data.pinned)');
    expect(articlesSource).toContain("b.getAttribute('data-pinned') === 'true'");
  });

  it('keeps timestamp precision for sorting while rendering date-only values', () => {
    expect(articleListSource).toContain('formatPostDate(post.data.date)');
    expect(articleListSource).toContain('formatPostDate(post.data.updated ?? post.data.date)');
    expect(articlesSource).toContain("time.getAttribute('data-date-kind') !== sortValue");
    expect(articlePageSource).toContain('formatPostDate(post.data.date)');
    expect(articlePageSource).toContain('formatPostDate(post.data.updated ?? post.data.date)');
    expect(formatPostDate(new Date('2026-07-09T00:30:00+08:00'))).toBe('2026-07-09');
  });

  it('keeps article metadata in reading order and a clear reset action', () => {
    expect(articleListSource).toContain('inlineMeta &&');
    expect(articleListSource).toContain('article-list-heading-meta');
    expect(articlesSource).toContain('data-clear-article-filters');
    expect(articlesSource).toContain("clearFiltersButton.addEventListener('click'");
    expect(articlesSource).toContain('data-more-filters');
  });
});
