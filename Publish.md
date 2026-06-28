# Publish

第一阶段发布流程保持：Django 只负责后台管理和文章导入/导出，Astro 继续静态构建前台。

## 1. 安装依赖

在 WSL 项目目录中运行：

```bash
cd /home/cheng/projects/personal-blog
python3 -m pip install --user -r backend/requirements.txt
npm install
```

## 2. 初始化 Django 数据库

```bash
python3 backend/manage.py migrate
python3 backend/manage.py createsuperuser
```

`backend/db.sqlite3` 是本地开发数据库，不要提交。

## 3. 导入现有文章

```bash
python3 backend/manage.py import_posts
```

导入后可以启动 Django Admin：

```bash
python3 backend/manage.py runserver
```

访问 `http://127.0.0.1:8000/admin/` 编辑文章、分类和标签。

## 4. 导出文章

编辑完成后，把数据库内容导出回 Astro 内容目录：

```bash
python3 backend/manage.py export_posts
```

默认只导出非 draft 文章。`private: true` 的文章即使存在于 Astro 内容目录，也不会进入静态前台页面、RSS 或 Pagefind 搜索索引。需要导出草稿时：

```bash
python3 backend/manage.py export_posts --include-drafts
```

导出会优先覆盖同 slug 的 `.mdx` 文件，其次覆盖 `.md` 文件；如果都不存在，则新建 `.md`。

## 5. 验证

```bash
python3 backend/manage.py test posts
python3 backend/manage.py makemigrations --check --dry-run
python3 backend/manage.py check
npm test
npm run build
```

## 6. 提交前检查

```bash
git diff
git status --short
```

提交前确认不要包含：

- `backend/db.sqlite3`
- `.idea/workspace.xml`
- `__pycache__/`
- `.astro/`
- `dist/`
- `node_modules/`

## 7. 上线前检查

- `astro.config.mjs` 里的 `site: "https://cheng-notes.local"` 仍是临时域名；未确定真实域名前不要替换。
- RSS 和 sitemap 会使用 `site` 生成绝对地址，上线前需要确认域名正确。
- GitHub 当前是占位链接，确认真实地址后再替换 `src/data/site.ts` 中的配置。
- `private: true` 文章不会静态发布，也不会进入 RSS 或 Pagefind 搜索索引。
- 确认 `public/files/` 中没有敏感文件；该目录内容会被静态发布。

## 当前边界

- Astro 页面不直接请求 Django API。
- `private: true` 文章在静态前台视为不公开发布，不做纯前端密码访问。
- `public/files/` 只支持公开静态文件下载，不提供私密文件权限控制。
- 不做评论、登录用户体系、复杂动态权限。
- 不引入 Docker、Redis、Celery、Django REST Framework。
