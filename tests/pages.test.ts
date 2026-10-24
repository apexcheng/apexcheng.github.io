import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const indexSource = readFileSync('src/pages/index.astro', 'utf8');
const homeSource = readFileSync('src/pages/home-redesign-1.astro', 'utf8');
const paperHomeSource = readFileSync('src/pages/home-redesign-2.astro', 'utf8');
const workbenchHomeSource = readFileSync('src/pages/home-redesign-3.astro', 'utf8');
const exhibitionHomeSource = readFileSync('src/pages/home-redesign.astro', 'utf8');
const aboutSource = readFileSync('src/pages/about.astro', 'utf8');
const projectsSource = readFileSync('src/pages/projects.astro', 'utf8');
const articlesSource = readFileSync('src/pages/articles/index.astro', 'utf8');
const articleDetailSource = readFileSync('src/pages/articles/[...slug].astro', 'utf8');
const categorySource = readFileSync('src/pages/articles/category/[category].astro', 'utf8');
const tagSource = readFileSync('src/pages/articles/tag/[tag].astro', 'utf8');
const layoutSource = readFileSync('src/layouts/SiteLayout.astro', 'utf8');
const headerSource = readFileSync('src/components/SiteHeader.astro', 'utf8');
const rssSource = readFileSync('src/pages/rss.xml.ts', 'utf8');

