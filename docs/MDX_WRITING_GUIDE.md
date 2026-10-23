# MDX 写作指南

本文件只说明 MDX 的落地方式。视觉判断以 `docs/ARTICLE_VISUAL_SYSTEM.md` 为准。

## 什么时候使用 MDX

需要自定义视觉结构、Astro 组件、复杂流程、参数映射或文章专属样式时使用 MDX。普通文字能清楚表达时可以继续使用 Markdown。

## 结构与样式

1. 单篇文章专属样式优先放在文章自身的 `<style>` 中，并使用文章专属 class 限定范围，避免污染全站。
2. 多篇文章确实复用同一结构后再提取 Astro 组件；只导入实际使用的组件，不为一次性内容增加配置层或通用协议。
3. 图表或完整视觉块可按需拓宽正文栏，但不能遮挡目录、侧栏或页面边缘。

## 常用 import

正式文章位于 `src/content/posts/` 时：

```mdx
import Callout from '../../components/Callout.astro';
```

其它组件按需从 `docs/MDX_COMPONENTS.md` 选择并替换 import 名称。视觉实验文章位于 `src/content/posts/visual-lab/` 时，将相对路径改为 `../../../components/`。

响应式、视觉标题及可访问性以 `docs/ARTICLE_VISUAL_SYSTEM.md` 为准；完稿和页面验收以 `docs/writing/BLOG_AGENT.md` 为准，工程构建以 `docs/DEV_RULES.md` 为准。
