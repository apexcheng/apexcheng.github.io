import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homeSource = readFileSync('src/pages/index.astro', 'utf8');
const aboutSource = readFileSync('src/pages/about.astro', 'utf8');
const projectsSource = readFileSync('src/pages/projects.astro', 'utf8');
const articlesSource = readFileSync('src/pages/articles/index.astro', 'utf8');
const articleDetailSource = readFileSync('src/pages/articles/[...slug].astro', 'utf8');
const categorySource = readFileSync('src/pages/articles/category/[category].astro', 'utf8');
const tagSource = readFileSync('src/pages/articles/tag/[tag].astro', 'utf8');
const searchSource = readFileSync('src/pages/search.astro', 'utf8');
const rssSource = readFileSync('src/pages/rss.xml.ts', 'utf8');

describe('front page structure', () => {
  it('keeps the home hero as the first-page reading entry', () => {
    expect(homeSource).toContain('<section class="hero-grid">');
    expect(homeSource).toContain('生活观察 · 实践复盘 · 系统教程');
    expect(homeSource).toContain('记录生活判断、工具实践与系统学习的个人博客');
    expect(homeSource).toContain('class="hero-actions"');
    expect(homeSource).toContain("withBase('/articles/')");
    expect(homeSource).toContain("withBase('/projects/')");
  });

  it('keeps home project entry aligned with the projects page', () => {
    expect(homeSource).toContain("withBase('/projects/')");
    expect(homeSource).toContain('查看项目记录');
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

  it('links article categories and tags to static filter pages', () => {
    expect(articlesSource).toContain('/articles/category/${encodeURIComponent(category.name)}/');
    expect(articlesSource).toContain('/articles/tag/${encodeURIComponent(tag)}/');
    expect(categorySource).toContain('getStaticPaths');
    expect(categorySource).toContain('!post.data.draft');
    expect(categorySource).toContain('!post.data.private');
    expect(tagSource).toContain('getStaticPaths');
    expect(tagSource).toContain('!post.data.draft');
    expect(tagSource).toContain('!post.data.private');
    expect(articlesSource).not.toContain('暂不支持点击筛选');
  });

  it('keeps the static search page aligned with the header search entry', () => {
    expect(searchSource).toContain('顶部导航');
    expect(searchSource).toContain('文章和项目');
    expect(searchSource).not.toContain('/guides/mdx-content/');
    expect(searchSource).not.toContain('fetch(');
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
    expect(articleDetailSource).toContain('headings.filter((heading) => heading.depth === 2)');
  });

  it('keeps rss generated from content collections', () => {
    expect(rssSource).toContain("getCollection('posts')");
    expect(rssSource).toContain('withBase(`/articles/${post.slug}/`)');
  });
});
