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
| `src/content/posts/visual-lab/code-block-style-lab.mdx` | 代码块样式对比和全局代码块风格选型 |
| `src/content/posts/visual-lab/context-flow-demo.mdx` | 上下文流程图组件展示 |
| `src/content/posts/visual-lab/visual-notes-components.mdx` | MetricCard、FeatureCard、VisualGrid、HighlightBox、DecisionFlow 组件示例 |
| `src/content/posts/visual-lab/mdx-code-diagrams.md` | 代码块、Callout、图表和静态文件链接示例 |

## 使用边界

1. 视觉实验室文章可以发布到博客中，分类统一为 `视觉实验室`。
2. Demo 文章可以作为参考，但不代表正式文章必须照搬。
3. 正式正文文章仍然放在 `src/content/posts/` 根层或对应分类目录中。
4. 引用视觉实验室文章的组件写法时，要注意相对路径层级。
