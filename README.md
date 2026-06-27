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

## 当前原则

- 先把 UI 和内容结构做顺，再考虑部署。
- 优先静态博客，不做后台、登录、评论、数据库。
- 普通文章用 Markdown，需要组件时再用 MDX。
- 图表第一版优先使用 Mermaid。
- 设计落地以简单、可维护、少依赖为准。
