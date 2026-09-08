from rest_framework import serializers
from django.conf import settings
from .models import Post
from users.models import User
from django.utils.text import slugify
import os

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

    def _apply_banner(self, instance):
        # banner is a SerializerMethodField (read-only for build_absolute_uri output),
        # so writes are applied manually from the raw path/URL/file sent by the client.
        banner_value = self.initial_data.get('banner')
        if banner_value:
            if isinstance(banner_value, str):
                # Strip scheme/host + MEDIA_URL prefix back to a storage-relative path
                if settings.MEDIA_URL in banner_value:
                    banner_value = banner_value.split(settings.MEDIA_URL, 1)[-1]
            else:
                # Real uploaded file: name it after the post's slug. Existing files
                # with the same name are left alone; storage will de-duplicate.
                ext = os.path.splitext(banner_value.name)[1]
                banner_value.name = f"{instance.slug}{ext}"
            instance.banner = banner_value
            instance.save(update_fields=['banner'])

    def create(self, validated_data):
        instance = super().create(validated_data)
        self._apply_banner(instance)
        return instance

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        self._apply_banner(instance)
        return instance

    def validate(self, data):
        if not data.get('slug'):
            generated = slugify(data.get('title', ''))
            if not generated:
                raise serializers.ValidationError({'slug': 'Could not generate a slug from the title. Please provide a slug.'})
            data['slug'] = generated
        return data