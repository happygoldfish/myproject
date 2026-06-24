from django.urls import path

from django.conf.urls.static import static
from django.conf import settings
from . import views
from django.contrib.auth.decorators import login_required


app_name = 'posts'

urlpatterns = [
    path('', views.posts_list, name='list'),
    path('new-post/', views.post_new, name='new-post'),
    path('my-posts/', views.my_posts_list, name='my-posts'),
    #path('api/', views.posts_api, name='api'),
    path('<slug:slug>/', views.post_page, name='page'),
    path('<slug:slug>/edit/', login_required(views.UpdatePostView.as_view()), name='post-edit'),
    path('<slug:slug>/delete/', login_required(views.DeletePostView.as_view()), name='post-delete'),
    path('api/<int:pk>', views.post_detail, name='post_detail'),
    path('api/create', views.create_post, name='create_post'),
    path('api/list/<pk>', views.api_list, name='posts_list'),
    path('api/list/', views.PostListAPIView.as_view(), name='post-list'),
    path('comment/delete/<pk>', views.commentDeleteView, name='commentDelete'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)   