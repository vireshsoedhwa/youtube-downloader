from django.urls import path, include
from . import views
from .views import YoutubeResourceViewset
from rest_framework.routers import SimpleRouter

from django.views.generic.base import TemplateView


router = SimpleRouter()
router.register(r'resource', YoutubeResourceViewset,
                basename="resource")

urlpatterns = [
    # path('', views.index),
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('', include(router.urls)),
    path("accounts/", include("django.contrib.auth.urls")),
]
