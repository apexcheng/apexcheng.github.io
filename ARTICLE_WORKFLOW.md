# ARTICLE_WORKFLOW.md

本文件说明 Agent 新增、审查、发布博客文章的固定流程。所有文章仍使用当前 Astro / MDX / GitHub Pages 静态发布方式，不新增依赖，不修改业务代码。

## 1. 新增文章

1. 先读写作规则：
   ```text
   AGENTS.md
   BLOG_AGENT.md
   ARTICLE_WORKFLOW.md
   CONTENT_INDEX.md
   templates/post.mdx
   src/content/posts/visual-notes-components.mdx
   ```
2. 先读 `CONTENT_INDEX.md`，不要默认通读全部文章；只根据当前任务选择 1 到 3 篇参考文章。
3. 确认文章输入来源：用户草稿、链接、笔记、代码片段或明确主题。
4. 选择固定分类之一：
   ```text
   AI Agent
   影刀RPA
   Skill
   数据处理
   ```
5. 复制模板：
   ```bash
   cp templates/post.mdx src/content/posts/article-slug.mdx
   ```
6. 填写 frontmatter，保持新文章默认：
   ```yaml
   draft: true
   featured: false
   private: false
   ```
7. 按视觉笔记 / 技术说明页结构写正文：
   - 开头先给一句话结论。
   - 用 `VisualGrid + MetricCard` 做指标概览。
   - 用 Mermaid 或 `DecisionFlow` 表达流程、决策树或架构图。
   - 用 `FeatureCard` 做模块、步骤或场景分栏。
   - 用 `HighlightBox` 收束关键原则、风险或检查清单。
8. 不确定的事实标注 TODO 或向用户确认，不要编造。

## 2. 审查文章

审查时先看内容是否符合发布边界，再看表达质量。

必须检查：

- frontmatter 字段完整，`category` 只使用固定四类之一。
- 新文章仍为 `draft: true`，除非用户已明确确认发布。
- 没有账号、token、公司内部资料、私密文件路径等敏感信息。
- 不得保留模板占位词，例如“待填写”“replace me”“模块一”“模块二”“关键事实一”“关键事实二”。
- 文章不是长篇普通 Markdown，至少有清晰的指标、流程、卡片、图表或分栏模块。
- Mermaid 图表节点短，图只表达一个问题。
- 代码块标注语言，命令和结论可验证。
- 引用 `public/files/` 文件时，确认文件可以公开访问。

建议检查：

- 标题短，二级标题负责分区，卡片标题像标签。
- 每段正文尽量短，长说明改成列表、卡片或图。
- 结尾有可执行结论、检查清单或下一步。

审查后运行：

```bash
npm test
npm run build
```

## 3. 发布文章

发布必须由用户明确确认。没有明确确认时，Agent 只能完成草稿、审查和构建验证，不能把 `draft` 改成 `false`。

允许发布的用户表达包括：

```text
发布这篇文章
确认发布
把 draft 改成 false
可以公开
```

发布步骤：

1. 再次确认文章没有敏感信息。
2. 将目标文章 frontmatter 改为：
   ```yaml
   draft: false
   ```
3. 保持 `private: false`，除非用户明确要求不公开。
4. 运行：
   ```bash
   npm test
   npm run build
   ```
5. 最终说明修改文件、验证结果和仍需用户处理的发布动作。

## 4. 不允许的操作

- 不改业务代码。
- 不引入新依赖。
- 不新增发布系统、数据库、后端接口或导入导出步骤。
- 不自行新增文章分类。
- 不在未确认时发布文章。
- 不把 `private: true` 当作密码保护。
- 不把未运行的验证说成已经通过。
