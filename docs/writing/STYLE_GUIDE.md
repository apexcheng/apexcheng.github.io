# 文章风格指南

本文件用于区分博客文章的文字风格和视觉表达方式。

## 默认判断

1. 默认文字风格：专业风格。
2. 默认文章形态：网页化视觉文章；教程、流程、规则和系统内容默认使用图解手册形态。
3. 大众风格只在用户明确要求时使用。
4. Agent 判断主题更适合大众风格时，先提醒用户确认。
5. 默认分类使用 `实践`；生活经验用 `生活`，系统教学和系列内容用 `教程`，视觉实验或 Demo 用 `视觉实验室`。

## 风格类型

| 风格 | 使用场景 | 写法 |
| --- | --- | --- |
| 专业风格 | 默认文章、项目说明、技术文章、架构说明、部署说明 | 结构清晰、信息准确、逻辑完整，可以使用必要术语，但不要故意写复杂 |
| 大众风格 | 面向普通读者的心得、经验、解释类文章 | 简单、稍微口语、少术语、多解释，更像个人心得 |
| 图解手册风格 | 教程、原理、规则、流程和操作手册 | 一章一张完整信息图，用视觉结构承担主要解释 |
| 视觉叙事风格 | 项目实践、Agent / RPA 工作流和复盘 | 用输入、判断、执行、结果和复盘形成连续网页故事 |
| 设计化文章风格 | 生活、观点、职场观察和个人经验 | 保留个人文字节奏，用专属视觉板组织情况、判断、边界和结论 |

## 网页化视觉文章规则

1. 开头先给 1 到 2 句结论。
2. 一个主要章节只解决一个读者问题，并形成完整视觉闭环。
3. 视觉块承担主要解释，正文只做承接、补充和边界说明。
4. 标题直接表达读者问题或具体结论，不使用“概览、模块、细节、总结”等空泛标题凑结构。
5. 一篇文章使用稳定的颜色、标签、边框和层级语义，但不同文章不复制同一视觉骨架。
6. Mermaid、卡片、分栏和表格只在关系适合时使用，不作为默认装饰。
7. 视觉块内部不要重复使用会污染文章目录的 `H2`；视觉标题使用普通元素表达。
8. 不为了显得丰富而增加无意义图标、渐变、步骤或卡片。

## 表格与可视化块宽度

1. 普通内容块默认贴合实际内容宽度；完整信息图章节和专题页可以有意识地拓宽到正文栏之外。
2. 不要在文章或组件里随意写 `width: 100%`、`min-width: 100%`、`flex: 1`，让内容型块状元素强制撑满整行。
3. 外层边框应该贴近实际内容，不要包住右侧大片空白。
4. 长表格、长流程图可以横向滚动，但不能撑坏移动端。
5. 数据大表、仪表盘、多列对比、整章信息图和专题页布局允许全宽或超出正文栏，但必须验证桌面与移动端。

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
