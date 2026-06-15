from django.contrib import admin
from .models import Profile, User
from django.contrib.auth.models import Group




# Unregister the Group model from the admin site
admin.site.unregister(Group)

class ProfileInline(admin.StackedInline):
    model = Profile
    verbose_name_plural = 'Profiles'

#Extend the User Model
class UserAdmin(admin.ModelAdmin):
    model = User
    fields = ['username']
    inlines = [ProfileInline]


#Register the custom User admin
admin.site.register(User, UserAdmin)
