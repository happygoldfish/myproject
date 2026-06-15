from django import forms
from .models import User, Profile
from django.contrib.auth.forms import PasswordChangeForm, UserChangeForm

class profileForm(forms.ModelForm):
    username = forms.CharField(max_length=150, widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}))
    first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'First Name'}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Last Name'}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}))
    profile_image = forms.ImageField(widget=forms.FileInput(attrs={'class': 'form-control'}))
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username', 'profile_image']

class PasswordChangingForm(PasswordChangeForm):
    old_password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'type': 'password', 'placeholder': 'Old Password'}))
    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'type': 'password', 'placeholder': 'New Password'}))
    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'type': 'password', 'placeholder': 'Confirm New Password'})) 
    class Meta:
        model = User
        fields = ['old_password', 'new_password1', 'new_password2']

class EditUserForm(UserChangeForm):
    username = forms.CharField(max_length=150, widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}))
    first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'First Name'}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Last Name'}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}))

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']

class EditProfileForm(forms.ModelForm):
    bio = forms.CharField(max_length=200, widget=forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'My Bio'}))
    profile_image = forms.ImageField(widget=forms.FileInput(attrs={'class': 'form-control'}))

    class Meta:
        model = Profile
        fields = ['bio', 'profile_image']
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Gå via .user-relationen på profilinstansen
        if self.instance and self.instance.user:
            if not self.instance.user.has_usable_password():
                # Gör något om användaren saknar lösenord (t.ex. dölj ett fält)
                pass
