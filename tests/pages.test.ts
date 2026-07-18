import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const indexSource = readFileSync('src/pages/index.astro', 'utf8');
const homeSource = readFileSync('src/pages/home-redesign-1.astro', 'utf8');
const aboutSource = readFileSync('src/pages/about.astro', 'utf8');
const projectsSource = readFileSync('src/pages/projects.astro', 'utf8');
const articlesSource = readFileSync('src/pages/articles/index.astro', 'utf8');
const articleDetailSource = readFileSync('src/pages/articles/[...slug].astro', 'utf8');
const categorySource = readFileSync('src/pages/articles/category/[category].astro', 'utf8');
const tagSource = readFileSync('src/pages/articles/tag/[tag].astro', 'utf8');
const layoutSource = readFileSync('src/layouts/SiteLayout.astro', 'utf8');
const rssSource = readFileSync('src/pages/rss.xml.ts', 'utf8');

describe('front page structure', () => {
  it('keeps the home hero as the first-page reading entry', () => {
    expect(indexSource).toContain("import HomeRedesignOne from './home-redesign-1.astro'");
    expect(indexSource).toContain('<HomeRedesignOne />');
    expect(homeSource).toContain('<section class="hero" id="top">');
    expect(homeSource).toContain('把复杂技术，');
    expect(homeSource).toContain('记录生活判断、项目实践、系统教程和视觉实验。');
    expect(homeSource).toContain('class="hero-actions"');
    expect(homeSource).toContain("withBase('/articles/')");
    expect(homeSource).toContain("withBase('/projects/')");
  });

  it('keeps home project entry aligned with the projects page', () => {
    expect(homeSource).toContain("withBase('/projects/')");
    expect(homeSource).toContain('查看项目');
    expect(projectsSource).toContain('项目记录');
    expect(projectsSource).toContain('projects.map');
  });

  it('keeps about links tied to real site metadata', () => {
    expect(aboutSource).toContain('siteMeta.githubUrl');
    expect(aboutSource).toContain('siteMeta.projectUrl');
    expect(aboutSource).toContain('withBase(siteMeta.rssPath)');
    expect(aboutSource).toContain("withBase('/projects/')");
    expect(aboutSource).toContain('GitHub');
    expect(aboutSource).toContain('项目仓库');
    expect(aboutSource).toContain('RSS 订阅');
    expect(aboutSource).toContain('项目记录');
    expect(aboutSource).toContain('访问图床');
    expect(aboutSource).toContain('https://apexcheng.github.io/gallery/');
  });

  it('keeps migrated about page content and assets', () => {
    expect(aboutSource).toContain('<SiteLayout title="关于我" active="about">');
    expect(aboutSource).toContain('Automation Builder');
    expect(aboutSource).toContain('核心技能');
    expect(aboutSource).toContain('BrianBlog 博客系统');
    expect(aboutSource).toContain('微信二维码');
    expect(aboutSource).toContain("withBase('/about-assets/user.png')");
    expect(aboutSource).toContain("withBase('/about-assets/wx.png')");
    expect(aboutSource).toContain("withBase('/about-assets/resume.docx')");
  });

  it('filters categories in place while keeping static category and tag archives', () => {
    expect(articlesSource).toContain('?category=${encodeURIComponent(category.name)}');
    expect(articlesSource).toContain('/articles/tag/${encodeURIComponent(tag)}/');
    expect(categorySource).toContain('getStaticPaths');
    expect(categorySource).toContain('!post.data.draft');
    expect(categorySource).toContain('!post.data.private');
    expect(tagSource).toContain('getStaticPaths');
    expect(tagSource).toContain('!post.data.draft');
    expect(tagSource).toContain('!post.data.private');
    expect(articlesSource).not.toContain('暂不支持点击筛选');
  });

  it('keeps search inside the shared header without a separate search page', () => {
    expect(layoutSource).toContain('data-site-search');
    expect(layoutSource).toContain('搜索文章和项目');
    expect(layoutSource).toContain("getCollection('posts')");
    expect(layoutSource).toContain('projects.map((project)');
    expect(layoutSource).not.toContain('/guides/mdx-content/');
    expect(layoutSource).not.toContain('fetch(');
  });

  it('keeps article detail pages static and content-driven', () => {
    expect(articleDetailSource).toContain('getStaticPaths');
    expect(articleDetailSource).toContain('render(post)');
    expect(articleDetailSource).not.toContain('fetch(');
  });

  it('renders article detail metadata, tags, and table of contents structure', () => {
    expect(articleDetailSource).toContain('class="article-sidebar"');
    expect(articleDetailSource).toContain('class="article-info desktop-article-info"');
    expect(articleDetailSource).toContain('文章信息');
    expect(articleDetailSource).toContain('{post.data.category}');
    expect(articleDetailSource).toContain('post.data.tags.map');
    expect(articleDetailSource).toContain('class="article-content"');
    expect(articleDetailSource).toContain('<h1>{post.data.title}</h1>');
    expect(articleDetailSource).toContain('作者：{siteMeta.authorName}');
    expect(articleDetailSource).toContain('class="toc-panel"');
    expect(articleDetailSource).toContain('本文目录');
    expect(articleDetailSource).toContain('heading.depth === 2 || heading.depth === 3');
  });

  it('keeps rss generated from content collections', () => {
    expect(rssSource).toContain("getCollection('posts')");
    expect(rssSource).toContain('withBase(`/articles/${post.slug}/`)');
  });
});
