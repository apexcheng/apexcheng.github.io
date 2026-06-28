import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const layoutSource = readFileSync('src/layouts/SiteLayout.astro', 'utf8');

describe('site layout', () => {
  it('keeps Cheng Notes as the personal blog brand', () => {
    expect(layoutSource).toContain('siteMeta.siteName');
    expect(layoutSource).toContain('${siteMeta.siteName} 首页');
  });

  it('links the primary static pages from the main navigation', () => {
    expect(layoutSource).toContain('href="/articles/"');
    expect(layoutSource).toContain('href="/projects/"');
    expect(layoutSource).toContain('href="/guides/mdx-content/"');
  });
});
