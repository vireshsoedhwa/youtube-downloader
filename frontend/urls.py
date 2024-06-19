from django.urls import path, include
from .views import BaseView


urlpatterns = [
    path('', BaseView.as_view(template_name='index.html'), name='index'),
    path('create', BaseView.as_view(template_name='index.html'), name='index'),
    path('home', BaseView.as_view(template_name='index.html'), name='index'),
]
