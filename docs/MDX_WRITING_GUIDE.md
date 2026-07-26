# MDX 写作指南

本文件只说明 MDX 的落地方式。视觉判断以 `docs/ARTICLE_VISUAL_SYSTEM.md` 为准。

## 什么时候使用 MDX

需要自定义视觉结构、Astro 组件、复杂流程、参数映射或文章专属样式时使用 MDX。普通文字能清楚表达时可以继续使用 Markdown。

## 结构与样式

1. 根据内容组织 HTML / MDX，不复制固定章节骨架。
2. 单篇文章专属样式优先放在文章自身的 `<style>` 中。
3. 所有自定义样式使用文章专属 class 限定范围，避免污染全站。
4. 多篇文章真实复用同一结构后再提取 Astro 组件。
5. 只导入实际使用的组件，不为一次性内容增加配置层或通用协议。
6. 代码和命令保持可复制文本，不画进不可复制的视觉块。

## 常用 import

正式文章位于 `src/content/posts/` 时：

```mdx
import Callout from '../../components/Callout.astro';
import MetricCard from '../../components/MetricCard.astro';
import FeatureCard from '../../components/FeatureCard.astro';
import VisualGrid from '../../components/VisualGrid.astro';
import HighlightBox from '../../components/HighlightBox.astro';
import DecisionFlow from '../../components/DecisionFlow.astro';
import Mermaid from '../../components/Mermaid.astro';
```

视觉实验文章位于 `src/content/posts/visual-lab/` 时，将相对路径改为 `../../../components/`。

组件属性和边界只在需要时查看 `docs/MDX_COMPONENTS.md`。

## 响应式

1. 横向流程和多列布局在移动端改为纵向。
2. 长表格允许局部滚动，整页不能横向溢出。
3. 不通过缩小正文字号维持桌面排列。
4. 完整视觉块可以拓宽到正文栏之外，但不得与目录、侧栏或页面边缘冲突。
5. 信息图内部的视觉标题不使用重复 `H2`。

## 验证

- 普通文字、链接和 frontmatter 修改不需要页面截图。
- 新增复杂视觉结构、布局或局部 CSS 时，检查一次桌面端和移动端。
- 运行当前环境中可用的构建；无法运行时直接说明。
