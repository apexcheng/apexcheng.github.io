# Publish

当前发布流程是纯静态前端：文章直接维护在 `src/content/posts/`，Astro 构建静态站点。

## 1. 安装依赖

在 WSL 项目目录中运行：

```bash
cd /home/cheng/projects/personal-blog
npm install
```

## 2. 维护文章

直接新增或修改 `src/content/posts/*.md` / `*.mdx` 文件。普通文章用 Markdown，需要组件时再用 MDX。

新文章默认保留 `draft: true`，发布时改成 `false`。`private: true` 文章不会进入静态前台页面、RSS 或 Pagefind 搜索索引。

## 3. 验证

```bash
npm test
npm run build
```

## 4. 提交前检查

```bash
git diff
git status --short
```

提交前确认不要包含：

- `.idea/workspace.xml`
- `.astro/`
- `dist/`
- `node_modules/`

## 5. GitHub Pages 发布

当前使用 GitHub Actions 自动部署 GitHub Pages。

部署步骤：

1. 本地确认 `npm test`。
2. 本地确认 `npm run build`。
3. 推送到 `main`：`git push origin main`。
4. 打开 GitHub 仓库 Settings -> Pages。
5. Source 选择 GitHub Actions。
6. 等 Actions 完成后访问 `https://apexcheng.github.io/blog/`。

## 6. 上线前检查

- 当前按 GitHub Pages 项目站点配置：`site: "https://apexcheng.github.io"`，`base: "/blog"`。
- RSS 和 sitemap 会使用 `site` / `base` 生成地址。
- GitHub 主页和项目仓库地址维护在 `src/data/site.ts`。
- 如果仓库名以后再次变化，需要同步修改 `astro.config.mjs` 的 `base` 和 `src/data/site.ts` 的项目仓库地址。
- `private: true` 文章不会静态发布，也不会进入 RSS 或 Pagefind 搜索索引。
- 确认 `public/files/` 中没有敏感文件；该目录内容会被静态发布。

## 当前边界

- `private: true` 文章在静态前台视为不公开发布，不做纯前端密码访问。
- `public/files/` 只支持公开静态文件下载，不提供私密文件权限控制。
- 不做评论、登录用户体系、复杂动态权限。
- 不引入 Docker、Redis、Celery、Django REST Framework。
