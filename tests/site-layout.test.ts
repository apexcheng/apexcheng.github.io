import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const layoutSource = readFileSync('src/layouts/SiteLayout.astro', 'utf8');
const globalCssSource = readFileSync('src/styles/global.css', 'utf8');

describe('site layout', () => {
  it('keeps shared site metadata as the personal blog brand', () => {
    expect(layoutSource).toContain('siteMeta.siteName');
    expect(layoutSource).toContain('${siteMeta.siteName} 首页');
  });

  it('links the primary static pages from the main navigation', () => {
    expect(layoutSource).toContain("href={withBase('/')}>首页</a>");
    expect(layoutSource).toContain("withBase('/articles/')");
    expect(layoutSource).toContain("withBase('/projects/')");
    expect(layoutSource).toContain('data-search-toggle>搜索</button>');
    expect(layoutSource).toContain('href={withBase(siteMeta.rssPath)}>RSS</a>');
    expect(layoutSource).toContain("href={withBase('/about/')}>关于</a>");
    expect(layoutSource).not.toContain("withBase('/guides/mdx-content/')");
    expect(layoutSource).not.toContain('>指南</a>');
  });

  it('renders the inline search data and controls in the header', () => {
    expect(layoutSource).toContain("getCollection('posts')");
    expect(layoutSource).toContain('projects.map((project)');
    expect(layoutSource).toContain('data-site-search');
    expect(layoutSource).toContain('data-search-input');
    expect(layoutSource).toContain('data-search-results');
  });

  it('keeps the hover path connected between the search button and panel', () => {
    expect(globalCssSource).toMatch(/\.nav-search\s*\{[^}]*height:\s*34px;/s);
    expect(globalCssSource).toMatch(/\.nav-search-panel\s*\{[^}]*top:\s*100%;/s);
    expect(globalCssSource).toMatch(/\.nav-search-panel\s*\{[^}]*padding:\s*4px 0 0;/s);
    expect(globalCssSource).toContain('.nav-search-panel::before');
  });

  it('keeps navigation compatible with the GitHub Pages base path', () => {
    expect(layoutSource).toContain("href={withBase('/')}");
    expect(layoutSource).toContain("href={withBase('/about/')}");
    expect(layoutSource).toContain('href={withBase(siteMeta.rssPath)}');
    expect(layoutSource).not.toMatch(/href=["']\/(?:articles|search|projects|guides|about|rss\.xml)/);
  });

  it('keeps mobile layout rules for the main navigation and article page', () => {
    expect(globalCssSource).toMatch(/\.article-shell\s*\{[^}]*grid-template-columns:\s*260px minmax\(0,\s*920px\);/s);
    expect(globalCssSource).toMatch(/\.article-sidebar\s*\{[^}]*display:\s*grid;[^}]*gap:\s*18px;/s);
    expect(globalCssSource).toContain('@media (max-width: 1100px)');
    expect(globalCssSource).toMatch(/\.article-shell\s*\{[^}]*grid-template-columns:\s*1fr;/s);
    expect(globalCssSource).toContain('@media (max-width: 760px)');
    expect(globalCssSource).toMatch(/\.site-nav\s*\{[^}]*display:\s*none;/s);
    expect(globalCssSource).toMatch(/@media \(max-width: 1100px\)[\s\S]*\.desktop-article-info\s*\{[^}]*display:\s*none;/);
    expect(globalCssSource).toMatch(/\.article-content\s*\{[^}]*min-width:\s*0;/s);
    expect(globalCssSource).toMatch(/\.hero-grid h1,\s*\.page-title,\s*\.article-content h1\s*\{[^}]*font-size:\s*36px;/s);
    expect(globalCssSource).toMatch(/\.topic-grid,\s*\.project-grid,\s*\.project-page-grid\s*\{[^}]*grid-template-columns:\s*1fr;/s);
  });
});
