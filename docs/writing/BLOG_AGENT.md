# 博客写作规则

本文件负责文章内容、frontmatter、分类、公开状态、写作边界和最小发布检查。

视觉表达是本站的首要写作方向。文字保持专业、直接和准确，不需要刻意强化个人博客口吻。

## 内容原则

1. 正式文章放在 `src/content/posts/`，视觉实验和 Demo 放在 `src/content/posts/visual-lab/`。
2. 不虚构作者经历、项目结果、数据或第一人称判断。
3. 作者提供的事实、Agent 推断和外部资料要能区分；不确定内容明确标注。
4. 保留真实场景、失败、取舍和边界，避免正确但空泛的总结。
5. 默认使用专业、直观的表达；用户明确要求时再调整口语程度。

## Frontmatter

新文章从 `templates/post.mdx` 开始，字段以 `src/content.config.ts` 为最终依据。

| 字段 | 规则 |
| --- | --- |
| `title`、`description` | 必填，直接说明主题和价值 |
| `date` | 使用 `YYYY-MM-DDTHH:mm:ss+08:00` |
| `updated` | 可选，存在时使用相同格式 |
| `category` | 只能使用固定分类 |
| `tags` | 使用具体主题词 |
| `minutes` | 使用合理的阅读时间整数 |
| `featured` | 默认 `false` |
| `series`、`seriesOrder` | 可选；进入系列时两个字段同时填写，顺序使用正整数 |
| `draft` | 默认 `false` |
| `private` | 默认 `false` |

`private: true` 只表示不进入公开页面和索引，不是密码保护。

## 分类

| 分类 | 使用场景 |
| --- | --- |
| `生活` | 健康、消费、工作感受和日常观察 |
| `实践` | 项目、工具改造、踩坑、工作流和实际案例 |
| `教程` | 系统教学、系列内容和操作手册 |
| `视觉实验室` | 组件、交互、图表和文章展示方式 Demo |

新文章默认使用 `实践`；生活经验用 `生活`；系统教学用 `教程`。

## 工作方式

### 小范围修改

改字、事实修正、链接、frontmatter 和局部小改直接执行：

- 只读目标文章和必要上下文。
- 不重新规划全文。
- 不读取视觉模式库或 Demo。

### 新文章或结构性重写

额外读取 `docs/ARTICLE_VISUAL_SYSTEM.md` 和 `docs/MDX_WRITING_GUIDE.md`，写作前只判断：

1. 核心信息关系是什么。
2. 整篇最适合呈现成什么网页。
3. 横向视觉在移动端如何转换。

这三个判断不要求单独输出成长篇 brief。教程、流程、规则和系统文章优先使用完整视觉章节，但不要求每个 `H2` 套同一骨架。

### 参考内容

- 需要参考旧文时，先读 `docs/writing/CONTENT_INDEX.md`，再打开 1 到 3 篇最相关正文。
- 需要组件时才读 `docs/MDX_COMPONENTS.md`。
- 需要复杂视觉模式时才读 `docs/MDX_PATTERN_LIBRARY.md`。
- 需要看实际效果时读 `docs/writing/VISUAL_LAB.md`，最多选择 1 篇相关 Demo。

## 索引

1. 新增公开正式文章后更新 `docs/writing/CONTENT_INDEX.md`。
2. 草稿和私密文章在公开前不要求进入内容索引。
3. 新增视觉实验文章后更新 `docs/writing/VISUAL_LAB.md`。

## 静态文件

下载文件放在 `public/files/`，文章使用 `/files/` 链接。这里是公开文件目录，不能放私密资料、账号、token 或其他敏感文件；private 文章不等于 private 文件。

## 最小发布检查

常规创建或编辑只检查：

1. frontmatter 合法，公开文章保持 `draft: false`、`private: false`。
2. 没有模板占位词和明显敏感信息。
3. 运行当前环境中可用的相关测试或构建；不可运行时直接说明。

只有新增复杂视觉结构、修改布局或文章专属 CSS 时，才检查一次桌面端和移动端页面。文章公开状态不等于获得 commit、push 或部署权限。
