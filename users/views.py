from pyexpat.errors import messages
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, UserChangeForm, PasswordChangeForm
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse_lazy
from users.models import Profile
from . import forms
from .forms import EditUserForm, EditProfileForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, get_user_model
#from django.contrib.auth.models import User
from django.views import generic
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status
from .models import User
from .serializer import UserSerializer

@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Create your views here.
def register_view(request):
    if request.method == "POST": 
        form = UserCreationForm(request.POST) 
        if form.is_valid(): 
            login(request, form.save())
            return redirect("users:users_list")
    else:
        form = UserCreationForm()
    return render(request, "users/register.html", { "form": form })

def login_user(request): 
    if request.method == "POST": 
        username = request.POST['username']
        password = request.POST['password']
        print(f"Försöker logga in: {username}") # Felsökning 1
        user = authenticate(request, username=username, password=password)
        print(f"Resultat från authenticate: {user}") # Felsökning 2
        
        if user is not None:
            login(request, user)
            #messages.success(request, ("You have been logged in"))
            return redirect('users:profile', pk=user.pk)
        else:
            #messages.success(request, ("There was an error logging in. Please Try Again..."))
            return redirect('users:login')
    else:
	    return render(request, "users/login.html")

def logout_user(request):
    if request.method == "POST": 
        logout(request) 
        return redirect("posts:list")

def profile_list(request):
    if request.user.is_authenticated:
        profiles = Profile.objects.exclude(user=request.user)
        return render(request, 'users/profile_list.html', {'profiles': profiles})
    else:
        messages.success(request, ("You must be logged in to view profiles."))
        return redirect('users:login')
    
def profile(request, pk):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user_id=pk)

        #post form logic
        if request.method == "POST":
            current_user_profile = request.user.profile
            action = request.POST['follow']
            if action == "unfollow":
                current_user_profile.follows.remove(profile)
            elif action == "follow":
                current_user_profile.follows.add(profile)
            current_user_profile.save()
        return render(request, 'users/profile.html', {'profile': profile})
    else:
        messages.success(request, ("You must be logged in to view profiles."))
        return redirect('users:login')

def users_list(request):
    User = get_user_model()
    all_users = User.objects.all().order_by('-date_joined')
    return render(request, 'users/users_list.html', {'users': all_users})

def users_api(request):
    users = User.objects.all()
    data = {
        'users': list(users.values())
    }
    return JsonResponse(data)    
    
class PasswordChangeView(PasswordChangeView):
    form_class = PasswordChangeForm
    success_url = reverse_lazy('users:password_success')

def password_success(request):
    return render(request, 'users/password_success.html')

@login_required
def edit_profile(request, pk):
    if request.method == 'POST':
        # VIKTIGT: 'instance' kopplar formuläret till den inloggade användaren och profilen
        user_form = EditUserForm(request.POST, instance=request.user)
        profile_form = EditProfileForm(request.POST, request.FILES, instance=request.user.profile)

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            return redirect('users:profile', pk=pk)
    else:
        user_form = EditUserForm(instance=request.user)
        profile_form = EditProfileForm(instance=request.user.profile)

    context = {
        'user_form': user_form,
        'profile_form': profile_form,
        'pk' : pk
    }
    return render(request, 'users/edit_profile.html', context)

#class UpdateUserView(generic.UpdateView):
#    model = Profile
#    form_class = forms.EditProfileForm
#    template_name = 'users/edit_profile.html'
#    success_url = reverse_lazy('posts:my-posts')
#    
#    def get_object(self):
#        return self.request.user
    
    #def form_valid(self, form):
    #    return super().form_valid(form) 
    
    
       