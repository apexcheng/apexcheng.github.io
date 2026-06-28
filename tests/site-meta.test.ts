import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const siteDataPath = 'src/data/site.ts';
const astroConfigSource = readFileSync('astro.config.mjs', 'utf8');
const layoutSource = readFileSync('src/layouts/SiteLayout.astro', 'utf8');
const aboutSource = readFileSync('src/pages/about.astro', 'utf8');
const rssSource = readFileSync('src/pages/rss.xml.ts', 'utf8');
const publishSource = readFileSync('Publish.md', 'utf8');
const todoSource = readFileSync('TODO.md', 'utf8');

describe('site metadata', () => {
  it('keeps shared site metadata in one small data file', () => {
    expect(existsSync(siteDataPath)).toBe(true);

    const siteDataSource = readFileSync(siteDataPath, 'utf8');
    for (const field of ['siteName', 'siteDescription', 'authorName', 'githubUrl', 'githubIsPlaceholder', 'rssPath']) {
      expect(siteDataSource).toContain(field);
    }
  });

  it('uses shared metadata in layout, about, rss, and Astro config', () => {
    expect(layoutSource).toContain("from '../data/site'");
    expect(aboutSource).toContain("from '../data/site'");
    expect(rssSource).toContain("from '../data/site'");
    expect(astroConfigSource).toContain("from './src/data/site'");
  });

  it('documents unresolved launch-time placeholders', () => {
    expect(astroConfigSource).toContain("site: 'https://cheng-notes.local'");
    expect(publishSource).toContain('上线前检查');
    expect(publishSource).toContain('RSS 和 sitemap');
    expect(publishSource).toContain('GitHub 当前是占位链接');
    expect(publishSource).toContain('private: true');
    expect(todoSource).toContain('正式域名');
    expect(todoSource).toContain('GitHub');
  });
});
