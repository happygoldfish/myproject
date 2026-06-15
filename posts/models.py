from django.db import models
from django.conf import settings  

# Create your models here.


class Post(models.Model):
    title = models.CharField(max_length=75)
    #artist = models.CharField(max_length=75, blank=True, null=True)
    body = models.TextField(blank=True, null=True)
    #mediaType = models.CharField(max_length=2, choices=mediaType_Choices, default="NA")
    slug = models.SlugField()
    date_released = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    banner = models.ImageField(default='default_img.jpg', blank=True, null=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=None)

    def __str__(self):
        return self.title