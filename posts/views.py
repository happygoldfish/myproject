from urllib import request

from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import redirect, render, get_object_or_404
from django.urls import reverse_lazy, reverse

from users import serializer
from .models import Post
from django.contrib.auth.decorators import login_required
from . import forms
from django.views import generic
from django.views.generic import UpdateView, DeleteView
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Post
from comment.models import Comment
from comment.forms import CommentForm
from .serializer import PostSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class PostView(APIView):
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  

class PostDetailView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Post, pk=pk)

    def put(self, request, pk):
        objekt = self.get_object(pk)
        serializer = PostSerializer(objekt, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        objekt = self.get_object(pk)
        objekt.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

def posts_list(request):
    posts = Post.objects.all().order_by('-date_created')
    author_username = request.GET.get('author')

    context = {
        'author_variable': author_username,
        'posts' : posts
    }
    
    return render(request, 'posts/posts_list.html', context)

def my_posts_list(request):
    posts = Post.objects.all().order_by('-date_created')
    author_username = request.GET.get('author')

    context = {
        'author_variable': author_username,
        'posts' : posts
    }
    
    return render(request, 'posts/my_posts.html', context)

def post_page(request, slug):
    post = Post.objects.get(slug=slug)

    #comments
    comments = Comment.objects.filter(post=post).order_by("-date")
    #commentForm
    if request.method == "POST":
        form = CommentForm(request.POST, request.FILES)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.user = request.user
            comment.save()
            #return HttpResponseRedirect(reverse("posts:page"), args=[post.slug])
            return HttpResponseRedirect(reverse("posts:page", args=[post.slug]))
    else:
        form = CommentForm()
    context = {
        'form': form,
        'comments': comments,
        'post': post,
    }
    return render(request, 'posts/post_page.html', context)

def commentDeleteView(request, pk):
    comment = get_object_or_404(Comment, id=pk, user=request.user)
    postSlug = comment.post.slug
    if request.method == "POST":
        comment.delete()
        return redirect('posts:page', slug=postSlug)
    return render(request, 'posts/comment_delete.html', {'comment': comment})

def posts_api(request):
    posts = Post.objects.all().order_by('-date_created')
    data = {
        'posts': list(posts.values())
    }
    return JsonResponse(data)

@login_required(login_url='/users/login/')
def post_new(request):
    if request.method == 'POST':
        form = forms.CreatePost(request.POST, request.FILES)
        if form.is_valid():
            newpost = form.save(commit=False)
            newpost.author = request.user
            newpost.save()
            return redirect('posts:list')
    else:
        form = forms.CreatePost()
    return render(request, 'posts/post_new.html', {'form': form})

@api_view(['GET', 'PUT', 'DELETE'])
def api_list(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PostSerializer(post)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PostListAPIView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

@api_view(['GET'])
def get_posts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def post_detail(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PostSerializer(post)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UpdatePostView(UpdateView):
    model = Post
    template_name = 'posts/post_edit.html'
    fields = ['title', 'body', 'slug', 'banner']
    success_url = reverse_lazy('posts:my-posts')
    
    def form_valid(self, form):
        return super().form_valid(form)


class DeletePostView(DeleteView):
    model = Post
    template_name = 'posts/post_delete.html'
    success_url = reverse_lazy('posts:my-posts')