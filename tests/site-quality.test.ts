import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

const layout = readFileSync('src/layouts/SiteLayout.astro', 'utf8');
const article = readFileSync('src/pages/articles/[...slug].astro', 'utf8');
const story = readFileSync('src/components/ReviewAnalysisStory.astro', 'utf8');
const demo = readFileSync('src/pages/context-flow-demo.astro', 'utf8');
const sitemap = readFileSync('src/pages/sitemap.xml.ts', 'utf8');
const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');

describe('phase 6 accessibility and deployment quality', () => {
  it('leaves only one main landmark and visible H1 in the bespoke review story', () => {
    expect(story).toContain('<div class="story-main">');
    expect(story).not.toContain('<main>');
    expect(story).toContain('<h1>我把散落的评价');
    expect(article).toContain("post.slug === 'ecommerce-review-analysis-agent-workflow'");
    expect(article).toContain('!hasStoryHeading && <h1>');
    expect(story).toContain('.three-layer h3 { color: var(--story-ink);');
    expect(story).toContain('.source-card h3 { color: var(--story-ink);');
  });

  it('keeps sticky navigation clear of the shared header and transfers keyboard focus', () => {
    expect(story).toContain('.story-rail { top: 74px; }');
    expect(story).toContain('top: 86px;');
    expect(story).toContain('scroll-margin-top: 160px;');
    expect(article).toContain('.focus({ preventScroll: true })');
    expect(demo).toContain('standalone>');
  });

  it('generates a public-only sitemap and consistent sharing metadata', () => {
    expect(sitemap).toContain('!post.data.draft && !post.data.private');
    expect(sitemap).toContain('...projects.map(projectPath)');
    expect(sitemap).toContain('...seriesMetaList.map');
    expect(sitemap).toContain('...categoryMetaList.map');
    expect(layout).toContain('property="og:title"');
    expect(layout).toContain('name="twitter:card"');
    expect(article).toContain('socialType="article"');
    expect(readFileSync('public/robots.txt', 'utf8')).toContain('https://apexcheng.github.io/sitemap.xml');
  });

  it('gates deployment on tests and local link validation', () => {
    expect(workflow).toContain('npm test');
    expect(workflow).toContain('npm run check:links');
    expect(existsSync('scripts/check-built-links.mjs')).toBe(true);
  });
});
