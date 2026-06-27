# Development

## 技术栈

```text
Astro + Starlight + MDX + Mermaid
```

## 本地开发

项目位于 WSL：

```bash
~/projects/personal-blog
```

常用命令：

```bash
npm install
npm run dev
npm run build
```

## 开发边界

- 不做评论、登录、后台、数据库。
- 不引入不必要依赖。
- 不重写整套主题，优先小步改造。
- 普通文章优先 `.md`，需要组件再用 `.mdx`。
- 自定义样式集中放在 `src/styles/custom.css`。

## 实现顺序

1. 按 `Design.md` 落首页视觉。
2. 优化文章详情页：正文宽度、代码块、Callout、Mermaid 容器。
3. 做文章列表页和项目页。
4. 补移动端细节。
5. 最后再处理暗色模式和小动效。

## 验证方式

页面开发后运行：

```bash
npm run build
```

只修改规划类 Markdown 文档时，可以不运行构建。
