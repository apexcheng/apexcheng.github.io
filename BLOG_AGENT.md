# BLOG_AGENT.md

本文件只给写作、审查、发布博客文章使用。Agent 默认先读 `llms.txt`；只有任务涉及文章内容时再读本文件。

## 文章来源

- 文章内容源是 `src/content/posts/*.md` / `*.mdx`。
- 新文章默认复制 `templates/post.mdx` 后填写，优先使用 `.mdx`。
- 新增文章后，同步在 `CONTENT_INDEX.md` 增加或更新一行索引。
- 需要参考旧文章时，先读 `CONTENT_INDEX.md`，只打开 1 到 3 篇最相关正文。
- 不写入数据库，不新增导入 / 导出流程，不修改业务代码。

## Frontmatter

文章必须包含模板中的 frontmatter 字段。重点规则：

- `date` 使用 `YYYY-MM-DD`；新文章默认使用创建当天，除非用户指定日期。
- `category` 只能是 `AI Agent`、`影刀RPA`、`Skill`、`数据处理`、`视觉实验室`。
- 新文章默认保持 `draft: true`、`featured: false`、`private: false`。
- 只有用户明确说“发布”“确认发布”“把 draft 改成 false”“可以公开”等同等意思时，才可改为 `draft: false`。
- `private: true` 只表示不公开进入站点页面和索引，不是密码保护。

分类选择：

- `AI Agent`：Agent 工作流、提示词、自动化协作、模型使用经验。
- `影刀RPA`：影刀 RPA、页面自动化、流程维护经验。
- `Skill`：Codex / Agent Skill、插件能力、可复用提示词和操作规范。
- `数据处理`：Excel、CSV、清洗、转换、统计、报表和数据流说明。
- `视觉实验室`：视觉组件、交互效果、页面样式、文章展示方式等演示内容；当用户想先看效果、做样式选型或比较多个视觉方案时，优先放在这里。

## 写作规则

- 默认写成视觉笔记 / 技术说明页，不写成长篇流水账。
- 开头先给 1 到 2 句结论，再展开指标、流程、模块和细节。
- 每个主要信息块也优先先给结论，再给原因、例子或边界。
- 组件只服务于指标、对比、流程、架构、决策或重点结论；不要为了展示效果强行堆组件。
- 普通说明、列表、代码块继续用 Markdown；代码块必须标注语言。
- 代码块默认沿用站点全局代码字体：`Consolas, "SFMono-Regular", "JetBrains Mono", "Fira Code", monospace`，不要在文章或组件里单独改成其他字体。
- 标题短，信息分层清楚；正文段落尽量短。
- 不确定的事实写简短 TODO 或向用户确认，不要编造。

### 写作前准备

长文、新文章或结构不清楚的改写任务，先做轻量 brief；小修小补可以跳过。

brief 至少确认：

- 主题和一句话结论。
- 目标读者：读者是谁、已经知道什么、看完后能做什么。
- 文章类型：视觉笔记、技术说明、工作流复盘、RPA 经验、数据处理案例、案例复盘、对比决策、清单型笔记或教程。
- 素材清单：已有事实、可引用旧文、需要外部资料、需要用户确认的内容。
- 推荐结构：结论、指标概览、流程 / 图表、模块拆解、关键细节、检查清单。
- 风险：事实不确定、隐私敏感、需要运行验证。

选题过泛、太像普通教程标题、缺少读者或搜索容易跑偏时，先重写成更具体的场景题目。

写具体产品、工具、框架、人物或项目时，先做“具名主题拆解”：官方定义、实现示例、真实生态、垂直案例、本博客适配。只读取与当前文章相关的资料。

常用结构：

```text
一句话结论
指标概览
核心路径 / 架构图 / 决策树
模块分栏
关键细节
检查清单 / 结论
```

### 现有视觉组件用法

