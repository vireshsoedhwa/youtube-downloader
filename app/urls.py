from django.urls import path, include
from . import views
from .views import YoutubeResourceViewset
from rest_framework.routers import SimpleRouter

from .views import BaseView

router = SimpleRouter()
router.register(r'resource', YoutubeResourceViewset,
                basename="resource")

urlpatterns = [
    path('', BaseView.as_view(template_name='index.html'), name='index'),
    path('create', BaseView.as_view(template_name='index.html'), name='index'),
    path('home', BaseView.as_view(template_name='index.html'), name='index'),
    path('detail/<int:id>/', BaseView.as_view(template_name='index.html'), name='index'),
    path('api/', include(router.urls)),
]
