---
name: design-taste-frontend
description: Project-adapted Taste Skill for new pages, new visual concepts, or explicit visual-direction exploration. For existing-page redesigns, prefer redesign-existing-projects first and use this only when a materially new visual direction is needed. ARTICLE_VISUAL_SYSTEM and the existing Astro/MDX stack always take precedence; do not use for routine article edits.
---

# Design Taste Frontend

项目适配自 `Leonxlnx/taste-skill` 的 `design-taste-frontend`，参考版本：`ccbc15639c97057cbfcf32ecebc38ef716e4bb37`。

本 Skill 负责提高前端审美质量，不负责替代博客自己的信息设计方法。

## 使用边界

1. 任务触发和优先级遵循 `AGENTS.md`；文章内容关系、排版和响应式标准统一以 `docs/ARTICLE_VISUAL_SYSTEM.md` 为准。
2. 本 Skill 只补充新的视觉方向和表现手法，不把文章自动改成 Landing Page、SaaS 官网或固定卡片模板。
3. 沿用已有 Astro / MDX、字体、组件和主题；不因通用设计建议迁移框架或新装设计系统。

## 先读设计语境

开始设计前只需要确认这些信号，不输出冗长的 Agent 思考过程：

- 页面类型：文章、首页、专题页、视觉实验或其他。
- 内容关系：流程、对比、判断、层级、数据、案例、叙事或结论。
- 受众：第一次阅读的普通读者，而不是实现者自己。
- 已有视觉语言：主题、文章上下文、参考 Demo、用户提供的图片或页面。
- 当前目标：保留、增强还是重做。

如果上下文已经足够，不额外追问。

## 三个设计旋钮

内部用三个维度校准设计，不要求写入页面：

- `DESIGN_VARIANCE`：布局变化与非对称程度。
- `MOTION_INTENSITY`：动画和交互强度。
- `VISUAL_DENSITY`：信息密度。

文章类任务不要机械套默认值。根据内容决定：

- 教程 / 数据 / 机制文章：优先理解效率和结构清晰度。
- 观点 / 生活 / 职场文章：优先文字节奏和少量专属视觉结构。
- 开屏、首页、实验页面：可以提高布局变化和动效，但必须有明确叙事或交互目的。

## Anti-slop 审美检查

主动避免常见 AI 网页套路，但不要把这些规则变成新的模板：

- 无理由的紫蓝渐变、发光和玻璃效果。
- 居中大标题 + 副标题 + 两个按钮的固定 Hero 套路。
- 三个等宽卡片、每节都卡片化、卡片套卡片。
- 每节都使用相同 eyebrow、编号、标签和装饰性元信息。
- 为了“高级”强行大留白、超大标题或低信息密度。
- 为了“有设计感”加入不承担信息表达作用的纹理、状态点、假数据或伪 UI。
- 连续重复相同的左右图文、Bento、时间线或分栏模式。

## 设计重点

### 信息层级

- 第一眼能看出当前章节最重要的结论或关系。
- 视觉块承担流程、判断、对比、数据变化等关系，正文补背景与边界。
- 不把长正文切碎后塞进大量卡片。
- 内容密度由信息决定，不追求“页面填满”。

### 排版

- 标题、正文、数字、代码和注释形成清晰层级。
- 正文宽度、行高和段间距优先服务长文阅读。
- 字体选择服从项目已有主题，不擅自换字体来制造“高级感”。
- 避免孤行、过度窄列和移动端被迫缩小字号。

### 颜色与材质

- 一篇文章内部保持颜色语义稳定。
- 强调色数量受控；颜色必须有信息作用或明确视觉目的。
- 阴影、渐变、纹理、玻璃、光效只有在帮助层级、空间或叙事时使用。

### 动效

- 动画必须能解释它在表达什么：层级、叙事顺序、反馈或状态变化。
- 不为了“高级”加入 perpetual motion、横向劫持、视差或磁吸。
- 优先 `transform` / `opacity`，避免高频布局重排。
- 尊重 `prefers-reduced-motion`。
- 移动端交互必须独立检查，不能只缩放桌面设计。

## 实现约束

1. 先检查项目现有依赖和组件，优先复用。
2. 不因为上游 Taste Skill 推荐某个框架、图标库、动画库或设计系统就安装它。
3. 只有当前目标确实需要时才引入依赖，并遵守 `docs/DEV_RULES.md`。
4. 允许为完成视觉目标调整相关 DOM、组件、CSS 或动画结构，但不改无关业务、路由和数据层。
5. 高视觉文章仍然是文章，不牺牲可复制代码、目录、语义 HTML、SEO 和长文阅读体验。

## 完成前检查

- 按 `docs/ARTICLE_VISUAL_SYSTEM.md` 的视觉审查标准验收理解效率、可读性及移动端表现，不在此重复列出通用清单。
- 额外确认视觉概念没有被套成统一的 Taste 风格，设计旋钮和动效选择符合当前文章。

