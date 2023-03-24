from django.urls import path, include
from . import views
from .views import YoutubeResourceViewset
from rest_framework.routers import SimpleRouter

from django.views.generic import TemplateView
from .views import BaseView

router = SimpleRouter()
router.register(r'resource', YoutubeResourceViewset,
                basename="resource")

urlpatterns = [
    # path('', views.index),
    # path('', BaseView.as_view(template_name='home.html'), name='home'),
    path('', include(router.urls)),
    path("accounts/", include("django.contrib.auth.urls")),
]
