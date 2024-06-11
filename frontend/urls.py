from django.urls import path, include
from .views import BaseView


urlpatterns = [
    path('', BaseView.as_view(template_name='index.html'), name='index'),
]