describe('front page structure', () => {
  it('keeps the home hero as the first-page reading entry', () => {
    expect(indexSource).toContain("import HomeRedesignOne from './home-redesign-1.astro'");
    expect(indexSource).toContain('<HomeRedesignOne />');
    expect(homeSource).toContain('<section class="journal-hero" aria-labelledby="home-title">');
    expect(homeSource).toContain('让经验成章。');
    expect(homeSource).toContain('把复杂的事弄明白，再把有用的经验留下来。');
    expect(homeSource).toContain('class="journal-hero-links"');
    expect(homeSource).toContain("withBase('/articles/')");
    expect(homeSource).toContain("withBase('/projects/')");
  });

  it('keeps home project entry aligned with the projects page', () => {
    expect(homeSource).toContain("withBase('/projects/')");
    expect(homeSource).toContain('查看项目');
    expect(projectsSource).toContain('项目实践');
    expect(projectsSource).toContain('moreProjects.map');
    expect(projectsSource).toContain('ProjectVisual project={mainProject} compact');
    expect(homeSource).toContain('getProject(featuredProjectId)');
    expect(homeSource).toContain('withBase(projectPath(featuredProject))');
  });

  it('keeps homepage intro returns and internal home navigation state consistent', () => {
    expect(homeSource).toContain("standalone={!isOfficialHome}");
    expect(layoutSource).toContain("<HomeIntroState pageKind={pageKind} />");
    expect(paperHomeSource).toContain('<HomeIntroState pageKind="standalone" />');
    expect(workbenchHomeSource).toContain('<HomeIntroState pageKind="standalone" />');
    expect(exhibitionHomeSource).toContain('<HomeIntroState pageKind="standalone" />');
    expect(paperHomeSource).toContain("const introReturn = encodeURIComponent(withBase('/home-redesign-2/'))");
    expect(paperHomeSource).toContain('`/intro-motion-2/?return=${introReturn}`');
    expect(paperHomeSource).toContain('`/intro-motion-3/?return=${introReturn}`');
  });

  it('shows actual publication dates instead of invented current activity', () => {
    expect(homeSource).not.toContain('2026-07-18');
    expect(homeSource).toContain('formatDate(latestPost.data.date)');
    expect(homeSource).toContain("datetime={post.data.date.toISOString()}");
    expect(workbenchHomeSource).not.toContain("new Date('2026-07-18T12:00:00+08:00')");
    expect(workbenchHomeSource).toContain('data-current-full-date');
    expect(workbenchHomeSource).toContain("currentDate.setAttribute('datetime', dateValue)");
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
    expect(aboutSource).toContain("withBase('/about-assets/user-520.jpg')");
    expect(aboutSource).toContain("withBase('/about-assets/wx.png')");
    expect(aboutSource).toContain('loading="lazy" decoding="async"');
    expect(aboutSource).toContain("withBase('/about-assets/resume.docx')");
  });

  it('filters categories in place while keeping static category and tag archives', () => {
    expect(articlesSource).toContain('<ArticleList posts={posts} hideSeries hideVisualLab showPinned inlineMeta />');
    expect(articlesSource).toContain('(!category || itemCategory === category)');
    expect(articlesSource).toContain('?category=${encodeURIComponent(category.name)}');
    expect(articlesSource).toContain('/articles/tag/${encodeURIComponent(tag)}/');
    expect(categorySource).toContain('getStaticPaths');
    expect(categorySource).toContain('!post.data.draft');
    expect(categorySource).toContain('!post.data.private');
    expect(tagSource).toContain('getStaticPaths');
    expect(tagSource).toContain('!post.data.draft');
    expect(tagSource).toContain('!post.data.private');
    expect(articlesSource).not.toContain('暂不支持点击筛选');
    expect(articlesSource).toContain('data-articles-summary');
    expect(articlesSource).toContain('class="articles-page-intro"');
    expect(categorySource).toContain('<RelatedSeries posts={posts}');
    expect(tagSource).toContain('<RelatedSeries posts={posts}');
  });

  it('keeps search inside the shared header without a separate search page', () => {
    expect(headerSource).toContain('data-site-search');
    expect(headerSource).toContain('搜索文章和项目');
    expect(headerSource).toContain("getCollection('posts')");
    expect(headerSource).toContain('projects.map((project)');
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
    expect(articleDetailSource).toContain('<details class="article-info desktop-article-info">');
    expect(articleDetailSource).toContain('<summary>文章信息</summary>');
    expect(articleDetailSource.indexOf('<details class="article-info desktop-article-info">')).toBeLessThan(
      articleDetailSource.indexOf('<details class="toc-panel" open>'),
    );
    expect(articleDetailSource).toContain('<summary>文章目录</summary>');
    expect(articleDetailSource).toContain('文章信息');
    expect(articleDetailSource).toContain('{post.data.category}');
    expect(articleDetailSource).toContain('post.data.tags.map');
    expect(articleDetailSource).toContain('class="article-content"');
    expect(articleDetailSource).toContain('<h1>{post.data.title}</h1>');
    expect(articleDetailSource).toContain('作者：{siteMeta.authorName}');
    expect(articleDetailSource).toContain('<details class="toc-panel" open>');
    expect(articleDetailSource).toContain('class="toc-panel-links"');
    expect(articleDetailSource).toContain('heading.depth === 2 || heading.depth === 3');
  });

  it('keeps rss generated from content collections', () => {
    expect(rssSource).toContain("getCollection('posts')");
    expect(rssSource).toContain('withBase(`/articles/${post.slug}/`)');
  });

  it('renders grouped long mobile TOCs, flat short TOCs and native heading links', () => {
    expect(articleDetailSource).toContain('tocHeadings.length >= 12 ? groupTocHeadings(tocHeadings) : null');
    expect(articleDetailSource).toContain('mobileTocGroups ? mobileTocGroups.map');
    expect(articleDetailSource).toContain('data-toc-group open={index === 0}');
    expect(articleDetailSource).toContain('class="toc-group-title"');
    expect(articleDetailSource).toContain('跳到本章开头 ↗');
    expect(articleDetailSource).toContain('href={`#${group.heading.slug}`}');
    expect(articleDetailSource).toContain('href={`#${heading.slug}`}');
    expect(articleDetailSource).toContain(') : tocHeadings.map');
    expect(articleDetailSource).not.toContain('<details class="mobile-toc-panel" open');
  });

  it('omits empty TOC furniture and recommendations from component-led articles', () => {
    expect(articleDetailSource).toContain('{hasToc && <div class="article-sidebar"');
    expect(articleDetailSource).toContain('{hasToc && <div class="article-sidebar-restore"');
    expect(articleDetailSource).toContain('{hasToc && <details class="mobile-toc-panel"');
    expect(articleDetailSource).toContain('!post.data.series && hasToc');
    expect(readFileSync('src/styles/site-shell.css', 'utf8')).toContain(".article-shell[data-has-toc='false'] { grid-template-columns: minmax(0, 1fr); }");
    const story = readFileSync('src/components/ReviewAnalysisStory.astro', 'utf8');
    expect(story).toContain('技术实践 / 文章');
    expect(story).toContain("href={withBase('/articles/')}");
    expect(story.match(/<h1>/g)).toHaveLength(1);
  });

  it('renders recommendations as article links only when matches exist', () => {
    expect(articleDetailSource).toContain('{relatedPosts.length > 0 && (');
    expect(articleDetailSource).toContain('aria-label="继续阅读"');
    expect(articleDetailSource).toContain('href={withBase(`/articles/${related.slug}/`)}');
    expect(articleDetailSource).toContain('/scripts/article-overflow.js');
  });
});