- `VisualGrid`：组织 2 到 4 个同类信息块，适合概览、对比、模块拆解。
- `MetricCard`：放在文章前半部分，展示场景、输入、输出、耗时、风险、结果等高扫描信息。
- `FeatureCard`：解释一个模块、步骤、角色、场景或能力边界；每张卡只讲一个点。
- `HighlightBox`：强调关键结论、推荐做法、风险提醒或检查清单；不要连续堆多个高亮框。
- `DecisionFlow`：表达线性步骤、判断顺序或取舍路径；复杂分支优先用 Mermaid。

常用 import：

```mdx
import MetricCard from '../../components/MetricCard.astro';
import FeatureCard from '../../components/FeatureCard.astro';
import VisualGrid from '../../components/VisualGrid.astro';
import HighlightBox from '../../components/HighlightBox.astro';
import DecisionFlow from '../../components/DecisionFlow.astro';
import Mermaid from '../../components/Mermaid.astro';
```

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
- 一段只讲一个点；有 3 个以上并列项时用列表，但不要连续堆列表。
- 同类信息放在同一个 `VisualGrid` 中，例如“3 个输入来源”“4 层防护”“2 种输出形态”。
- 对比关系优先用分栏卡片；判断关系优先用决策树；步骤关系优先用流程图或 `DecisionFlow`。
- 代码只展示关键片段；代码前后说明输入、输出、边界，不贴大段无解释源码。

### 图表 / Mermaid 规则

- 文章至少要考虑是否需要一张图；如果主题涉及流程、架构、工具选择、状态流转，优先使用 Mermaid。
- Mermaid 适合画 `flowchart`、`sequenceDiagram`、模块架构图、决策树；不要用图替代所有正文。
- 工具选择优先用决策树；数据流优先用 `flowchart`；多角色协作优先用 `sequenceDiagram`；组件用法可用 `VisualGrid`。
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
- 不推荐空泛开头、抽象大词或只有“很重要”但没有例子、证据或操作的句子。

### 资料与事实处理

- 重要判断尽量交叉查看不同来源或不同角度；做不到时标注不确定性。
- 没有来源的强断言，改成经验判断、TODO 或“需验证”。
- 引用标题必须来自实际看到的页面、README 或资料，不要自行生成看起来合理的标题。
- 研究输出不要堆资料：每段只表达一个具体 claim，引用放在对应句子里，不在结尾重复堆 Sources。

### 重写旧文

重写旧文时保持最小改动：

1. 先读原文，列出要保留的观点、个人经验和链接。
2. 先修结构、事实、段落和占位词，不整篇重写原本语气。
3. 保留真实项目处理方式、踩坑、验证结果、当前判断和取舍。
4. 不做与当前重写目标无关的格式化、改名或重构。

### 完整示例

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

## 审查规则

审查文章时必须检查：

- frontmatter 字段完整，分类只使用固定四类之一。
- 未经用户确认发布的新文章仍是 `draft: true`。
- 没有账号、token、公司内部资料、私密文件路径等敏感信息。
- 没有残留模板占位词，例如“待填写”“replace me”“模块一”“模块二”“关键事实一”“关键事实二”。
- 文章有清晰结构；技术流程、架构或决策类内容优先用图表或分栏表达。
- Mermaid 图只表达一个问题，节点文字短。
- 引用 `public/files/` 文件时，确认文件可以公开访问。
- 检查是否有空泛开头、抽象大词、无结论的平衡句，或没有例子的“很重要”。
- 轻量检查可读性和内部链接：标题具体、描述清楚、相关旧文链接自然、代码块标注语言。

## 发布规则

发布必须由用户明确确认。发布时：

1. 再次检查敏感信息和模板占位词。
2. 将目标文章改为 `draft: false`。
3. 保持 `private: false`，除非用户明确要求不公开。
4. 运行 `npm test` 和 `npm run build`。

## 静态文件

可下载文件放在 `public/files/`，文章使用 `/files/` 开头链接。该目录内容都是公开文件，会随站点发布，不能放私密资料；private 文章不等于 private 文件。
