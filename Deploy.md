# Deploy

## 当前策略

第一阶段只做本地开发和本地预览。

先让内容结构和 UI 成型，再考虑公网访问。

## 本地预览

在 WSL 项目目录运行：

```bash
npm run dev
```

然后用 Windows 浏览器访问本地地址。

## 本地构建

```bash
npm run build
```

构建产物目录：

```text
dist/
```

`dist/` 是生成目录，不需要提交。

## 后续部署候选

优先考虑静态部署：

- Cloudflare Pages
- GitHub Pages
- Vercel
- 云服务器静态站点

域名可以先购买，不必立刻购买服务器。

## 原则

- 能静态部署就不引入服务器。
- 能不用数据库就不用数据库。
- 能少维护就少维护。
