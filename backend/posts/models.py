from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "分类"
        verbose_name_plural = "分类"

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "标签"
        verbose_name_plural = "标签"

    def __str__(self):
        return self.name


class Post(models.Model):
    SOURCE_FORMAT_CHOICES = [
        ("md", "Markdown"),
        ("mdx", "MDX"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    date = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="posts")
    tags = models.ManyToManyField(Tag, blank=True, related_name="posts")
    minutes = models.PositiveIntegerField(default=1)
    featured = models.BooleanField(default=False)
    draft = models.BooleanField(default=False)
    private = models.BooleanField(default=False)
    source_format = models.CharField(max_length=3, choices=SOURCE_FORMAT_CHOICES, default="md")
    body = models.TextField()

    class Meta:
        ordering = ["-date", "-id"]
        verbose_name = "文章"
        verbose_name_plural = "文章"

    def __str__(self):
        return self.title
