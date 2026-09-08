from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import update_session_auth_hash
from .models import User, Profile
from rest_framework.response import Response
import os

class UserSerializer(serializers.ModelSerializer):
    bio = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'is_staff', 'bio', 'profile_image']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'is_staff': {'read_only': True},
        }

    def get_bio(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.bio if profile else ''

    def get_profile_image(self, obj):
        profile = getattr(obj, 'profile', None)
        if not profile or not profile.profile_image:
            return None
        request = self.context.get('request')
        url = profile.profile_image.url
        return request.build_absolute_uri(url) if request else url

    def _apply_profile(self, instance):
        # bio/profile_image live on the related Profile model and are read-only
        # SerializerMethodFields above, so writes are applied manually here.
        profile, _ = Profile.objects.get_or_create(user=instance)
        changed = False
        bio_value = self.initial_data.get('bio')
        if bio_value is not None:
            profile.bio = bio_value
            changed = True
        image_value = self.initial_data.get('profile_image')
        if image_value:
            if isinstance(image_value, str):
                # Plain text path/URL is normalized back to a storage-relative path.
                if settings.MEDIA_URL in image_value:
                    image_value = image_value.split(settings.MEDIA_URL, 1)[-1]
            else:
                # Real uploaded file: name it after the username, deleting any
                # previous per-user file first (never the shared default image).
                ext = os.path.splitext(image_value.name)[1]
                target_name = f"{instance.username}{ext}"
                if profile.profile_image and profile.profile_image.name != 'default_img.jpg':
                    profile.profile_image.delete(save=False)
                image_value.name = target_name
            profile.profile_image = image_value
            changed = True
        if changed:
            profile.save()

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        self._apply_profile(user)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
            # Changing the password invalidates Django's session auth hash;
            # without this the caller would be silently logged out.
            request = self.context.get('request')
            if request:
                update_session_auth_hash(request, user)
        self._apply_profile(user)
        return user

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)