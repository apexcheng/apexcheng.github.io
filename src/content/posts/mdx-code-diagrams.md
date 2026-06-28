---
title: 让技术博客里的代码块、Callout 和图表更好读
description: 长文中的视觉节奏、代码块样式和图表容器。
date: 2026-06-08
category: Markdown / MDX
tags:
  - MDX
  - Mermaid
minutes: 7
featured: false
---

## 阅读节奏

技术文章不是把信息堆上去就结束。代码、图表和提示块要服务理解，而不是成为装饰。

## 代码块

代码块适合使用深色背景，和正文形成清晰边界。

```bash
npm run build
```

## 文件下载链接

文章可以链接到公开静态文件，例如：[下载示例文件](/files/example.pdf)。

示例路径需要先把文件放入 `public/files/` 后才可下载；不要把私密资料放进这个目录。

## 图表

流程图和架构图应该有标题、容器和简短说明，方便读者知道图在解释哪一段逻辑。
