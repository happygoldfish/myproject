from pyexpat.errors import messages
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse_lazy
from users.models import Profile
from . import forms
from .forms import EditUserForm, EditProfileForm, UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, get_user_model
#from django.contrib.auth.models import User
from django.views import generic
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import transaction
from django.db import IntegrityError
from django.db.models.deletion import ProtectedError
from .models import User
from .serializer import UserSerializer
from rest_framework.views import APIView

class UserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.select_related('profile').all()
        serializer = UserSerializer(users, many=True, context={"request": request})
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UserSerializer(data=request.data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

class UserDetailView(APIView):
    def get_permissions(self):
        if self.request.method in ('PUT', 'DELETE'):
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_object(self, pk):
        return get_object_or_404(User, pk=pk)

    def get(self, request, pk):
        objekt = self.get_object(pk)
        serializer = UserSerializer(objekt, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        objekt = self.get_object(pk)
        if objekt != request.user:
            return Response({"detail": "Du kan bara redigera ditt eget konto."}, status=status.HTTP_403_FORBIDDEN)
        serializer = UserSerializer(objekt, data=request.data, context={"request": request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        objekt = self.get_object(pk)
        if objekt != request.user and not request.user.is_staff:
            return Response({"detail": "Du kan bara ta bort ditt eget konto."}, status=status.HTTP_403_FORBIDDEN)
        try:
            with transaction.atomic():
                # Explicitly remove profile first to avoid relation edge-cases.
                Profile.objects.filter(user=objekt).delete()
                objekt.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_409_CONFLICT)
        except IntegrityError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_409_CONFLICT)
        except Exception as exc:
            # Prevent a generic 500 and surface the real backend reason to the client.
            return Response({"detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# -------------------
# React session-auth API (login/logout/whoami)
# -------------------
class ReactCSRFView(APIView):
    """GET this once on app load to make Django set the csrftoken cookie."""
    permission_classes = [AllowAny]

    def get(self, request):
        from django.middleware.csrf import get_token
        get_token(request)
        return Response({"detail": "CSRF cookie set"})

class ReactSessionView(APIView):
    """Returns the currently logged-in user, or null if not authenticated."""
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user, context={"request": request}).data)
        return Response({"detail": "Not authenticated"}, status=status.HTTP_200_OK)

class ReactLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        login(request, user)
        return Response(UserSerializer(user, context={"request": request}).data)

class ReactLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


#Views for django UI
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

     
     
        