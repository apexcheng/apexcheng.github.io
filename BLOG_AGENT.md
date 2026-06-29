# BLOG_AGENT.md

本文件给写作 Agent 使用，是本博客写作、审查和发布文章的核心规则。目标是把草稿整理成当前 Astro / MDX / GitHub Pages 静态博客可发布的文章，同时保持最小改动、结构清晰、事实可验证。

写作 Agent 必须先读本文件，再读：

```text
CONTENT_INDEX.md
ARTICLE_WORKFLOW.md
templates/post.mdx
src/content/posts/visual-notes-components.mdx
```

如果用户要求新增文章，也要读：

```text
prompts/write-blog-post.md
```

读完 `CONTENT_INDEX.md` 后，不要默认通读 `src/content/posts/` 下全部文章。新增文章、改文章、审查文章时，只根据当前任务选择 1 到 3 篇最相关的参考文章。

## 内容源规则

`src/content/posts/*.md` / `*.mdx` 是当前文章内容源，由 Agent 或人工直接维护。

新增或修改文章时，推荐流程是：

```text
复制 templates/post.mdx -> 填写草稿 -> 审查 frontmatter 和视觉结构 -> Astro build
```

不要写入数据库，不依赖 Django 后端，也不要新增导入 / 导出步骤。

## 文章文件

新文章模板放在：

```text
templates/post.mdx
```

新文章默认使用 `.mdx`，优先写成视觉笔记 / 技术说明页。只有用户明确要求纯 Markdown，或文章确实不需要组件时，才使用 `.md`。

新建文章时优先复制这个模板，确认后使用：

```bash
cp templates/post.mdx src/content/posts/article-slug.mdx
npm run build
```

## Frontmatter

当前文章必须包含这些字段：

```yaml
---
title: 文章标题
description: 一句话简介
date: 2026-06-28
category: AI Agent
tags:
  - Agent
  - 视觉笔记
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
- `category`：文章分类，只能使用固定分类：`AI Agent`、`影刀RPA`、`Skill`、`数据处理`。
- `tags`：标签数组，保持简短。
- `minutes`：预计阅读分钟数。
- `featured`：是否作为精选文章，默认 `false`。
- `draft`：是否为草稿。新文章默认 `true`，只有用户明确确认发布时才改成 `false`。
- `private`：静态前台发布边界，默认 `false`。设为 `true` 时不会进入 Astro 首页、文章列表、详情页、RSS 或搜索索引。

## 发布规则

- 新文章默认 `draft: true`，不会出现在列表、首页，也不会生成文章详情页。
- 写作 Agent 不得自行发布文章。只有用户明确说“发布这篇文章”“把 draft 改成 false”“确认发布”等同等意思时，才可以把 `draft` 改成 `false`。
- 未获得用户明确确认前，即使文章已完成、测试和构建通过，也必须保持 `draft: true`。
- 文章密码访问暂不实现；当前 `private: true` 只表示不公开发布，不会生成公开页面。

## 分类规则

文章分类固定为以下四类，不能新增同义分类、英文别名或临时分类：

```text
AI Agent
影刀RPA
Skill
数据处理
```

选择方式：

- `AI Agent`：Agent 工作流、工具选择、提示词、自动化协作、模型使用经验。
- `影刀RPA`：影刀 RPA 项目、流程设计、页面自动化、流程维护经验。
- `Skill`：Codex / Agent Skill、插件能力、可复用提示词和操作规范。
- `数据处理`：Excel、CSV、清洗、转换、统计、报表和数据流说明。

如果内容跨多个分类，选择文章主问题对应的一类，其余主题放入 `tags`。

## 静态文件下载

可下载文件放在 `public/files/`，文章里用 `/files/` 开头链接：

```md
[下载示例文件](/files/example.pdf)
```

`public/files/` 里的内容都是公开文件，会随静态站点发布。不能放私密资料、账号、token、公司内部文档。private 文章不等于 private 文件，只要文件在 `public/files/` 下就是公开可访问的。

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

### VisualGrid / MetricCard / FeatureCard / HighlightBox / DecisionFlow

用于把技术文章组织成视觉笔记。只在 `.mdx` 文件中使用。

```mdx
import MetricCard from '../../components/MetricCard.astro';
import FeatureCard from '../../components/FeatureCard.astro';
import VisualGrid from '../../components/VisualGrid.astro';
import HighlightBox from '../../components/HighlightBox.astro';
import DecisionFlow from '../../components/DecisionFlow.astro';
```

使用场景：

- `VisualGrid`：承载 2 到 4 列卡片，适合概览、能力对比、模块拆解。
- `MetricCard`：展示数字、等级、耗时、比例、状态等高扫描价值信息。
- `FeatureCard`：说明一个能力、模块、步骤或使用场景。
- `HighlightBox`：强调结论、关键原则、风险提醒或推荐做法。
- `DecisionFlow`：表达线性步骤、判断路径、取舍过程；复杂分支优先使用 Mermaid。

简短示例：

```mdx
<VisualGrid columns={3}>
  <MetricCard label="输入" value="URL" detail="用户给出明确页面。" tone="blue" />
  <MetricCard label="判断" value="2 步" detail="先看目标，再选工具。" tone="cyan" />
  <MetricCard label="输出" value="报告" detail="保留来源和结论。" tone="green" />
