# AGENTS.md

本文件是本项目给 Codex、Claude Code、OpenClaw 等 Agent 使用的默认入口。

核心原则：**AGENTS.md 只做导航；docs 做知识库；正式文章和视觉实验文章分开维护。**

---

## 项目定位

这是一个个人博客项目。

- 正式文章目录：`src/content/posts/`
- 视觉实验 / Demo 文章目录：`src/content/posts/visual-lab/`
- Agent 规则和索引目录：`docs/`
- Agent 路由文件：`llms.txt`

## 默认原则

```text
最小改动 | 结构简单 | 只改相关文件 | 不做无关重构 | 规则单一来源 | 方便维护
```

1. 修改前先读相关上下文，不要默认通读所有 Markdown。
2. 只处理当前任务直接相关的文件和内容。
3. 不确定的事实、页面行为、工具参数或构建结果必须标注“需运行验证”。
4. 工作区可能已有用户改动；不要回滚、覆盖或清理不是本次任务产生的改动。
5. 本项目默认在 `main` 分支开发和推送，除非用户明确要求新分支。

## 开发硬规则

1. 修改代码、样式、构建配置、测试或工程结构前，必须先读 `docs/DEV_RULES.md`。
2. 只改当前任务直接相关的文件和内容。
3. 不做无关重构、无关格式化、无关改名。
4. 不引入不必要依赖。
5. 不覆盖、回滚、清理用户已有改动。
6. 修改后必须说明验证方式；没运行测试就明确说未运行。

## 文章硬规则

1. 写作、审查、发布文章前，必须先读 `docs/writing/BLOG_AGENT.md`。
2. 正式文章写作、重写或可视化改造前，必须先读 `docs/ARTICLE_VISUAL_SYSTEM.md`；写 MDX 前必须先做文章视觉方案。
3. 判断文章风格时，必须参考 `docs/writing/STYLE_GUIDE.md`。
4. 需要参考旧文章时，必须先读 `docs/writing/CONTENT_INDEX.md`，只打开 1 到 3 篇相关正文。
5. 写 MDX 文章或做文章可视化前，必须参考 `docs/MDX_WRITING_GUIDE.md`、`docs/MDX_COMPONENTS.md` 和 `src/content/posts/visual-lab/mdx-components-demo.mdx`。
6. 任务涉及 MDX 文章、文章可视化或复杂排版时，必须参考 `docs/MDX_DESIGN_REFERENCES.md`、`docs/MDX_PATTERN_LIBRARY.md` 和 `src/content/posts/visual-lab/mdx-design-patterns-gallery.mdx`。
7. 功能矩阵、报告看板、决策树是视觉风格样板，不是固定文章骨架；正式文章必须根据内容设计专属视觉表达。
8. 正式文章放在 `src/content/posts/`。
9. 视觉实验 / Demo 文章放在 `src/content/posts/visual-lab/`。
10. 新文章默认 `draft: false`、`private: false`，公开发布；只有用户明确要求草稿、暂不发布或私密时，才设置为 `draft: true` 或 `private: true`。
11. 正式文章分类只使用 `生活`、`实践`、`教程`、`视觉实验室`；新文章默认用 `实践`，生活经验用 `生活`，系统教学用 `教程`。
12. 默认使用专业风格；只有用户明确要求大众风格时，才使用大众风格。
13. 新增或迁移文章后，必须同步更新 `docs/writing/CONTENT_INDEX.md`。

## 任务路由

### 修改代码、样式、构建配置、测试或工程结构

读取：

- `docs/DEV_RULES.md`

### 写作、审查、发布博客文章

读取：

- `docs/writing/BLOG_AGENT.md`
- `docs/ARTICLE_VISUAL_SYSTEM.md`
- `docs/writing/STYLE_GUIDE.md`
- `docs/writing/CONTENT_INDEX.md`

### 写 MDX 文章或做文章可视化

读取：

- `docs/ARTICLE_VISUAL_SYSTEM.md`
- `docs/MDX_WRITING_GUIDE.md`
- `docs/MDX_COMPONENTS.md`
- `docs/MDX_DESIGN_REFERENCES.md`
- `docs/MDX_PATTERN_LIBRARY.md`
- `src/content/posts/visual-lab/mdx-components-demo.mdx`
- `src/content/posts/visual-lab/mdx-design-patterns-gallery.mdx`

### 需要参考视觉效果或 Demo

读取：

- `docs/writing/VISUAL_LAB.md`
- `src/content/posts/visual-lab/`

### 需要给 Agent 快速判断入口

读取：

- `llms.txt`

## 内容边界

1. `src/content/posts/` 是正式正文文章目录，不是示例专用目录。
2. Demo、样式实验、组件展示、代码块样式对比统一放到 `src/content/posts/visual-lab/`。
3. `docs/` 只放 Agent 规则、写作规范、索引和维护说明，不作为正式博客文章目录。
4. `llms.txt` 给 Agent 看，用于快速理解项目入口和读取顺序。

## 规则维护边界

1. 更新规则前先判断规则类型：开发硬规则、文章硬规则、开发细则、写作细则、内容索引、视觉实验索引。
2. `AGENTS.md` 只放最关键、不能违反的硬规则和路由，不承载详细说明、长示例或 prompt 库。
3. 开发细则写入 `docs/DEV_RULES.md`，不要新建 `dev-docs/` 或恢复旧的 `docs/agent/` 结构。
4. 写作细则写入 `docs/writing/`，不要把写作规则放回根目录 `BLOG_AGENT.md` 或 `CONTENT_INDEX.md`。
5. 同一条规则只保留一个权威版本；其他文件只做简短引用，避免多处重复维护。
6. 新增规则要优先合并到现有文件和章节，除非用户明确要求新增规则文件。
7. 迁移或新增文章后，必须同步更新 `docs/writing/CONTENT_INDEX.md`；新增视觉实验文章还要同步更新 `docs/writing/VISUAL_LAB.md`。
