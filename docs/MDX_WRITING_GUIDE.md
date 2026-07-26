# MDX 写作指南

这份指南给后续 Agent 使用：正式文章默认先设计网页结构，再用 MDX 落地。MDX 不是给普通正文加装饰，而是让流程、规则、原理、判断和案例成为可直接阅读的网页视觉结构。

视觉总标准以 `docs/ARTICLE_VISUAL_SYSTEM.md` 为准；本文件只说明 MDX 的具体使用方式。

## 默认判断

教程、流程、规则、系统说明、项目架构和复杂复盘类正式文章，默认使用 MDX。

这些文章通常需要：

1. 一章一张完整信息图。
2. 横向流程、关系地图、参数映射、案例表或状态面板。
3. 桌面端拓宽布局和移动端纵向重排。
4. 文章专属颜色、标签、层级和局部样式。

生活记录、个人观点、短随笔可以继续以 Markdown 正文为主，但整篇仍应有专属视觉结构；不要因为使用 Markdown 就退回未经设计的长文。

## 正确工作顺序

```text
确定文章形态
  ↓
为每个主要章节设计完整视觉板
  ↓
先搭视觉骨架
  ↓
补充必要正文与事实
  ↓
桌面端 / 移动端截图审查
  ↓
构建与发布
```

不要先写完长篇正文，再寻找几个组件插进去。

## 一章一张完整信息图

教程、原理、规则和流程文章的每个主要 `H2`，默认形成一个完整视觉单元：

```text
章节问题或定义
总览关系
核心解析
案例或数据
错误与边界
结论
```

章节内可以混合使用：

- 自定义 HTML / MDX 结构。
- 文章专属 CSS。
- 现有 Astro 组件。
- Markdown 表格和代码块。
- Mermaid 图。

选择标准是能否降低理解成本，不是组件是否“高级”。

## 文章专属样式与组件

1. 单篇文章独有的视觉结构，优先直接写在该文章的 MDX 和 `<style>` 中。
2. 只有多篇文章真实复用同一结构时，才提取为 Astro 组件。
3. 不为一次性视觉块创建通用配置层、数据协议或复杂抽象。
4. 自定义样式必须限制在文章专属 class 下，避免污染全站。
5. 完整信息图可以有意识地超出正文栏，但必须验证目录、正文和移动端布局。

## 现有组件怎么用

现有组件是完整视觉章节中的子模式，不是文章模板。

### `HighlightBox` / `Callout`

用于关键结论、边界和短提醒。不要用多个总结框拼成文章。

### `VisualGrid` / `FeatureCard` / `MetricCard`

用于少量并列模块、指标或对比。卡片之间必须属于同一种信息关系。

### `DecisionFlow`

用于 3 到 5 个线性步骤。存在复杂分支、回路或角色关系时，再使用 Mermaid 或自定义结构。

### `Mermaid`

用于因果分支、依赖、架构或时序。普通顺序不要为了省设计直接交给 Mermaid。

## 正文与视觉的关系

1. 视觉块前后保留必要承接，但不要重复图中已经表达的内容。
2. 正文负责真实背景、事实依据、例外情况和作者经验。
3. 视觉负责让读者快速理解关系、步骤、判断和结果。
4. 一个章节只解决一个主要问题；不要在同一信息图中塞入多个无关主题。
5. 代码和命令仍然保持可复制文本，不要全部画进图片式结构。

## 响应式要求

1. 至少检查约 `1440px` 桌面端和 `390px` 移动端。
2. 横向流程在移动端改为纵向，不强行压缩成缩略图。
3. 教学正文不低于 `13px`，表格和公式保持可读。
4. 长表格允许局部横向滚动，整页不能出现横向溢出。
5. 完整信息图拓宽后，检查是否与文章目录、侧栏或页面边缘冲突。
6. 信息图内部不要重复使用 `H2`，避免目录出现伪章节。

## import 路径

正式文章在 `src/content/posts/` 下时：

```mdx
import Callout from '../../components/Callout.astro';
import MetricCard from '../../components/MetricCard.astro';
import FeatureCard from '../../components/FeatureCard.astro';
import VisualGrid from '../../components/VisualGrid.astro';
import HighlightBox from '../../components/HighlightBox.astro';
import DecisionFlow from '../../components/DecisionFlow.astro';
import Mermaid from '../../components/Mermaid.astro';
```

视觉实验文章在 `src/content/posts/visual-lab/` 下时：

```mdx
import Callout from '../../../components/Callout.astro';
import MetricCard from '../../../components/MetricCard.astro';
import FeatureCard from '../../../components/FeatureCard.astro';
import VisualGrid from '../../../components/VisualGrid.astro';
import HighlightBox from '../../../components/HighlightBox.astro';
import DecisionFlow from '../../../components/DecisionFlow.astro';
import Mermaid from '../../../components/Mermaid.astro';
```

只导入实际使用的组件。

## 发布前检查

1. frontmatter 字段完整，分类合法。
2. 文章形态和章节视觉方案已经明确。
3. 教程、流程、规则和系统类文章是否做到“一章一张完整信息图”。
4. 页面是否像完整网页作品，而不是组件堆叠。
5. 正文是否重复视觉块，视觉块是否真正解释内容。
6. 桌面端和移动端实际页面均已检查。
7. import、MDX 语法和文章专属样式无错误。
8. 本地构建通过；未运行时必须明确说明。
