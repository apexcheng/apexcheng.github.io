import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { featuredProjectId, getProject, homepageSecondaryIds, portfolioMainId, portfolioSpotlightIds, projectPath, projects } from '../src/data/projects';

const detail = readFileSync('src/layouts/ProjectCaseLayout.astro', 'utf8');
const route = readFileSync('src/pages/projects/[...slug].astro', 'utf8');
const home = readFileSync('src/pages/home-redesign-1.astro', 'utf8');
const header = readFileSync('src/components/SiteHeader.astro', 'utf8');

describe('published project case studies', () => {
  it('has six identifiable, independently navigable case studies instead of placeholders', () => {
    expect(projects).toHaveLength(6);
    expect(projects.map((project) => project.id)).toEqual([
      'hangqiao',
      'inventory-rpa',
      'yingdao-agent-development',
      'review-analysis-agent',
      'hangqiao/ai-table',
      'blog-content-engineering',
    ]);
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
    expect(projects.every((project) => project.title && project.type && project.description && project.lead && project.tags.length)).toBe(true);
    expect(projects.every((project) => project.decisions.length > 0 && project.flow.length > 0 && project.outcomes.length > 0 && project.boundaries.length > 0)).toBe(true);
    expect(projects.every((project) => projectPath(project) === `/projects/${project.id}/`)).toBe(true);
    expect(route).toContain('slug: project.id');
    expect(route).toContain('<ProjectCaseLayout project={project} />');
    expect(existsSync('src/styles/projects.css')).toBe(true);
  });

  it('keeps AI table under Hangqiao and inventory RPA independent', () => {
    expect(getProject('hangqiao/ai-table')?.parentId).toBe('hangqiao');
    expect(getProject('inventory-rpa')?.parentId).toBeUndefined();
    for (const project of projects) {
      if (project.parentId) expect(getProject(project.parentId)).toBeDefined();
    }
    expect(getProject('inventory-rpa')?.description).toContain('拼多多、淘宝和京东');
    expect(getProject('inventory-rpa')?.boundaries.join('')).toContain('平台可售库存');
    expect(projects.find((project) => project.id === 'blog-content-engineering')?.tags).not.toContain('Starlight');
  });

  it('keeps homepage featured schematic attached to review agent by stable id', () => {
    expect(featuredProjectId).toBe('review-analysis-agent');
    expect(portfolioMainId).toBe('hangqiao');
    expect([...portfolioSpotlightIds]).toEqual(['inventory-rpa', 'yingdao-agent-development']);
    expect([...homepageSecondaryIds]).toEqual(['hangqiao', 'inventory-rpa', 'yingdao-agent-development', 'blog-content-engineering']);
    for (const id of [featuredProjectId, portfolioMainId, ...portfolioSpotlightIds, ...homepageSecondaryIds]) {
      expect(getProject(id)).toBeDefined();
    }
    expect(home).toContain('getProject(featuredProjectId)');
    expect(home).toContain('throw new Error');
    expect(home).toContain('withBase(projectPath(featuredProject))');
    expect(home).not.toContain('projects[0]');
    expect(header).toContain('href: withBase(projectPath(project))');
    expect(header).toContain('...(project.searchKeywords ?? [])');
    expect(getProject('inventory-rpa')?.searchKeywords).toContain('库存补货');
    expect(header).not.toContain("project.url ?? withBase('/projects/')");
  });

  it('provides accessible, factual case layouts without internal addresses or invented product screenshots', () => {
    expect(detail).toContain('project.boundaries.map');
    expect(detail).toContain('project.decisions.map');
    expect(detail).toContain('project.links.map');
    expect(detail).toContain('ProjectVisual project={project}');
    expect(detail).toContain('rel={link.external ?');
    const publicData = JSON.stringify(projects);
    for (const forbidden of ['192.168.', '127.0.0.1', 'C:\\Users\\', '/Users/hs/', 'Starlight', '立即体验', '节省工时', '独立打造']) {
      expect(publicData).not.toContain(forbidden);
    }
    expect(projects.every((project) => project.links.every((link) => link.href.startsWith('/') || link.href.startsWith('https://')))).toBe(true);
  });
});
