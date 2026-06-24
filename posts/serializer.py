from rest_framework import serializers
from .models import Post
from users.models import User

class PostSerializer(serializers.ModelSerializer):
    banner = serializers.SerializerMethodField()
    author = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all())

    class Meta:
        model = Post
        fields = "__all__"

    def get_banner(self, obj):
        if not obj.banner:
            return None
        request = self.context.get("request")
        url = obj.banner.url
        return request.build_absolute_uri(url) if request else url