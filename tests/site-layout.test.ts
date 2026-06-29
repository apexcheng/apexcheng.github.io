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
    expect(layoutSource).toContain("withBase('/articles/')");
    expect(layoutSource).toContain("withBase('/search/')");
    expect(layoutSource).toContain("withBase('/projects/')");
    expect(layoutSource).toContain("withBase('/guides/mdx-content/')");
  });

  it('keeps navigation compatible with the GitHub Pages base path', () => {
    expect(layoutSource).toContain("href={withBase('/')}");
    expect(layoutSource).toContain("href={withBase('/about/')}");
    expect(layoutSource).toContain('href={withBase(siteMeta.rssPath)}');
    expect(layoutSource).not.toMatch(/href=["']\/(?:articles|search|projects|guides|about|rss\.xml)/);
  });

  it('keeps mobile layout rules for the main navigation and article page', () => {
    expect(globalCssSource).toMatch(/\.article-shell\s*\{[^}]*max-width:\s*1680px;/s);
    expect(globalCssSource).toMatch(/\.article-shell\s*\{[^}]*grid-template-columns:\s*260px minmax\(0,\s*1040px\);/s);
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
