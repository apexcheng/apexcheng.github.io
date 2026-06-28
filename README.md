# 个人博客项目

个人技术博客，定位为：

```text
个人技术知识库 + 项目记录 + 图表化技术文章
```

当前 UI 方向已参考 `tmp/design-mockups/clean-tech-journal-full/` 中的新设计模板：**Clean Tech Journal**。

## 技术栈

- Astro
- Starlight
- MDX
- Mermaid

## 核心文档

| 文件 | 作用 |
|---|---|
| `PRD.md` | 项目定位、范围、阶段目标 |
| `Design.md` | UI 方向、页面结构、设计规范 |
| `Content.md` | 内容分类、文章写法、MDX 使用边界 |
| `Development.md` | 开发约定、实现顺序、验证方式 |
| `Deploy.md` | 本地预览和后续部署策略 |

## 本地开发

在 WSL 项目目录运行：

```bash
cd ~/projects/personal-blog
npm install
npm run dev
npm run build
```

Windows 只作为浏览器预览环境使用，例如访问 `localhost`。

## 部署

当前通过 GitHub Actions 自动部署到 GitHub Pages：

```text
https://apexcheng.github.io/blog/
```

发布前在本地确认：

```bash
npm test
npm run build
```

然后推送到 `main`：

```bash
git push origin main
```

GitHub 仓库 Settings → Pages 中 Source 需要选择 GitHub Actions。仓库名以后如果变化，需要同步修改 `astro.config.mjs` 的 `base` 和 `src/data/site.ts` 的项目仓库地址。

## 发文流程

`src/content/posts/*.md` / `*.mdx` 是文章内容源。Agent 或人工直接在这个目录新增或修改文章文件，然后构建验证：

```bash
npm run build
```

普通文章用 Markdown，需要组件时再用 MDX。新文章默认 `draft: true`，发布时改成 `false`。`private: true` 文章不会进入公开页面、RSS 或搜索索引。

## 当前原则

- 先把 UI 和内容结构做顺，再考虑部署。
- 前台保持纯静态构建，不维护 Django 后端内容源。
- 普通文章用 Markdown，需要组件时再用 MDX。
- 图表第一版优先使用 Mermaid。
- 设计落地以简单、可维护、少依赖为准。
