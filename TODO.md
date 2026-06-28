# TODO

## 已完成

- [x] 根据 Clean Tech Journal 设计稿完成首页、文章详情页、文章列表页和项目页第一版。
- [x] 接入 Astro / Starlight / MDX，并保留 Starlight 指南页。
- [x] 增加 Markdown / MDX 示例文章、Callout 组件和 Mermaid 图表组件。
- [x] 增加基础单元测试，覆盖项目数据结构和站点主导航约束。
- [x] 配置 `site`，让 sitemap 构建不再因为缺少站点地址被跳过。
- [x] 给自定义页面添加 Pagefind 索引入口。

## 待开发

- [x] 网站 UI 汉化。
- [x] 开启 RSS 订阅，生成 `/rss.xml`，并在导航栏或页脚增加 RSS 入口。
- [ ] 完善真实个人介绍和项目链接；GitHub 占位、RSS 入口和项目记录入口已补。
- [x] 增加更多 MDX 示例，覆盖架构图、时序图、流程图和 Callout 变体。
- [ ] 替换 `astro.config.mjs` 中临时的 `site: "https://cheng-notes.local"` 为正式域名。
- [x] 根据真实文章数量完善分类页和标签页。
- [x] 增加基础页面结构测试，覆盖首页、文章列表页、文章详情页、项目页和 RSS 入口。
- [x] 收紧 `private: true` 文章的静态发布边界，不进入公开页面、RSS 和搜索索引。
- [x] 集中维护基础站点元信息，并补充上线前配置检查说明。
- [x] 文件下载第一版：使用 `public/files/` 支持公开静态文件链接。
- [ ] 增加视觉回归或页面渲染测试，覆盖首页、文章详情页和移动端布局。

## 后端 / 动态能力

- [x] 后端第一阶段闭环完成：保留 Astro 静态前台，Django 提供 Admin、文章/分类/标签模型、简单 JSON API、`import_posts` 和 `export_posts`，通过导入/编辑/导出/静态构建发布内容。
- [x] 文章权限第一阶段已在模型和 API 层预留单篇密码访问能力；当前不做登录用户体系、评论或复杂动态权限。
- [x] 第二版本内容源改造完成：Django 数据库存 MD / MDX 原文，发布前导出到 `src/content/posts/`，前端继续读取本地文件，不在运行时从 Django 获取内容。
- [ ] 明确 agent 发布文章流程：以 Django 数据库作为唯一内容源，agent 新增或修改文章时应先入库，再运行 `export_posts` 和静态构建，避免直接改 `src/content/posts/` 造成数据库不同步。
- [ ] 增加一个简单的 agent 入库命令，例如 `upsert_post path/to/article.mdx`，用于读取 MD / MDX frontmatter 和正文后写入 Django 数据库；不要做复杂双向自动同步。
- [ ] 文章密码访问暂不实现；当前项目定位为静态博客，`private: true` 仅表示“不发布”，不做运行时密码访问。
- [ ] 私密文件下载需要后端能力支持；当前不做。
- [ ] 后续再评估是否需要让 Astro 构建期接入 Django 数据；暂时不要让 Astro 页面直接请求 Django API。

## 当前未完成重点

- [ ] 补充真实个人介绍、GitHub 链接和项目链接。
- [ ] 替换正式域名，更新 `astro.config.mjs` 中的临时 `site: "https://cheng-notes.local"`。
- [ ] 确认 Pagefind 搜索入口是否要覆盖整个博客，而不仅是文档区。
- [ ] 补充 agent 发文流程，保证新文章先写入 Django 数据库，再导出为 Astro 内容文件。
- [ ] 文章密码访问暂不实现；当前只保留 `draft: true` 和 `private: true` 的静态发布边界，私密文章不导出、不发布、不进入 RSS 和搜索。
- [ ] 私密文件下载需要后端能力支持；当前不做。
- [ ] 增加视觉回归或页面渲染测试，覆盖首页、文章详情页和移动端布局。
- [ ] Mermaid 客户端 chunk 偏大；后续文章变多或首屏性能变差时，再考虑按需加载优化。

## 后续优化 / 暂缓

- [ ] Sitemap 已启用临时站点地址；上线前需要换成真实域名，否则搜索引擎会记录错误地址。
- [ ] GitHub 仍是占位链接；确定真实地址后更新 `src/data/site.ts`。
- [ ] 等真实域名和真实 GitHub 地址确定后，只改 `astro.config.mjs` 的 `site` 和 `src/data/site.ts` 里的 `githubUrl` / `githubIsPlaceholder`。
- [ ] Pagefind 当前由 Starlight 构建流程触发，已让自定义页面可被索引；后续需要确认搜索入口是否要覆盖整个博客，而不仅是文档区。
- [ ] Mermaid 客户端 chunk 偏大。第一版可以接受；后续如果页面变多或首屏性能变差，再考虑按需加载 Mermaid 或只在含图表文章中加载。
- [ ] 是否需要深色模式可以后续再定。当前只保留了主题按钮视觉占位，没有实现切换逻辑。
- [ ] 是否把项目记录从 `src/data/projects.ts` 迁移为内容集合，等项目数量增加后再决定。
- [ ] 文件目录后续可按文章 slug 分类；当前先统一放在 `public/files/`。
