# Deploy

## 当前策略

当前使用 GitHub Pages 部署纯静态 Astro 站点。

目标访问地址：

```text
https://apexcheng.github.io/blog/
```

## 本地预览

在 WSL 项目目录运行：

```bash
npm run dev
```

然后用 Windows 浏览器访问本地地址。

## 本地构建

```bash
npm test
npm run build
```

构建产物目录：

```text
dist/
```

`dist/` 是生成目录，不需要提交。

## GitHub Pages 自动部署

仓库推送到 `main` 后，`.github/workflows/deploy.yml` 会使用 GitHub Actions 构建并发布站点。

发布前本地确认：

```bash
npm test
npm run build
git status --short
```

部署步骤：

1. 本地确认 `npm test`。
2. 本地确认 `npm run build`。
3. 推送到 `main`：`git push origin main`。
4. 打开 GitHub 仓库 Settings -> Pages。
5. Source 选择 GitHub Actions。
6. 等 Actions 完成后访问 `https://apexcheng.github.io/blog/`。

当前 GitHub Pages 项目站点配置：

```text
site: "https://apexcheng.github.io"
base: "/blog"
```

如果仓库名以后再次变化，需要同步修改：

- `astro.config.mjs` 的 `base`
- `src/data/site.ts` 的 `projectUrl`

## 后续部署候选

优先考虑静态部署：

- Cloudflare Pages
- Vercel
- 云服务器静态站点

域名可以先购买，不必立刻购买服务器。

## 原则

- 能静态部署就不引入服务器。
- 能不用数据库就不用数据库。
- 能少维护就少维护。
