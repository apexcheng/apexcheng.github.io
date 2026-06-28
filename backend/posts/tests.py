from pathlib import Path
from tempfile import TemporaryDirectory

from django.core.management import call_command
from django.test import TestCase

from .models import Category, Post, Tag


class ImportPostsCommandTests(TestCase):
    def test_imports_one_post(self):
        with TemporaryDirectory() as posts_dir:
            Path(posts_dir, "hello-world.md").write_text(
                """---
title: 第一篇文章
description: 文章摘要
date: 2026-06-28
category: Python
tags:
  - Django
minutes: 6
featured: true
draft: false
private: false
---

## 正文标题

这里是正文。
""",
                encoding="utf-8",
            )

            call_command("import_posts", posts_dir=posts_dir)

        post = Post.objects.get(slug="hello-world")
        self.assertEqual(post.title, "第一篇文章")
        self.assertEqual(post.description, "文章摘要")
        self.assertEqual(post.date.isoformat(), "2026-06-28")
        self.assertEqual(post.category.name, "Python")
        self.assertEqual([tag.name for tag in post.tags.all()], ["Django"])
        self.assertEqual(post.minutes, 6)
        self.assertTrue(post.featured)
        self.assertFalse(post.draft)
        self.assertFalse(post.private)
        self.assertEqual(post.source_format, "md")
        self.assertIn("## 正文标题", post.body)

    def test_updates_existing_post_by_slug(self):
        category = Category.objects.create(name="旧分类", slug="old-category")
        Post.objects.create(
            title="旧标题",
            slug="same-slug",
            description="旧摘要",
            date="2026-01-01",
            category=category,
            minutes=1,
            body="旧正文",
        )

        with TemporaryDirectory() as posts_dir:
            Path(posts_dir, "same-slug.md").write_text(
                """---
title: 新标题
description: 新摘要
date: 2026-06-28
category: 新分类
tags:
  - 新标签
minutes: 9
featured: false
draft: true
private: true
---

新正文
""",
                encoding="utf-8",
            )

            call_command("import_posts", posts_dir=posts_dir)

        self.assertEqual(Post.objects.count(), 1)
        post = Post.objects.get(slug="same-slug")
        self.assertEqual(post.title, "新标题")
        self.assertEqual(post.category.name, "新分类")
        self.assertEqual([tag.name for tag in post.tags.all()], ["新标签"])
        self.assertTrue(post.draft)
        self.assertTrue(post.private)
        self.assertEqual(post.body.strip(), "新正文")

    def test_creates_category_and_tags(self):
        with TemporaryDirectory() as posts_dir:
            Path(posts_dir, "auto-taxonomy.mdx").write_text(
                """---
title: 分类标签测试
description: 自动创建分类和标签
date: 2026-06-28
category: AI / 工作流
tags:
  - Agent
  - 自动化
minutes: 4
featured: false
---

正文
""",
                encoding="utf-8",
            )

            call_command("import_posts", posts_dir=posts_dir)

        self.assertTrue(Category.objects.filter(name="AI / 工作流").exists())
        self.assertTrue(Tag.objects.filter(name="Agent", slug="agent").exists())
        self.assertTrue(Tag.objects.filter(name="自动化", slug="自动化").exists())
        self.assertEqual(Post.objects.get(slug="auto-taxonomy").source_format, "mdx")

    def test_imports_quoted_tags_without_quotes(self):
        with TemporaryDirectory() as posts_dir:
            Path(posts_dir, "quoted-tags.md").write_text(
                """---
title: 引号标签
description: 标签导入时去掉引号
date: 2026-06-28
category: Python
tags:
  - "Django"
  - "MDX"
minutes: 4
featured: false
---

正文
""",
                encoding="utf-8",
            )

            call_command("import_posts", posts_dir=posts_dir)

        post = Post.objects.get(slug="quoted-tags")
        self.assertEqual([tag.name for tag in post.tags.all()], ["Django", "MDX"])

    def test_imports_empty_tags_list(self):
        with TemporaryDirectory() as posts_dir:
            Path(posts_dir, "no-tags.md").write_text(
                """---
title: 无标签文章
description: 无标签摘要
date: 2026-06-28
category: Python
tags: []
minutes: 4
featured: false
draft: false
private: false
---

正文
""",
                encoding="utf-8",
            )

            call_command("import_posts", posts_dir=posts_dir)

        post = Post.objects.get(slug="no-tags")
        self.assertEqual(list(post.tags.all()), [])

    def test_default_posts_dir_imports_existing_posts(self):
        call_command("import_posts")

        self.assertTrue(Post.objects.filter(slug="automation-agent-workflow").exists())


class ExportPostsCommandTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Python", slug="python")
        self.tag = Tag.objects.create(name="Django", slug="django")

    def test_exports_one_public_post(self):
        post = Post.objects.create(
            title="导出文章",
            slug="export-post",
            description="导出文章摘要",
            date="2026-06-28",
            category=self.category,
            minutes=6,
            featured=True,
            body="## 正文\n\n这里是正文。",
        )
        post.tags.add(self.tag)

        with TemporaryDirectory() as posts_dir:
            call_command("export_posts", posts_dir=posts_dir)
            text = Path(posts_dir, "export-post.md").read_text(encoding="utf-8")

        self.assertIn('title: "导出文章"', text)
        self.assertIn('description: "导出文章摘要"', text)
        self.assertIn("date: 2026-06-28", text)
        self.assertIn('category: "Python"', text)
        self.assertIn('tags:\n  - "Django"', text)
        self.assertIn("minutes: 6", text)
        self.assertIn("featured: true", text)
        self.assertIn("draft: false", text)
        self.assertIn("private: false", text)
        self.assertTrue(text.endswith("## 正文\n\n这里是正文。\n"))

    def test_exports_mdx_post_to_mdx_file(self):
        Post.objects.create(
            title="MDX 文章",
            slug="mdx-post",
            description="MDX 摘要",
            date="2026-06-28",
            category=self.category,
            minutes=5,
            source_format="mdx",
            body="import Callout from '../../components/Callout.astro';\n\n<Callout>正文</Callout>",
        )

        with TemporaryDirectory() as posts_dir:
            call_command("export_posts", posts_dir=posts_dir)
            text = Path(posts_dir, "mdx-post.mdx").read_text(encoding="utf-8")

            self.assertIn('title: "MDX 文章"', text)
            self.assertIn("<Callout>正文</Callout>", text)
            self.assertFalse(Path(posts_dir, "mdx-post.md").exists())

    def test_exports_empty_tags_as_empty_list(self):
        Post.objects.create(
            title="无标签文章",
            slug="no-tags",
            description="无标签摘要",
            date="2026-06-28",
            category=self.category,
            minutes=4,
            body="正文",
        )

        with TemporaryDirectory() as posts_dir:
            call_command("export_posts", posts_dir=posts_dir)
            text = Path(posts_dir, "no-tags.md").read_text(encoding="utf-8")

        self.assertIn("tags: []", text)
        self.assertNotIn("tags:\nminutes", text)

    def test_does_not_export_draft_by_default(self):
        Post.objects.create(
            title="草稿文章",
            slug="draft-post",
            description="草稿摘要",
            date="2026-06-28",
            category=self.category,
            minutes=3,
            draft=True,
            body="草稿正文",
        )

        with TemporaryDirectory() as posts_dir:
            call_command("export_posts", posts_dir=posts_dir)
            text = Path(posts_dir, "draft-post.md").read_text(encoding="utf-8")

        self.assertIn("draft: true", text)
        self.assertIn("草稿正文", text)

    def test_public_only_does_not_export_draft(self):
        Post.objects.create(
            title="草稿文章",
            slug="draft-post",
            description="草稿摘要",
            date="2026-06-28",
            category=self.category,
            minutes=3,
            draft=True,
            body="草稿正文",
        )

        with TemporaryDirectory() as posts_dir:
            call_command("export_posts", posts_dir=posts_dir, public_only=True)

            self.assertFalse(Path(posts_dir, "draft-post.md").exists())

    def test_exports_private_post_as_non_public_content(self):
        Post.objects.create(
            title="私密文章",
            slug="private-post",
            description="私密摘要",
            date="2026-06-28",
            category=self.category,
            minutes=8,
            private=True,
            body="私密正文",
        )

        with TemporaryDirectory() as posts_dir:
            call_command("export_posts", posts_dir=posts_dir)
            text = Path(posts_dir, "private-post.md").read_text(encoding="utf-8")

        self.assertIn("private: true", text)
        self.assertIn("私密正文", text)

    def test_exports_frontmatter_with_quoted_strings(self):
        post = Post.objects.create(
            title="标题: 含冒号",
            slug="quoted-post",
            description='摘要 "含引号"',
            date="2026-06-28",
            category=self.category,
            minutes=5,
            body="正文",
        )
        post.tags.add(self.tag)

        with TemporaryDirectory() as posts_dir:
            call_command("export_posts", posts_dir=posts_dir)
            text = Path(posts_dir, "quoted-post.md").read_text(encoding="utf-8")

        self.assertIn('title: "标题: 含冒号"', text)
        self.assertIn('description: "摘要 \\"含引号\\""', text)
        self.assertIn('category: "Python"', text)
        self.assertIn('  - "Django"', text)
