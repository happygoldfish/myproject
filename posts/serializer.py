from rest_framework import serializers
from .models import Post
from users.models import User
from django.utils.text import slugify

class PostSerializer(serializers.ModelSerializer):
    banner = serializers.SerializerMethodField()
    author = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all())
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Post
        fields = "__all__"

    def get_banner(self, obj):
        if not obj.banner:
            return None
        request = self.context.get("request")
        url = obj.banner.url
        return request.build_absolute_uri(url) if request else url
    
    def validate(self, data):
        if not data.get('slug'):
            generated = slugify(data.get('title', ''))
            if not generated:
                raise serializers.ValidationError({'slug': 'Could not generate a slug from the title. Please provide a slug.'})
            data['slug'] = generated
        return data