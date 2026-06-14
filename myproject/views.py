#from django.http import HttpResponse
from django.shortcuts import render

def homepage(request):
    #return HttpResponse("Hello World!")
    return render(request, 'home.html')

def about(request):
    #return HttpResponse("This is the about page.")
    return render(request, 'about.html')
