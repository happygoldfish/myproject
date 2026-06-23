from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

app_name = 'users'

urlpatterns = [
    path('', views.users_list, name='users_list'),
    #path('api', views.users_api, name='api'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('profile_list/', views.profile_list, name='profile_list'),
    path('profile/<int:pk>', views.profile, name='profile'),
    path('change-password/', views.PasswordChangeView.as_view(template_name='users/password_change.html'), name='change_password'),
    path('password_success/', views.password_success, name='password_success'),
    path('edit/<int:pk>', views.edit_profile, name='edit_profile'),
    path('api/get', views.get_users, name='get_user'),
    path('api/create', views.create_user, name='create_user'),
    path('api/user_list/', views.UserListAPIView.as_view(), name='user-list'),
    path('api/<int:pk>', views.user_detail, name='user-detail'),
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)