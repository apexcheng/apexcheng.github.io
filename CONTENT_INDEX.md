# CONTENT_INDEX.md

本文件是博客写作 Agent 的文章索引入口。新增文章、修改文章、审查文章前，先读本文件，再决定需要打开哪些现有文章。

## 使用规则

- 不默认通读 `src/content/posts/` 下所有文章。
- 根据当前任务，只选择 1 到 3 篇最相关的文章作为参考。
- 只有用户明确要求全量盘点、统一审查或做整体改版时，才通读全部文章。
- 如果当前任务只涉及流程规则、模板或 schema，可不额外阅读文章正文。

## 快速选文

- 写视觉笔记 / 组件化技术文章：优先看 `visual-notes-components.mdx`，再按主题补 1 到 2 篇。
- 写博客架构、内容组织、维护方式：优先看 `blog-project-architecture.mdx`。
- 写 Agent 工作流、自动化协作：优先看 `automation-agent-workflow.mdx`。
- 写部署、GitHub Pages、构建链路：优先看 `github-pages-deployment-guide.mdx`。
- 写网页自动化、选择器、RPA：优先看 `browser-automation-selectors.md`。
- 写缓存、数据清洗、简单数据流：优先看 `minimal-cache-logic.md`。

## 文章索引

| 文件 | 分类 | 主题概览 | 适合什么时候参考 |
| --- | --- | --- | --- |
| `src/content/posts/automation-agent-workflow.mdx` | `AI Agent` | Agent 工作流、失败边界、Mermaid 流程图 | 写 Agent 流程、自动化协作、可维护性文章时参考 |
| `src/content/posts/blog-project-architecture.mdx` | `Skill` | 博客架构、内容流、发布链路、视觉笔记结构 | 写本博客说明、仓库结构、内容维护规则时参考 |
| `src/content/posts/browser-automation-selectors.md` | `影刀RPA` | 选择器优先于坐标点击的判断原则 | 写网页自动化、RPA、可验证操作规范时参考 |
| `src/content/posts/github-pages-deployment-guide.mdx` | `Skill` | GitHub Pages、Astro、Actions 部署流程 | 写部署说明、构建发布、静态站点原理时参考 |
| `src/content/posts/mdx-code-diagrams.md` | `Skill` | 代码块、Callout、图表可读性 | 写展示型技术文章、图表说明、下载链接规范时参考 |
| `src/content/posts/minimal-cache-logic.md` | `数据处理` | 最小抽象、缓存读写、保存时机 | 写数据处理、缓存、显式数据流文章时参考 |
| `src/content/posts/visual-notes-components.mdx` | `Skill` | VisualGrid、MetricCard、FeatureCard、DecisionFlow 示例 | 写视觉笔记、MDX 组件化文章时优先参考 |
