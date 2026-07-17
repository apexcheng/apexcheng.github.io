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
    expect(layoutSource).toContain("href={withBase('/about/')}>关于我</a>");
    expect(layoutSource).not.toContain("withBase('/guides/mdx-content/')");
    expect(layoutSource).not.toContain('>指南</a>');
  });

  it('renders the inline search data and controls in the header', () => {
    expect(layoutSource).toContain("getCollection('posts')");
    expect(layoutSource).toContain('projects.map((project)');
    expect(layoutSource).toContain('data-site-search');
    expect(layoutSource).toContain('data-search-input');
    expect(layoutSource).toContain('data-search-results');
    expect(layoutSource).toContain('data-search-filter');
    expect(layoutSource).toContain('查看全部文章');
    expect(layoutSource).toContain('matches.map(resultHtml)');
    expect(layoutSource).toContain("panel.addEventListener('wheel'");
    expect(globalCssSource).toContain('overscroll-behavior: contain');
  });

  it('keeps the hover path connected between the search button and panel', () => {
    expect(globalCssSource).toMatch(/\.nav-search\s*\{[^}]*height:\s*34px;/s);
    expect(globalCssSource).toMatch(/\.nav-search-panel\s*\{[^}]*top:\s*100%;/s);
    expect(globalCssSource).toMatch(/\.nav-search-panel\s*\{[^}]*padding:\s*4px 0 0;/s);
    expect(globalCssSource).toContain('.nav-search-panel::before');
    expect(globalCssSource).toContain('scaleY(0.92)');
    expect(layoutSource).toContain("search.addEventListener('mouseenter'");
    expect(layoutSource).toContain("search.addEventListener('mouseleave', scheduleClose)");
    expect(layoutSource).toContain('}, 200);');
    expect(globalCssSource).toContain('transform 0.3s cubic-bezier');
    expect(globalCssSource).toMatch(/\.site-header\s*\{[^}]*z-index:\s*100;/s);
  });

  it('keeps switchable themes with visual system as the default', () => {
    expect(layoutSource).toContain("localStorage.getItem('styleTheme')");
    expect(layoutSource).toContain("document.documentElement.dataset.theme = savedTheme === 'dark' ? 'dark' : 'light'");
    expect(layoutSource).toContain("['index', 'classic', 'index-gradient', 'classic-gradient', 'visual-system'].includes(savedStyleTheme)");
    expect(layoutSource).toContain("document.documentElement.dataset.styleTheme = savedStyleTheme || 'visual-system'");
    expect(layoutSource).toContain('data-theme-menu-toggle');
    expect(layoutSource).toContain('data-theme-option');
    expect(layoutSource).toContain('主题');
    expect(layoutSource.indexOf('晨曦手札')).toBeLessThan(layoutSource.indexOf('素笺经典'));
    expect(layoutSource.indexOf('素笺经典')).toBeLessThan(layoutSource.indexOf('晨曦渐变'));
    expect(layoutSource.indexOf('晨曦渐变')).toBeLessThan(layoutSource.indexOf('素笺渐变'));
    expect(layoutSource.indexOf('素笺渐变')).toBeLessThan(layoutSource.indexOf('视觉晶蓝'));
    expect(layoutSource.indexOf('视觉晶蓝')).toBeLessThan(layoutSource.indexOf('玄墨经典'));
    expect(layoutSource).not.toContain('晨曦手札 · 渐变');
    expect(layoutSource).not.toContain('素笺经典 · 渐变');
    expect(layoutSource).not.toContain('秋夜手札');
    expect(layoutSource).not.toContain('data-style-toggle');
    expect(layoutSource).not.toContain('data-theme-toggle');
    expect(globalCssSource).toContain("html[data-style-theme='index']");
    expect(globalCssSource).toContain("html[data-style-theme='index-gradient']");
    expect(globalCssSource).toContain("html[data-style-theme='index-gradient'] body");
    expect(globalCssSource).toContain("html[data-style-theme='classic-gradient']");
    expect(globalCssSource).toContain("html[data-style-theme='classic-gradient'] body");
    expect(globalCssSource).toContain("html[data-style-theme='visual-system']");
    expect(globalCssSource).toContain("html[data-style-theme='visual-system'] body");
    expect(globalCssSource).toContain('--display-font');
    expect(globalCssSource).toContain('linear-gradient(135deg, #ece7d8 0%, #f8f1df 46%, #dfe7d6 100%)');
  });

  it('keeps navigation compatible with the GitHub Pages base path', () => {
    expect(layoutSource).toContain("href={withBase('/')}");
    expect(layoutSource).toContain("href={withBase('/about/')}");
    expect(layoutSource).toContain('href={withBase(siteMeta.rssPath)}');
    expect(layoutSource).not.toMatch(/href=["']\/(?:articles|search|projects|guides|about|rss\.xml)/);
  });

  it('keeps mobile layout rules for the main navigation and article page', () => {
    const pageContentBlock = globalCssSource.match(/\.page-content\s*\{[^}]*\}/s)?.[0] ?? '';
    const articleShellBlock = globalCssSource.match(/\.article-shell\s*\{[^}]*\}/s)?.[0] ?? '';

    expect(pageContentBlock).not.toContain('max-width');
    expect(articleShellBlock).not.toContain('max-width');
    expect(globalCssSource).not.toMatch(/\.search-page\s*\{[^}]*max-width:/s);
    expect(globalCssSource).not.toMatch(/\.narrow-page\s*\{[^}]*max-width:/s);
    expect(globalCssSource).not.toMatch(/\.about-page\s*\{[^}]*max-width:/s);
    expect(globalCssSource).toMatch(/\.article-shell\s*\{[^}]*grid-template-columns:\s*260px minmax\(0,\s*1fr\);/s);
    expect(globalCssSource).toMatch(/\.article-sidebar\s*\{[^}]*display:\s*grid;[^}]*gap:\s*18px;/s);
    expect(globalCssSource).toContain('@media (max-width: 1100px)');
    expect(globalCssSource).toMatch(/\.article-shell\s*\{[^}]*grid-template-columns:\s*1fr;/s);
    expect(globalCssSource).toContain('@media (max-width: 760px)');
    expect(globalCssSource).toMatch(/@media \(max-width: 760px\)[\s\S]*\.site-nav\s*\{[^}]*overflow-x:\s*auto;[^}]*white-space:\s*nowrap;/);
    expect(globalCssSource).toMatch(/@media \(max-width: 1100px\)[\s\S]*\.desktop-article-info\s*\{[^}]*display:\s*none;/);
    expect(globalCssSource).toMatch(/\.article-content\s*\{[^}]*min-width:\s*0;/s);
    expect(globalCssSource).toMatch(/\.hero-grid h1,\s*\.page-title,\s*\.article-content h1\s*\{[^}]*font-size:\s*36px;/s);
    expect(globalCssSource).toMatch(/\.topic-grid,\s*\.project-grid,\s*\.project-page-grid\s*\{[^}]*grid-template-columns:\s*1fr;/s);
  });
});
