from django.urls import path, include
from . import views
from .views import YoutubeResourceViewset
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register(r'resource', YoutubeResourceViewset,
                basename="resource")

urlpatterns = [
    path('', include(router.urls)),
]