</VisualGrid>

<HighlightBox eyebrow="KEY" title="先给结论，再展开细节">
  视觉笔记要让读者先扫到判断、路径和结果，再阅读必要说明。
</HighlightBox>
```

### ProjectCard

`ProjectCard` 当前主要用于项目页，不作为文章写作组件使用。

## 写作规则

- 默认不要写成长篇普通 Markdown。新文章优先写成视觉笔记 / 技术说明页。
- 不要为了展示效果强行使用组件；组件必须服务于指标、对比、流程、架构、决策或重点结论。
- 普通说明、列表、代码块仍使用 Markdown；需要指标、对比、流程、架构和重点结论时优先使用 MDX 视觉组件。
- 技术文章结构建议从结论、指标、流程、模块、关键细节、检查清单中选择需要的部分。
- 标题短，信息分层清晰，少写大段纯文字。
- 代码块必须标注语言，例如 `python`、`bash`、`js`。
- 草稿内容不确定时，保留简短 TODO，不要编造事实。

## 视觉笔记 / 技术说明页风格

AI Agent、影刀 RPA、Skill、数据处理、自动化流程、工具选型等技术文章，默认不要写成普通 Markdown 长文。优先写成“视觉笔记 / 技术说明页”：读者先看到结构、指标、流程和关键判断，再进入细节。

### 文章结构建议

优先采用以下结构，可按内容删减：

1. **一句话结论**：开头 1 到 2 句说明本文解决什么问题、推荐什么做法。
2. **指标概览**：用 `VisualGrid + MetricCard` 放 3 到 4 个关键信息，例如适用场景、输入、输出、耗时、风险等级、推荐工具。
3. **核心路径**：用 Mermaid 或 `DecisionFlow` 画流程图、决策树、架构图、数据流。
4. **分层说明**：用 `FeatureCard` 分栏解释模块、步骤、角色、能力边界。
5. **关键细节**：用短段落、列表、代码块说明必要实现，不写流水账。
6. **结论 / 检查清单**：用 `HighlightBox` 或短列表收束成可执行规则。

### 标题写法

- 标题要短，优先 4 到 10 个字，表达信息块作用，例如“输入来源”“工具选择”“执行路径”“失败处理”。
- 避免长标题和口号式标题，不要把整句说明塞进标题。
- 二级标题负责分区，三级标题负责模块；不要连续堆很多无正文的标题。
- 卡片标题要像标签，正文再补一句解释。

### 内容分层方式

- 每个信息块先给结论，再给原因或例子。
- 一段正文尽量控制在 3 行以内；超过 5 行时，优先改成列表、卡片、流程图或表格。
- 同类信息放在同一个 `VisualGrid` 中，例如“3 个输入来源”“4 层防护”“2 种输出形态”。
- 对比关系优先用分栏卡片；判断关系优先用决策树；步骤关系优先用流程图或 `DecisionFlow`。
- 代码只展示关键片段；代码前后说明输入、输出、边界，不贴大段无解释源码。

### 图表 / Mermaid 规则

- 文章至少要考虑是否需要一张图；如果主题涉及流程、架构、工具选择、状态流转，优先使用 Mermaid。
- Mermaid 适合画 `flowchart`、`sequenceDiagram`、模块架构图、决策树；不要用图替代所有正文。
- 一张图只表达一个问题：流程归流程，架构归架构，决策归决策。
- 节点文字要短，节点内不写长句；长解释放在图下的 caption 或正文。
- 图太复杂时拆成多张图，而不是把所有分支塞进一张图。

### 卡片化模块规则

- 顶部概览优先使用 3 到 4 张 `MetricCard`，让读者快速扫到“是什么、何时用、风险、结果”。
- 功能、场景、角色、步骤说明优先使用 `FeatureCard`，每张卡只讲一个点。
- 强结论、推荐做法、风险提醒使用 `HighlightBox`，不要连续堆多个高亮框。
- 卡片内容要短：`label` 用名词，`value` 用数字、状态或关键词，`detail` 用一句话。
- 可在标题或标签中使用少量图标 / emoji 强化扫描，例如“输入”“判断”“输出”；不要让图标替代真实信息。

### 不推荐写法

- 不推荐从头到尾都是普通段落和列表。
- 不推荐按时间线流水账记录“我先做了什么、然后做了什么”。
- 不推荐一个标题下面堆大段纯文字。
- 不推荐无结构地连续贴代码、日志或命令输出。
- 不推荐为了好看强行堆组件；没有指标、对比、流程或重点结论时，保持普通 Markdown 即可。

### 简短示例

```mdx
import MetricCard from '../../components/MetricCard.astro';
import FeatureCard from '../../components/FeatureCard.astro';
import VisualGrid from '../../components/VisualGrid.astro';
import HighlightBox from '../../components/HighlightBox.astro';
import Mermaid from '../../components/Mermaid.astro';

