# Design

## 设计来源

当前 UI 以 `tmp/design-mockups/clean-tech-journal-full/` 为准。

设计稿包括：

| 文件 | 页面 |
|---|---|
| `clean-tech-journal-01-home-complete` | 首页 |
| `clean-tech-journal-02-article-detail` | 文章详情页 |
| `clean-tech-journal-03-article-list` | 文章列表页 |
| `clean-tech-journal-04-projects` | 项目页 |
| `clean-tech-journal-05-mobile-layouts` | 移动端布局 |
| `clean-tech-journal-06-design-system` | 设计规范 |

## 整体风格

```text
Clean Tech Journal = 干净的技术期刊感 + 个人技术知识库
```

要求：

- 内容优先，不做营销页。
- 轻技术感，不做重赛博朋克。
- 卡片靠细边框和留白区分，少用阴影。
- 代码块作为视觉重点。
- Mermaid / 架构图放进独立图表容器。

## 页面结构

### 首页

```text
Hero
→ 主题入口：AI / RPA / Projects / Guides
→ 精选文章
→ 项目记录
→ Footer
```

首页重点是说明“写什么”和“从哪里开始看”。

### 文章详情页

采用三栏思路：

```text
左侧目录 / 中间正文 / 右侧文章信息
```

正文宽度控制在 680-760px，优先保证长文阅读体验。

### 文章列表页

左侧分类筛选，右侧文章列表。文章卡片保持简洁，突出标题、摘要、分类和日期。

### 项目页

项目以 case study 卡片展示，不做夸张作品集。每个项目说明背景、方案、技术栈和复盘。

## 设计规范

### 颜色

| 用途 | 色值 |
|---|---|
| 背景 | `#F7F8FB` |
| 正文 | `#111827` |
| 次级文字 | `#526174` |
| 主色 | `#2563EB` |
| 辅助色 | `#0E7490` |
| 边框 | `#D8E1EE` |
| 代码块背景 | `#0F172A` |

### 字体

- 中文：系统无衬线，优先 `PingFang SC` / `Microsoft YaHei`。
- 英文：`Inter` / `system-ui`。
- 代码：`JetBrains Mono` / `Consolas`。

### 组件

第一版优先落地：

- 顶部导航
- Hero 代码面板
- 主题入口卡片
- 文章卡片
- 项目卡片
- 标签 Chip
- Callout
- 代码块
- Mermaid 图表容器

## 暂不做

- 复杂滚动动画
- 大量装饰图
- 3D 效果
- 复杂设计系统
- 为少量页面封装过多组件
