from django.contrib import admin
from .models import Profile, User
from django.contrib.auth.models import Group
#from .models import User as StandardUser




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


#unregister the default User admin and register the new UserAdmin
#admin.site.unregister(StandardUser)
admin.site.register(User, UserAdmin)