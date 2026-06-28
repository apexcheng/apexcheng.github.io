from pathlib import Path
import json

from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify

from posts.models import Category, Post, Tag


class Command(BaseCommand):
    help = "Import Markdown / MDX posts from src/content/posts into Django."

    def add_arguments(self, parser):
        parser.add_argument(
            "--posts-dir",
            default=None,
            help="Markdown / MDX posts directory. Defaults to src/content/posts.",
        )

    def handle(self, *args, **options):
        base_dir = Path(__file__).resolve().parents[4]
        posts_dir = Path(options["posts_dir"]) if options["posts_dir"] else base_dir / "src" / "content" / "posts"
        if not posts_dir.exists():
            raise CommandError(f"Posts directory does not exist: {posts_dir}")

        imported_count = 0
        for file_path in sorted(posts_dir.iterdir()):
            if file_path.suffix not in [".md", ".mdx"]:
                continue

            text = file_path.read_text(encoding="utf-8")
            frontmatter, body = parse_post_file(text, file_path)
            category = get_or_create_category(frontmatter["category"])
            tags = [get_or_create_tag(name) for name in frontmatter.get("tags", [])]
            defaults = {
                "title": frontmatter["title"],
                "description": frontmatter["description"],
                "date": frontmatter["date"],
                "category": category,
                "minutes": frontmatter["minutes"],
                "featured": frontmatter.get("featured", False),
                "draft": frontmatter.get("draft", False),
                "private": frontmatter.get("private", False),
                "source_format": file_path.suffix.lstrip("."),
                "body": body,
            }

            post, _created = Post.objects.update_or_create(
                slug=file_path.stem,
                defaults=defaults,
            )
            post.tags.set(tags)
            imported_count += 1

        self.stdout.write(self.style.SUCCESS(f"Imported {imported_count} posts."))


def parse_post_file(text, file_path):
    if not text.startswith("---\n"):
        raise CommandError(f"Missing frontmatter: {file_path}")

    parts = text.split("---\n", 2)
    if len(parts) != 3:
        raise CommandError(f"Invalid frontmatter: {file_path}")

    data = {}
    current_key = None
    for line in parts[1].splitlines():
        if line.startswith("  - ") and current_key:
            data.setdefault(current_key, []).append(parse_value(line[4:].strip()))
            continue

        if ":" not in line:
            continue

        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value:
            data[key] = parse_value(value)
            current_key = None
        else:
            data[key] = []
            current_key = key

    for key in ["title", "description", "date", "category", "minutes"]:
        if key not in data:
            raise CommandError(f"Missing required frontmatter field '{key}': {file_path}")

    data["minutes"] = int(data["minutes"])
    return data, parts[2].lstrip("\n")


def parse_value(value):
    if value == "[]":
        return []
    if value == "true":
        return True
    if value == "false":
        return False
    if value.isdigit():
        return int(value)
    if value.startswith('"') and value.endswith('"'):
        return json.loads(value)
    return value


def get_or_create_category(name):
    slug = slugify(name, allow_unicode=True).replace("/", "-")
    category, _created = Category.objects.get_or_create(name=name, defaults={"slug": slug})
    return category


def get_or_create_tag(name):
    tag, _created = Tag.objects.get_or_create(name=name, defaults={"slug": slugify(name, allow_unicode=True)})
    return tag
