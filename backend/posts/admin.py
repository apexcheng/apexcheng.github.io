from django.contrib import admin

from .models import Category, Post, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "slug")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "slug")


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "category", "date", "draft", "private", "featured")
    list_filter = ("draft", "private", "featured", "category", "tags")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "slug", "description", "body")
    filter_horizontal = ("tags",)
