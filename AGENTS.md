# AGENTS.md

本文件是 Codex、Claude Code、OpenClaw 等 Agent 的项目入口。

核心原则：**视觉优先、按需读取、最小改动、规则单一来源。**

## 项目边界

- 正式文章：`src/content/posts/`
- 视觉实验 / Demo：`src/content/posts/visual-lab/`
- Agent 规则和索引：`docs/`
- 文章模板：`templates/post.mdx`

正式文章默认是经过信息设计的网页作品。视觉表达优先于个人博客口吻，但必须服务内容，不机械套用旧文章或 Demo。

## 通用硬规则

1. 修改前只读取当前任务需要的上下文，不默认通读全部规则或文章。
2. 只处理当前任务直接相关的文件，不做无关重构、格式化或改名。
3. 保留工作区已有改动，不回滚、覆盖或清理非本次任务产生的内容。
4. 在当前实际环境和仓库根目录执行命令，不预设操作系统或运行环境。
5. 不确定的事实、页面行为、工具参数或验证结果必须明确标注。
6. 默认目标分支是 `main`；commit、push 和部署仅在用户明确要求时执行。

## 文章硬规则

1. 写作、审查或发布文章时，先读 `docs/writing/BLOG_AGENT.md`。
2. 新文章或结构性重写保持视觉优先，并按需读取 `docs/ARTICLE_VISUAL_SYSTEM.md` 和 `docs/MDX_WRITING_GUIDE.md`。
3. 写作前只需判断核心信息关系、整页视觉概念和移动端转换方式，不要求输出长篇视觉方案。
4. 改字、事实修正、链接、frontmatter 和局部小改直接执行，不重新规划全文，不读取 Demo。
5. 正式文章放在 `src/content/posts/`；Demo 放在 `src/content/posts/visual-lab/`。
6. 新文章默认 `draft: false`、`private: false`；只有用户明确要求草稿或私密时才改为 `true`。
7. 分类只使用 `生活`、`实践`、`教程`、`视觉实验室`。
8. 新增公开正式文章后更新 `docs/writing/CONTENT_INDEX.md`；新增 Demo 后更新 `docs/writing/VISUAL_LAB.md`。

## 按需路由

### 代码、样式、配置、测试或工程结构

读取 `docs/DEV_RULES.md`。

### 普通文章编辑

读取 `docs/writing/BLOG_AGENT.md` 和目标文章。

### 新文章、结构性重写或复杂视觉改造

额外读取：

- `docs/ARTICLE_VISUAL_SYSTEM.md`
- `docs/MDX_WRITING_GUIDE.md`

### 使用现有 MDX 组件

仅在需要组件时读取 `docs/MDX_COMPONENTS.md`。

### 选择复杂视觉模式或参考 Demo

仅在现有规则不足以完成设计时读取：

- `docs/MDX_PATTERN_LIBRARY.md`
- `docs/writing/VISUAL_LAB.md`

从视觉实验室最多选择 1 篇最相关 Demo，不默认通读。

### 参考旧文章

读取 `docs/writing/CONTENT_INDEX.md`，再选择 1 到 3 篇最相关正文。

### 规划后续任务

只在梳理路线图或选择下一项工作时读取 `TODO.md`。

## 规则维护

1. `AGENTS.md` 只放硬规则和路由，详细说明放在 `docs/`。
2. 同一规则只保留一个权威版本，其他文件只做简短引用。
3. 优先精简或合并现有规则，不为单次问题新增长期规则。
