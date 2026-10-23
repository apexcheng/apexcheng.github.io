import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const layout = readFileSync('src/layouts/SiteLayout.astro', 'utf8');
const header = readFileSync('src/components/SiteHeader.astro', 'utf8');
const footer = readFileSync('src/components/SiteFooter.astro', 'utf8');
const shellCss = readFileSync('src/styles/site-shell.css', 'utf8');
const globalCss = readFileSync('src/styles/global.css', 'utf8');
const intro = readFileSync('src/components/HomeIntroState.astro', 'utf8');

describe('shared site shell', () => {
  it('uses the same brand, navigation, search and footer on home and content pages', () => {
    expect(layout).toContain('<SiteHeader active={active} />');
    expect(layout).toContain('<SiteFooter />');
    expect(header).toContain('${siteMeta.siteName} 首页');
    for (const path of ['/', '/articles/', '/projects/', '/about/']) {
      expect(header).toContain(`path: '${path}'`);
    }
    expect(header).toContain('href={withBase(item.path)}');
    expect(header).toContain("active === 'series' && item.id === 'articles'");
    const tabs = readFileSync('src/components/ContentViewTabs.astro', 'utf8');
    expect(tabs).toContain("withBase('/articles/')");
    expect(tabs).toContain("withBase('/series/')");
    expect(footer).toContain('href={withBase(siteMeta.rssPath)}');
    expect(footer).toContain('siteMeta.githubUrl');
  });

  it('keeps search data public and static, with a labelled modal and an explicit close control', () => {
    expect(header).toContain("getCollection('posts')");
    expect(header).toContain('!post.data.draft && !post.data.private');
    expect(header).toContain('projects.map((project)');
    expect(header).toContain('<dialog class="site-search"');
    expect(header).toContain('aria-labelledby="search-title"');
    expect(header).toContain('data-search-close');
    expect(header).toContain('role="status" aria-live="polite"');
    expect(header).not.toContain('fetch(');
    expect(shellCss).toContain('overscroll-behavior: contain');
  });

  it('keeps intro entrypoints and the original first-visit policy', () => {
    expect(header).toContain('`/intro-motion-2/?return=${returnPath}`');
    expect(header).toContain('`/intro-motion-3/?return=${returnPath}`');
    expect(layout).toContain('<HomeIntroState pageKind={pageKind} />');
    expect(layout).toContain("standalone ? 'standalone' : active === 'home' ? 'home' : 'content'");
    for (const condition of ['if (pageKind === \'standalone\') return', 'if (!isHome) return', 'if (isInternalHomeNavigation) return', 'if (hasSeenIntro) return', 'if (returnPath === currentPath) return']) {
      expect(intro).toContain(condition);
    }
  });

  it('keeps historical homepage experiments reachable without replacing official home links', () => {
    for (const path of ['/home-redesign/', '/home-redesign-2/', '/home-redesign-3/']) expect(footer).toContain(`withBase('${path}')`);
    expect(layout).not.toContain('HomeIndexMenu');
    expect(header).toContain("href={withBase('/')} aria-label");
  });

  it('keeps a skip link, mobile navigation and motion fallback', () => {
    expect(layout).toContain('href="#site-content"');
    expect(layout).toContain('id="site-content" tabindex="-1"');
    expect(header).toContain('data-site-navigation open');
    expect(header).toContain('aria-controls="site-navigation-panel"');
    expect(shellCss).toContain('@media (max-width: 1059px)');
    expect(shellCss).toContain('.site-nav a { font-size: 20px;');
    expect(globalCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(shellCss).toContain(':focus-visible');
  });

  it('preserves article reading sizes, rich content width and the existing focus-mode layout', () => {
    expect(globalCss).toContain('grid-template-columns: 240px minmax(0, 1fr)');
    expect(globalCss).toContain('.article-shell.is-focus-mode');
    expect(globalCss).toMatch(/\.article-content p,\s*\.article-content li\s*\{[^}]*font-size:\s*17px;/s);
    expect(globalCss).toMatch(/@media \(max-width: 760px\)[\s\S]*\.article-content p,\s*\.article-content li\s*\{[^}]*font-size:\s*16px;/);
    expect(globalCss).toContain('max-width: 800px');
    expect(shellCss).not.toMatch(/\.article-content\s*\{[^}]*max-width:/s);
  });
});

describe('pre-paint theme preference', () => {
  const source = layout.match(/<script is:inline>([\s\S]*?)<\/script>/)![1];
  function initialize(values: Record<string, string>, blocked = false) {
    const root = { dataset: {} as Record<string, string> };
    const meta = { content: '' };
    vm.runInNewContext(source, {
      localStorage: { getItem: (key: string) => { if (blocked) throw new Error('Storage blocked'); return values[key] ?? null; } },
      document: { documentElement: root, querySelector: () => meta },
    });
    return { ...root.dataset, color: meta.content };
  }
  it('uses a readable default even if storage is blocked', () => {
    expect(initialize({})).toEqual({ theme: 'light', styleTheme: 'visual-system', color: '#f5f4ef' });
    expect(initialize({}, true)).toEqual(initialize({}));
  });
  it('migrates the old homepage dark preference without overriding shared preferences', () => {
    expect(initialize({ 'home-redesign-1-theme': 'dark' }).theme).toBe('dark');
    expect(initialize({ theme: 'light', 'home-redesign-1-theme': 'dark' }).theme).toBe('light');
  });
  it('normalizes incompatible themes and falls back from removed themes to paper', () => {
    expect(initialize({ theme: 'dark', styleTheme: 'index-gradient' })).toEqual({ theme: 'dark', styleTheme: 'classic', color: '#18201e' });
    expect(initialize({ theme: 'light', styleTheme: 'classic' }).styleTheme).toBe('visual-system');
    expect(initialize({ theme: 'light', styleTheme: 'index-gradient' })).toEqual({ theme: 'light', styleTheme: 'visual-system', color: '#f5f4ef' });
    expect(initialize({ theme: 'light', styleTheme: 'clarity' })).toEqual({ theme: 'light', styleTheme: 'clarity', color: '#f6f8fc' });
  });
});
