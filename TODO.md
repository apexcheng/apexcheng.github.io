# TODO

## 已完成

- [x] 根据 Clean Tech Journal 设计稿完成首页、文章详情页、文章列表页和项目页第一版。
- [x] 接入 Astro / Starlight / MDX，并保留 Starlight 指南页。
- [x] 增加 Markdown / MDX 示例文章、Callout 组件和 Mermaid 图表组件。
- [x] 增加基础单元测试，覆盖项目数据结构和站点主导航约束。
- [x] 配置 `site`，让 sitemap 构建不再因为缺少站点地址被跳过。
- [x] 给自定义页面添加 Pagefind 索引入口。
- [x] 清理 `.idea/` 的 Git 跟踪，保留本地 IDE 配置和 `.gitignore` 忽略规则。
- [x] Django 数据库内容源版本已保存到 `version/django-content-source-v2`，`main` 不继续维护。
- [x] 增加文章分类页、标签页和 `/search/` 搜索入口页。

## 待开发

- [x] 网站 UI 汉化。
- [x] 开启 RSS 订阅，生成 `/rss.xml`，并在导航栏或页脚增加 RSS 入口。
- [ ] 完善真实个人介绍和项目链接；GitHub 占位、RSS 入口和项目记录入口已补。
- [x] 增加更多 MDX 示例，覆盖架构图、时序图、流程图和 Callout 变体。
- [ ] 替换真实站点信息：正式域名、GitHub 地址、作者名 / 昵称、个人介绍。
- [x] 根据真实文章数量完善分类页和标签页。
- [x] 增加基础页面结构测试，覆盖首页、文章列表页、文章详情页、项目页和 RSS 入口。
- [x] 收紧 `private: true` 文章的静态发布边界，不进入公开页面、RSS 和搜索索引。
- [x] 集中维护基础站点元信息，并补充上线前配置检查说明。
- [x] 文件下载第一版：使用 `public/files/` 支持公开静态文件链接。
- [ ] 增加视觉回归或页面渲染测试，覆盖首页、文章详情页和移动端布局。

## 下个版本：回归静态前端

- [x] 移除 Django 后端、数据库内容源、导入导出命令和相关后端文档。
- [x] 文章恢复为直接维护 `src/content/posts/` 下的 `.md` / `.mdx` 文件。
- [x] 更新 `BLOG_AGENT.md` / README，明确 Agent 发文只生成 MDX 文件，不走数据库。
- [x] 保留静态能力：RSS、Pagefind、分类 / 标签、`draft: true` / `private: true` 静态发布边界、`public/files/` 公开文件下载。
- [x] 构建验证回到前端静态站点：`npm run build` 和现有前端测试。

## 动态能力边界

- [ ] 文章密码访问暂不实现；当前项目定位为静态博客，`private: true` 仅表示“不发布”，不做运行时密码访问。
- [ ] 私密文件下载需要后端能力支持；当前不做。
- [x] `main` 回归纯静态前端，不再维护 Django 后端内容源。

## 当前未完成重点

- [ ] 补充真实个人介绍、GitHub 链接和项目链接。
- [ ] 替换真实站点信息：正式域名、GitHub 地址、作者名 / 昵称、个人介绍，并同步更新站点配置。
- [x] 确认 Pagefind 搜索入口是否要覆盖整个博客，而不仅是文档区；当前先提供 `/search/` 入口页，沿用 Starlight / Pagefind 能力。
- [x] 回归静态前端后，重写 agent 发文流程：新文章直接生成 `.md` / `.mdx` 内容文件，不再写入数据库。
- [ ] 文章密码访问暂不实现；当前只保留 `draft: true` 和 `private: true` 的静态发布边界。
- [ ] 私密文件下载需要后端能力支持；当前不做。
- [ ] 增加视觉回归或页面渲染测试，覆盖首页、文章详情页和移动端布局。
- [ ] Mermaid 客户端 chunk 偏大；后续文章变多或首屏性能变差时，再考虑按需加载优化。

## 后续优化 / 暂缓

- [ ] Sitemap 已启用临时站点地址；上线前需要换成真实域名，否则搜索引擎会记录错误地址。
- [ ] GitHub 仍是占位链接；确定真实地址后更新 `src/data/site.ts`。
- [ ] 等真实域名和真实 GitHub 地址确定后，只改 `astro.config.mjs` 的 `site` 和 `src/data/site.ts` 里的 `githubUrl` / `githubIsPlaceholder`。
- [x] Pagefind 当前由 Starlight 构建流程触发，已新增 `/search/` 入口页；不额外引入搜索依赖。
- [ ] Mermaid 客户端 chunk 偏大。第一版可以接受；后续如果页面变多或首屏性能变差，再考虑按需加载 Mermaid 或只在含图表文章中加载。
- [ ] 是否需要深色模式可以后续再定。当前只保留了主题按钮视觉占位，没有实现切换逻辑。
- [ ] 是否把项目记录从 `src/data/projects.ts` 迁移为内容集合，等项目数量增加后再决定。
- [ ] 文件目录后续可按文章 slug 分类；当前先统一放在 `public/files/`。
