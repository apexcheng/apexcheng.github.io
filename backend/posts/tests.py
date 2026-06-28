from pathlib import Path
from tempfile import TemporaryDirectory

from django.core.management import call_command
from django.test import Client, TestCase

from .models import Category, Post, Tag


class PostApiTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.category = Category.objects.create(name="技术", slug="tech")
        self.tag = Tag.objects.create(name="Astro", slug="astro")

    def test_draft_post_is_not_in_public_list(self):
        public_post = Post.objects.create(
            title="公开文章",
            slug="public-post",
            description="公开文章摘要",
            date="2026-06-28",
            category=self.category,
            minutes=5,
            body="公开正文",
        )
        public_post.tags.add(self.tag)

        Post.objects.create(
            title="草稿文章",
            slug="draft-post",
            description="草稿文章摘要",
            date="2026-06-28",
            category=self.category,
            minutes=3,
            draft=True,
            body="草稿正文",
        )

        response = self.client.get("/api/posts/")

        self.assertEqual(response.status_code, 200)
        slugs = [item["slug"] for item in response.json()["posts"]]
        self.assertEqual(slugs, ["public-post"])

    def test_private_post_detail_does_not_return_body_without_password(self):
        Post.objects.create(
            title="私密文章",
            slug="private-post",
            description="私密文章摘要",
            date="2026-06-28",
            category=self.category,
            minutes=8,
            private=True,
            password="secret",
            body="私密正文",
        )

        response = self.client.get("/api/posts/private-post/")

        self.assertEqual(response.status_code, 403)
        self.assertNotIn("body", response.json()["post"])

    def test_correct_password_returns_private_post_body(self):
        Post.objects.create(
            title="私密文章",
            slug="private-post",
            description="私密文章摘要",
            date="2026-06-28",
            category=self.category,
            minutes=8,
            private=True,
            password="secret",
            body="私密正文",
        )

        response = self.client.post(
            "/api/posts/private-post/verify-password/",
            {"password": "secret"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["ok"])
        self.assertEqual(response.json()["post"]["body"], "私密正文")


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

    def test_default_posts_dir_imports_existing_posts(self):
        call_command("import_posts")

        self.assertTrue(Post.objects.filter(slug="automation-agent-workflow").exists())
