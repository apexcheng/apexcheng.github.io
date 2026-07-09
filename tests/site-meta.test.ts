import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const siteDataPath = 'src/data/site.ts';
const workflowPath = '.github/workflows/deploy.yml';
const astroConfigSource = readFileSync('astro.config.mjs', 'utf8');
const siteDataSource = readFileSync(siteDataPath, 'utf8');
const layoutSource = readFileSync('src/layouts/SiteLayout.astro', 'utf8');
const aboutSource = readFileSync('src/pages/about.astro', 'utf8');
const rssSource = readFileSync('src/pages/rss.xml.ts', 'utf8');
const readmeSource = readFileSync('README.md', 'utf8');

describe('site metadata', () => {
  it('keeps shared site metadata in one small data file', () => {
    expect(existsSync(siteDataPath)).toBe(true);

    for (const field of ['siteName', 'siteDescription', 'authorName', 'githubUrl', 'githubIsPlaceholder', 'projectUrl', 'rssPath']) {
      expect(siteDataSource).toContain(field);
    }
  });

  it('uses shared metadata in layout, about, and rss', () => {
    expect(layoutSource).toContain("from '../data/site'");
    expect(aboutSource).toContain("from '../data/site'");
    expect(rssSource).toContain("from '../data/site'");
  });

  it('documents GitHub Pages site metadata', () => {
    expect(astroConfigSource).toContain("site: 'https://apexcheng.github.io'");
    expect(astroConfigSource).not.toContain('base:');
    expect(siteDataSource).toContain("githubUrl: 'https://github.com/apexcheng'");
    expect(siteDataSource).toContain("projectUrl: 'https://github.com/apexcheng/apexcheng.github.io'");
    expect(readmeSource).toContain('上线前检查');
    expect(readmeSource).toContain('RSS 和 sitemap');
    expect(readmeSource).toContain('GitHub Pages');
    expect(readmeSource).toContain('private: true');
  });

  it('keeps the GitHub Pages workflow on the official Astro path', () => {
    expect(existsSync(workflowPath)).toBe(true);

    const workflowSource = readFileSync(workflowPath, 'utf8');
    expect(workflowSource).toContain('push:');
    expect(workflowSource).toContain('branches: [main]');
    expect(workflowSource).toContain('workflow_dispatch:');
    expect(workflowSource).toContain('contents: read');
    expect(workflowSource).toContain('pages: write');
    expect(workflowSource).toContain('id-token: write');
    expect(workflowSource).toContain('uses: withastro/action@v6');
    expect(workflowSource).toContain('package-manager: npm');
    expect(workflowSource).toContain('uses: actions/deploy-pages@v5');
  });
});
