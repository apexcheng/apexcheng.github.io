# BLOG_AGENT.md

本文件给写作 Agent 使用，目标是把草稿整理成当前博客可发布的 Markdown / MDX 文章。

## 文章位置

博客文章放在：

```text
src/content/posts/
```

普通文章可以用 `.md`。需要使用组件时用 `.mdx`。

新文章模板放在：

```text
templates/post.mdx
```

新建文章时优先复制这个模板，再移动到 `src/content/posts/`。

## Frontmatter

当前文章必须包含这些字段：

```yaml
---
title: 文章标题
description: 一句话简介
date: 2026-06-28
category: AI / Workflow
tags:
  - Agent
  - Automation
minutes: 8
featured: false
draft: true
private: false
---
```

说明：

- `title`：文章标题。
- `description`：文章摘要，尽量短。
- `date`：发布日期，格式使用 `YYYY-MM-DD`。
- `category`：文章分类，先按文章内容直接填写。
- `tags`：标签数组，保持简短。
- `minutes`：预计阅读分钟数。
- `featured`：是否作为精选文章，默认 `false`。
- `draft`：是否为草稿。新文章默认 `true`，发布时改成 `false`。
- `private`：静态前台发布边界，默认 `false`。设为 `true` 时不会进入 Astro 首页、文章列表、详情页、RSS 或搜索索引。

## 发布规则

- 新文章默认 `draft: true`，不会出现在列表、首页，也不会生成文章详情页。
- 发布文章时，把 `draft` 改成 `false`。
- `private: true` 当前在 Astro 静态前台视为不公开发布，不会生成公开页面。不要在静态前台里实现假的密码输入页；真正密码访问后续需要后端能力支持。

## 当前可用组件

### Callout

用于文章中的重点提示。只在 `.mdx` 文件中使用。

```mdx
import Callout from '../../components/Callout.astro';

<Callout title="注意">
这里写重点内容。
</Callout>
```

`title` 可省略。

### Mermaid

用于流程图、架构图、时序图等。只在 `.mdx` 文件中使用。

```mdx
import Mermaid from '../../components/Mermaid.astro';

<Mermaid
  title="流程图标题"
  caption="一句话说明这张图表达什么。"
  chart={`flowchart LR
    A[输入] --> B[处理]
    B --> C[输出]`}
/>
```

图表不要过度复杂；复杂内容优先拆成多张图。

### ProjectCard

`ProjectCard` 当前主要用于项目页，不作为文章写作组件使用。

## 写作规则

- 不要为了展示效果强行使用组件。
- 普通正文、列表、代码块优先使用 Markdown。
- 技术文章结构建议从背景、问题、方案、实现、结果、复盘中选择需要的部分。
- 代码块必须标注语言，例如 `python`、`bash`、`js`。
- 草稿内容不确定时，保留简短 TODO，不要编造事实。

## 暂未确定

以下能力后续再补充，不要提前假设已经支持：

- 分类页和标签页的固定枚举。
- 图片存放规范。
- 新文章脚本。
- 更多 MDX 组件。
