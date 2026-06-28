from django.urls import path

from . import views

urlpatterns = [
    path("posts/", views.post_list, name="post-list"),
    path("posts/<slug:slug>/", views.post_detail, name="post-detail"),
    path("posts/<slug:slug>/verify-password/", views.verify_post_password, name="post-password"),
    path("categories/", views.category_list, name="category-list"),
    path("tags/", views.tag_list, name="tag-list"),
]
