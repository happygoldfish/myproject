from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
     username = models.CharField(max_length=75, unique=True)
     first_name = models.CharField(max_length=75)
     last_name = models.CharField(max_length=75)
     email = models.EmailField()
     date_created = models.DateTimeField(auto_now_add=True)
     class Meta:
          db_table = 'auth_user'
     def __str__(self):
          return self.username

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    follows = models.ManyToManyField("self",
        related_name="followed_by",
        symmetrical=False,
        blank=True)
    profile_image = models.ImageField(blank=True, null=True, upload_to='profile/', default="default_img.jpg")
    bio = models.TextField(max_length=200)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username
    
#create a profile for each new user

def createProfile(sender, instance, created, **kwargs):
    if created:
        user_profile = Profile(user=instance)
        user_profile.save()
        #have user follow themselves
        user_profile.follows.set([instance.profile.id])

post_save.connect(createProfile, sender=User)
