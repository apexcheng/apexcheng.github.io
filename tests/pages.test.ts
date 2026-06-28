import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homeSource = readFileSync('src/pages/index.astro', 'utf8');
const aboutSource = readFileSync('src/pages/about.astro', 'utf8');
const projectsSource = readFileSync('src/pages/projects.astro', 'utf8');
const articlesSource = readFileSync('src/pages/articles/index.astro', 'utf8');
const articleDetailSource = readFileSync('src/pages/articles/[...slug].astro', 'utf8');
const rssSource = readFileSync('src/pages/rss.xml.ts', 'utf8');

describe('front page structure', () => {
  it('keeps home project entry aligned with the projects page', () => {
    expect(homeSource).toContain('href="/projects/"');
    expect(homeSource).toContain('查看项目记录');
    expect(projectsSource).toContain('项目记录');
    expect(projectsSource).toContain('projects.map');
  });

  it('keeps about links honest while GitHub is still a placeholder', () => {
    expect(aboutSource).toContain('siteMeta.githubUrl');
    expect(aboutSource).toContain('GitHub 暂时使用占位链接');
    expect(aboutSource).toContain('siteMeta.rssPath');
    expect(aboutSource).toContain('href="/projects/"');
  });

  it('describes article category and tag lists as display-only', () => {
    expect(articlesSource).toContain('真实文章数据生成');
    expect(articlesSource).toContain('暂不支持点击筛选');
    expect(articlesSource).toContain('搜索入口暂由指南页提供');
    expect(articlesSource).not.toContain('独立筛选页');
  });

  it('keeps article detail pages static and content-driven', () => {
    expect(articleDetailSource).toContain('getStaticPaths');
    expect(articleDetailSource).toContain('render(post)');
    expect(articleDetailSource).not.toContain('fetch(');
  });

  it('keeps rss generated from content collections', () => {
    expect(rssSource).toContain("getCollection('posts')");
    expect(rssSource).toContain('/articles/${post.slug}/');
  });
});
