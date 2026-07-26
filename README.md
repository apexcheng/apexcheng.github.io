# 视觉化博客项目

一个以网页化视觉表达为主的技术博客：

```text
技术知识 + 项目记录 + 图解文章
```

## 技术栈

- Astro
- MDX
- Mermaid

## 本地开发

在当前环境的项目根目录运行：

```bash
npm install
npm run dev
npm test
npm run build
```

如果当前环境没有 Node 或 npm，直接说明未验证，不要求安装运行时。

## 发文

正式文章放在 `src/content/posts/`，视觉实验和 Demo 放在 `src/content/posts/visual-lab/`。

新文章默认：

```yaml
draft: false
private: false
```

`private: true` 文章不会进入公开页面、RSS 或搜索索引，但不提供密码保护。正式文章默认视觉优先，需要复杂布局时使用 MDX；小范围内容修改不需要重新设计全文。

可下载文件放在 `public/files/`，文章使用 `/files/` 链接。该目录内容会被静态发布，上线前检查其中没有敏感文件。

## GitHub Pages

站点通过 GitHub Actions 部署到：

```text
https://apexcheng.github.io/
```

仓库是 GitHub 用户站点，部署在根路径 `/`，`astro.config.mjs` 不需要 `base`。

上线前检查：

- `astro.config.mjs` 中的站点地址与 GitHub Pages 地址一致。
- RSS 和 sitemap 使用当前站点配置。
- `public/files/` 中没有敏感文件；其中内容会被静态发布。

commit、push 和部署只在任务明确要求时执行。