本文结论：搜索类 Agent 先判断信息来源，再决定使用网页抓取、搜索 API 还是深度研究。

<VisualGrid columns={3}>
  <MetricCard label="输入" value="需求" detail="用户问题、URL 或关键词。" />
  <MetricCard label="判断" value="3 类" detail="URL、简单事实、复杂研究。" tone="cyan" />
  <MetricCard label="输出" value="结论" detail="附来源、边界和下一步。" tone="green" />
</VisualGrid>

<Mermaid
  title="搜索工具决策树"
  caption="先判断用户是否给了 URL，再判断问题复杂度。"
  chart={`flowchart TD
    A[用户需求] --> B{是否有 URL}
    B -->|是| C[抓取页面]
    B -->|否| D{是否复杂}
    D -->|否| E[普通搜索]
    D -->|是| F[深度研究]`}
/>

<VisualGrid columns={2}>
  <FeatureCard title="简单事实" meta="Search" description="用搜索快速确认当前信息，保留来源。" />
  <FeatureCard title="复杂研究" meta="Deep Research" description="拆问题、查多源、最后汇总判断。" />
</VisualGrid>

<HighlightBox eyebrow="RULE" title="先选路径，再写过程">
  读者需要先知道判断树和推荐动作，再看每个工具的细节。
</HighlightBox>
```

## 暂未确定

以下能力后续再补充，不要提前假设已经支持：

- 图片存放规范。
- 新文章脚本。
- 更多未列出的 MDX 组件。
- 私密文件下载能力。
