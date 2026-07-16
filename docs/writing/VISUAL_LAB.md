# 视觉实验室索引

视觉实验室用于测试博客文章的视觉表现，也用于给 Agent 提供可参考的展示样式。

它是博客里的 Demo 分类，不是正式正文文章目录。

## 目录位置

```txt
src/content/posts/visual-lab/
```

## 使用场景

1. 用户想先看效果。
2. 用户要比较多个样式方案。
3. 需要测试代码块、流程图、卡片、分栏、Callout、组件展示。
4. Agent 写文章时需要参考视觉笔记排版。

## Demo 列表

| 文件 | 用途 |
| --- | --- |
| `src/content/posts/visual-lab/excel-formula-visual-patterns.mdx` | Excel 公式教学可视化模式，覆盖 19 个条件统计、文本处理和查找匹配函数，并归纳公式参数映射、文本切片、清洗拼接、文字定位和查找坐标等 7 种复用方式 |
| `src/content/posts/visual-lab/article-visual-system-demo.mdx` | 文章视觉系统实战 Demo，展示一篇文章如何先做视觉方案，再用总览、流程、路由、风险和审查面板组织成视觉文章 |
| `src/content/posts/visual-lab/mdx-design-patterns-gallery.mdx` | MDX 文章视觉模式参考，展示结论卡、Bento、指标看板、对比面板、问题链路、时间线、案例拆解、决策树和总结横幅 |
| `src/content/posts/visual-lab/screenshot-mdx-replica-demo.mdx` | 截图风格 MDX 复刻示例，展示 Agent 功能矩阵、安全防御报告和搜索工具决策树三类定制视觉组件 |
| `src/content/posts/visual-lab/mdx-components-demo.mdx` | MDX 文章可视化综合示例，包含提示块、流程步骤、对比表、指标卡和总结块 |
| `src/content/posts/visual-lab/table-style-demo.mdx` | 文章表格样式示例，包含边框表格、宽表格、业务判断表和字段说明表 |
| `src/content/posts/visual-lab/code-block-style-lab.mdx` | 代码块样式对比和全局代码块风格选型 |
| `src/content/posts/visual-lab/context-flow-demo.mdx` | 上下文流程图组件展示 |
| `src/content/posts/visual-lab/visual-notes-components.mdx` | MetricCard、FeatureCard、VisualGrid、HighlightBox、DecisionFlow 组件示例 |
| `src/content/posts/visual-lab/mdx-code-diagrams.md` | 代码块、Callout、图表和静态文件链接示例 |

## 使用边界

1. 视觉实验室文章可以发布到博客中，分类统一为 `视觉实验室`。
2. Demo 文章可以作为参考，但不代表正式文章必须照搬。
3. 正式正文文章仍然放在 `src/content/posts/` 根层或对应分类目录中。
4. 引用视觉实验室文章的组件写法时，要注意相对路径层级。
