# MDX 组件参考

本文件记录项目已有的通用 MDX 组件及其 API，方便按需复用。组件清单不是文章可用设计的白名单；正式文章可以组合 HTML、MDX、Markdown、文章专属组件和样式，也可以创建新的表达方式。

## 现有组件

| 组件 | 主要用途 | 属性 |
| --- | --- | --- |
| `Callout` | 提示和补充说明 | `title?` |
| `MetricCard` | 数字、状态、耗时和风险 | `label`、`value`、`detail?`、`tone?` |
| `FeatureCard` | 模块、角色、场景和能力介绍 | `title`、`description`、`meta?` |
| `VisualGrid` | 网格布局 | `columns?: 2 \| 3 \| 4` |
| `HighlightBox` | 重点内容 | `title`、`eyebrow?` |
| `DecisionFlow` | 线性步骤 | `title?`、`items` |
| `Mermaid` | 图表、流程和关系图 | `chart`、`title?`、`caption?` |

`MetricCard.tone` 可使用 `blue`、`cyan`、`violet`、`green`。

`DecisionFlow.items` 的结构：

```ts
{
  title: string;
  description: string;
  label?: string;
}
```

## 使用说明

以上组件只是现有工具。可以按实际内容自由组合，也可以不使用。组件当前 API 的参数范围属于实现事实，不代表文章设计必须遵循某种布局、数量或内容形式。

文章专属或带有特定文案的组件可参考 `docs/writing/VISUAL_LAB.md`；需要时也可以直接编写文章专属实现。多篇文章确实复用后，再考虑提取为通用组件。
