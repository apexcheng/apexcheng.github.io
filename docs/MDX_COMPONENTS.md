# MDX 组件清单

当前项目已经有一组轻量 Astro 组件，可以直接在 MDX 文章里使用。它们适合把文章做成“视觉笔记”，但不需要把每篇文章都组件化。

## Callout

适合场景：轻量提示、补充说明、注意事项。

文章用法：

```mdx
<Callout title="注意">
  这里放一段简短提醒。
</Callout>
```

注意事项：

- `title` 可选。
- 适合短内容，不适合放大段正文。

## MetricCard

适合场景：展示高扫描价值的信息，例如数量、状态、耗时、风险等级、输入输出。

文章用法：

```mdx
<MetricCard label="输入" value="3 类" detail="素材、上下文和发布约束。" tone="cyan" />
```

注意事项：

- 常和 `VisualGrid` 一起使用。
- `tone` 可用 `blue`、`cyan`、`violet`、`green`。
- `value` 要短，避免把完整句子塞进去。

## FeatureCard

适合场景：说明一个模块、步骤、角色、场景或能力边界。

文章用法：

```mdx
<FeatureCard title="先写正文" meta="STEP" description="先把结论和结构写清楚，再决定是否加组件。">
  <ul>
    <li>普通段落优先</li>
    <li>组件只服务重点信息</li>
  </ul>
</FeatureCard>
```

注意事项：

- `title` 和 `description` 必填。
- 插槽里可以放短列表，不建议放复杂嵌套内容。

## VisualGrid

适合场景：组织 2 到 4 个同类信息块，例如指标概览、模块拆解、方案对比。

文章用法：

```mdx
<VisualGrid columns={3}>
  <MetricCard label="场景" value="写作" detail="用于文章结构可视化。" />
  <MetricCard label="成本" value="低" detail="复用已有组件。" tone="green" />
  <MetricCard label="边界" value="少量" detail="不堆装饰组件。" tone="violet" />
</VisualGrid>
```

注意事项：

- `columns` 可用 `2`、`3`、`4`。
- 同一组里尽量放同类型内容。
- 卡片文案长度要接近，避免视觉重量差太多。

## HighlightBox

适合场景：关键结论、推荐做法、风险提醒、检查清单、文章收束。

文章用法：

```mdx
<HighlightBox eyebrow="KEY" title="先让内容成立">
  MDX 只负责把结构表现出来，不能替代文章本身的判断。
</HighlightBox>
```

注意事项：

- 适合文章级重点，不要连续堆多个。
- `eyebrow` 可选，建议短词，例如 `KEY`、`CHECK`、`NOTE`。

## DecisionFlow

适合场景：线性步骤、判断顺序、执行流程。

文章用法：

```mdx
<DecisionFlow
  title="MDX 使用顺序"
  items={[
    {
      label: 'Step 1',
      title: '先判断内容结构',
      description: '确认是不是流程、对比、指标或重点结论。',
    },
    {
      label: 'Step 2',
      title: '再选择组件',
      description: '能用 Markdown 解决的，不强行换成组件。',
    },
  ]}
/>
```

注意事项：

- 适合 3 到 5 步。
- `description` 写清动作和边界，不写空泛口号。

## Mermaid

适合场景：流程图、架构图、决策树、时序关系。

文章用法：

```mdx
<Mermaid
  title="文章结构"
  caption="复杂关系用图，简单顺序用 DecisionFlow。"
  chart={`flowchart LR
    A[素材] --> B[结构]
    B --> C[正文]
    C --> D[发布]`}
/>
```

注意事项：

- 图不要太大；复杂图优先拆成几张。
- `chart` 内容要保持 Mermaid 语法正确。
- 如果只是普通线性步骤，优先用 `DecisionFlow`。

## ContextFlow

适合场景：展示聊天工具里的上下文流转，主要用于 AI、Agent、对话机制类文章。

文章用法：

```mdx
import ContextFlow from '../../../components/ContextFlow.astro';

<ContextFlow />
```

注意事项：

- 这是更具体的教学型组件，不适合作为通用流程图。
- 使用前先确认主题确实和上下文机制有关。

## AgentFeatureMatrix

适合场景：复刻图一这种产品功能矩阵，用来展示 Agent 能力、模块能力或功能分组。

文章用法：

```mdx
import AgentFeatureMatrix from '../../components/AgentFeatureMatrix.astro';

<AgentFeatureMatrix />
```

注意事项：

- 当前组件内置一组 Agent 功能文案，适合视觉实验或同主题文章直接使用。
- 如果后续多篇文章都要改文案，再考虑把数据改成 props，不要提前复杂化。

## DefenseArchitectureReport

适合场景：复刻图二这种报告页，用指标行加分层列表展示安全防御、测试结果、流程校验或能力验证。

文章用法：

```mdx
import DefenseArchitectureReport from '../../components/DefenseArchitectureReport.astro';

<DefenseArchitectureReport />
```

注意事项：

- 当前组件内置 Hermes 防御架构示例，用于视觉实验和同主题文章。
- 它适合少量高价值指标，不适合承载大表格。

## SearchDecisionTree

适合场景：复刻图三这种深色信息图，用来展示搜索工具选择、Agent 工具路由或复杂决策树。

文章用法：

```mdx
import SearchDecisionTree from '../../components/SearchDecisionTree.astro';

<SearchDecisionTree />
```

注意事项：

- 当前组件内置 OpenClaw 搜索工具决策树文案，适合视觉实验或同主题文章直接使用。
- 桌面端按信息图排版，移动端会切换为纵向决策卡片，优先保证可读性。
- 它是定制信息图组件，不建议改造成通用流程图组件。

## CodeBlockStyleShowcase

适合场景：视觉实验室里的代码块样式对比。

文章用法：

```mdx
import CodeBlockStyleShowcase from '../../../components/CodeBlockStyleShowcase.astro';

<CodeBlockStyleShowcase />
```

注意事项：

- 主要用于 Demo，不建议放进普通正文文章。
- 不要为了单篇文章新增新的代码块样式组件。

## 建议组件清单

当前组件已经覆盖多数文章可视化需求。后续如果确实反复出现相同结构，可以再考虑：

| 建议组件 | 适合场景 | 先用什么替代 |
| --- | --- | --- |
| 对比卡片 | 两个方案并排比较，且表格承载不了细节 | Markdown 表格或 `FeatureCard` |
| Timeline | 按时间复盘项目过程 | `DecisionFlow` |
| Checklist | 发布前检查、操作清单 | `HighlightBox` 加列表 |

新增组件前先问一句：这个结构会不会在多篇文章里复用？如果不会，优先用现有组件或 Markdown。
