# 文章风格指南

本文件用于区分博客文章的文字风格和视觉表达方式。

## 默认判断

1. 默认文字风格：专业风格。
2. 默认文章形态：视觉笔记 / 技术说明页。
3. 大众风格只在用户明确要求时使用。
4. Agent 判断主题更适合大众风格时，先提醒用户确认。
5. 默认分类使用 `实践`；生活经验用 `生活`，系统教学和系列内容用 `教程`，视觉实验或 Demo 用 `视觉实验室`。

## 风格类型

| 风格 | 使用场景 | 写法 |
| --- | --- | --- |
| 专业风格 | 默认文章、项目说明、技术文章、架构说明、部署说明 | 结构清晰、信息准确、逻辑完整，可以使用必要术语，但不要故意写复杂 |
| 大众风格 | 面向普通读者的心得、经验、解释类文章 | 简单、稍微口语、少术语、多解释，更像个人心得 |
| 视觉笔记风格 | 需要卡片、流程图、重点块、分栏、Callout 的文章 | 先给结论，再用指标、流程、卡片和检查清单组织信息 |

## 视觉笔记规则

1. 开头先给 1 到 2 句结论。
2. 主要信息块先给结论，再给原因、例子或边界。
3. 标题短，信息分层清楚，正文段落尽量短。
4. 技术流程、架构、决策、对比优先考虑 Mermaid、卡片或分栏。
5. 普通说明、列表、代码块继续用 Markdown。
6. 组件只服务于指标、对比、流程、架构、决策或重点结论，不为装饰强行堆组件。

## 表格与可视化块宽度

1. 普通文章正文中的表格、流程图、Mermaid 图、SVG 图、可视化卡片，默认按内容宽度展示。
2. 不要在文章或组件里随意写 `width: 100%`、`min-width: 100%`、`flex: 1`，让内容型块状元素强制撑满整行。
3. 外层边框应该贴近实际内容，不要包住右侧大片空白。
4. 长表格、长流程图可以横向滚动，但不能撑坏移动端。
5. 只有数据大表、仪表盘、多列对比卡片、专题页布局，或用户明确要求全宽时，才允许全宽。

## 常用结构

```text
一句话结论
指标概览
核心路径 / 架构图 / 决策树
模块分栏
关键细节
检查清单 / 结论
```

## 现有组件

| 组件 | 用途 |
| --- | --- |
| `VisualGrid` | 组织 2 到 4 个同类信息块，适合概览、对比、模块拆解 |
| `MetricCard` | 展示场景、输入、输出、耗时、风险、结果等高扫描信息 |
| `FeatureCard` | 解释一个模块、步骤、角色、场景或能力边界 |
| `HighlightBox` | 强调关键结论、推荐做法、风险提醒或检查清单 |
| `DecisionFlow` | 表达线性步骤、判断顺序或取舍路径 |
| `Mermaid` | 表达流程图、架构图、决策树、时序图 |

## 常用 import

正式文章在 `src/content/posts/` 下时：

```mdx
import MetricCard from '../../components/MetricCard.astro';
import FeatureCard from '../../components/FeatureCard.astro';
import VisualGrid from '../../components/VisualGrid.astro';
import HighlightBox from '../../components/HighlightBox.astro';
import DecisionFlow from '../../components/DecisionFlow.astro';
import Mermaid from '../../components/Mermaid.astro';
```

视觉实验文章在 `src/content/posts/visual-lab/` 下时：

```mdx
import MetricCard from '../../../components/MetricCard.astro';
import FeatureCard from '../../../components/FeatureCard.astro';
import VisualGrid from '../../../components/VisualGrid.astro';
import HighlightBox from '../../../components/HighlightBox.astro';
import DecisionFlow from '../../../components/DecisionFlow.astro';
import Mermaid from '../../../components/Mermaid.astro';
```
