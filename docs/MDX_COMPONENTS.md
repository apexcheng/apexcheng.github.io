# MDX 通用组件

本文件只记录可在多篇文章中复用的基础组件。文章专属或带硬编码文案的组件通过 `docs/writing/VISUAL_LAB.md` 查找，不作为通用 API。

## 组件清单

| 组件 | 主要用途 | 属性 |
| --- | --- | --- |
| `Callout` | 简短提示和补充说明 | `title?` |
| `MetricCard` | 数字、状态、耗时和风险 | `label`、`value`、`detail?`、`tone?` |
| `FeatureCard` | 模块、角色、场景和能力边界 | `title`、`description`、`meta?` |
| `VisualGrid` | 组织 2 到 4 个同类信息块 | `columns?: 2 \| 3 \| 4` |
| `HighlightBox` | 关键结论、风险和收束 | `title`、`eyebrow?` |
| `DecisionFlow` | 3 到 5 个线性步骤 | `title?`、`items` |
| `Mermaid` | 分支、架构、依赖和时序 | `chart`、`title?`、`caption?` |

`MetricCard.tone` 可使用 `blue`、`cyan`、`violet`、`green`。

`DecisionFlow.items` 的结构：

```ts
{
  title: string;
  description: string;
  label?: string;
}
```

## 使用边界

1. 组件是文章视觉结构中的子模式，不是文章模板。
2. 同一组卡片只放同一种信息关系。
3. `MetricCard.value` 保持简短，完整解释放在 `detail` 或正文。
4. `FeatureCard` 插槽只放短列表或必要补充，不放复杂嵌套正文。
5. 普通线性步骤使用 `DecisionFlow`；存在分支、回路、依赖或时序时使用 `Mermaid`。
6. 不连续堆叠多个 `HighlightBox`，也不为单篇文章新增通用组件。

需要实际示例时，从 `docs/writing/VISUAL_LAB.md` 选择 1 篇相关 Demo。
