import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from .models import Category, Post, Tag


def post_data(post, include_body=False):
    data = {
        "title": post.title,
        "slug": post.slug,
        "description": post.description,
        "date": post.date.isoformat(),
        "category": post.category.name,
        "tags": [tag.name for tag in post.tags.all()],
        "minutes": post.minutes,
        "featured": post.featured,
        "draft": post.draft,
        "private": post.private,
    }
    if include_body:
        data["body"] = post.body
    return data


def post_list(request):
    if request.method != "GET":
        return JsonResponse({"error": "method_not_allowed"}, status=405)

    posts = Post.objects.filter(draft=False).select_related("category").prefetch_related("tags")
    return JsonResponse({"posts": [post_data(post) for post in posts]})


def post_detail(request, slug):
    if request.method != "GET":
        return JsonResponse({"error": "method_not_allowed"}, status=405)

    post = get_object_or_404(
        Post.objects.select_related("category").prefetch_related("tags"),
        slug=slug,
        draft=False,
    )
    if post.private:
        return JsonResponse({"error": "password_required", "post": post_data(post)}, status=403)
    return JsonResponse({"post": post_data(post, include_body=True)})


@csrf_exempt
def verify_post_password(request, slug):
    if request.method != "POST":
        return JsonResponse({"error": "method_not_allowed"}, status=405)

    post = get_object_or_404(
        Post.objects.select_related("category").prefetch_related("tags"),
        slug=slug,
        draft=False,
    )
    data = json.loads(request.body.decode("utf-8") or "{}")
    if not post.private or post.password_matches(data.get("password", "")):
        return JsonResponse({"ok": True, "post": post_data(post, include_body=True)})
    return JsonResponse({"ok": False, "error": "password_invalid"}, status=403)


def category_list(request):
    if request.method != "GET":
        return JsonResponse({"error": "method_not_allowed"}, status=405)

    categories = Category.objects.all()
    return JsonResponse({"categories": [{"name": item.name, "slug": item.slug} for item in categories]})


def tag_list(request):
    if request.method != "GET":
        return JsonResponse({"error": "method_not_allowed"}, status=405)

    tags = Tag.objects.all()
    return JsonResponse({"tags": [{"name": item.name, "slug": item.slug} for item in tags]})
