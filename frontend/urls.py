from django.urls import path, re_path, include
from .views import BaseView


urlpatterns = [
    re_path(r'^$', BaseView.as_view(template_name='index.html'), name='index'),
    re_path(r'^(?P<path>.*)/$', BaseView.as_view(template_name='index.html'), name='index'),
]
