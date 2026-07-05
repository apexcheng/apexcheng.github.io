import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const articlesSource = readFileSync('src/pages/articles/index.astro', 'utf8');
const articleListSource = readFileSync('src/components/ArticleList.astro', 'utf8');
const categorySource = readFileSync('src/pages/articles/category/[category].astro', 'utf8');
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
  });

  it('sorts visible articles by publish date or update date in place', () => {
    expect(articlesSource).toContain('data-sort-option');
    expect(articlesSource).toContain("data-sort-value=\"date\"");
    expect(articlesSource).toContain("data-sort-value=\"updated\"");
    expect(articlesSource).toContain('applySort(currentSort)');
    expect(articlesSource).toContain('currentSort = sortOption.getAttribute');
    expect(articlesSource).toContain('list.appendChild(item)');
    expect(articlesSource).toContain("list.querySelectorAll('[data-article-item]')");
    expect(articleListSource).toContain('data-published-at={post.data.date.valueOf()}');
    expect(articleListSource).toContain('data-updated-at={(post.data.updated ?? post.data.date).valueOf()}');
    expect(contentConfigSource).toContain('updated: z.coerce.date().optional()');
  });
});
