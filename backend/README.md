# Django 后端内容源

这是个人博客的 Django 后端内容源。Django Admin 用来维护文章、分类和标签，数据库保存 Markdown / MDX 原文；发布前通过管理命令导出为 Astro 内容文件。

Astro 前台仍然读取 `src/content/posts/*.md` / `*.mdx` 静态构建，不在页面运行时请求 Django API。

## 安装依赖

在 WSL 项目目录中运行：

```bash
cd /home/cheng/projects/personal-blog
python3 -m pip install --user -r backend/requirements.txt
```

如需使用虚拟环境，可以自行在仓库外创建，避免提交虚拟环境目录。

## 迁移数据库

```bash
cd /home/cheng/projects/personal-blog
python3 backend/manage.py migrate
```

默认数据库是 `backend/db.sqlite3`，仅用于本地开发，不应提交到仓库。

## 创建管理员

```bash
cd /home/cheng/projects/personal-blog
python3 backend/manage.py createsuperuser
```

创建后可在 Django Admin 管理文章、分类和标签。文章正文填写在 `body` 字段中，直接保存 Markdown / MDX 原文。

## 启动 Django

```bash
cd /home/cheng/projects/personal-blog
python3 backend/manage.py runserver
```

常用地址：

- Admin: `http://127.0.0.1:8000/admin/`

当前后端只作为内容管理后台和构建前内容源使用，不提供给 Astro 前台运行时调用的文章 API。

## 导入现有文章

把当前 `src/content/posts/` 下的 Markdown / MDX 文章导入 Django 数据库：

```bash
cd /home/cheng/projects/personal-blog
python3 backend/manage.py import_posts
```

导入规则：

- slug 使用文件名，不处理嵌套路由。
- category 和 tags 不存在时自动创建。
- 重复导入同一 slug 时更新已有文章，不重复创建。
- body 保留 Markdown / MDX 原文，不做渲染。
- 这是迁移工具，不做双向自动同步。

测试或临时导入其他目录时可以指定：

```bash
python3 backend/manage.py import_posts --posts-dir /path/to/posts
```

## 导出文章

把 Django 数据库中的文章导出回 `src/content/posts/`：

```bash
cd /home/cheng/projects/personal-blog
python3 backend/manage.py export_posts
```

默认导出数据库中的所有文章。`draft: true` 和 `private: true` 会保留在 frontmatter 中，由 Astro 公开页面、RSS 和搜索入口继续过滤。

测试或临时导出到其他目录时可以指定：

```bash
python3 backend/manage.py export_posts --posts-dir /path/to/posts
```

导出规则：

- 如果已存在同 slug 的 `.mdx` 文件，优先覆盖 `.mdx`。
- 否则如果已存在同 slug 的 `.md` 文件，覆盖 `.md`。
- 如果同 slug 文件不存在，新建 `{slug}.md`。
- frontmatter 对齐当前 Astro posts schema。
- `draft`、`private`、`featured`、分类、标签、阅读时间等字段都会写入 frontmatter。
- 不导出 password 字段。
- body 保留数据库中的 Markdown / MDX 原文，不做渲染。

默认导出所有文章内容文件，包括 `draft: true` 和 `private: true`。这些文件仍由 Astro 页面、RSS 和搜索入口按现有边界过滤，不进入公开页面。

如需临时只导出公开文章，可以运行：

```bash
python3 backend/manage.py export_posts --public-only
```

## 发布流程

当前流程仍然保留 Astro 静态前台，不让 Astro 页面直接请求 Django API。推荐流程是：

```bash
python3 backend/manage.py export_posts
npm run build
```

也可以使用 package 脚本：

```bash
npm run build:content
```

也就是说：Django Admin 负责编辑，数据库保存 MD / MDX 原文，`export_posts` 负责写回 Astro 内容目录，Astro 继续按本地内容文件静态构建。

## 测试

```bash
cd /home/cheng/projects/personal-blog
python3 backend/manage.py test posts
```

测试覆盖 Markdown / MDX 导入、数据库导出、source_format、draft/private 静态发布边界等内容源能力。
