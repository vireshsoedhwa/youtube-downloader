from django.urls import path, include
from . import views
from .views import YoutubeResourceViewset, CustomAuthToken
from rest_framework.routers import SimpleRouter
# from rest_framework.authtoken.views import obtain_auth_token

router = SimpleRouter()

router.register(r'resource', YoutubeResourceViewset,
                basename="resource")

urlpatterns = [
    path('', views.index),
    path('', include(router.urls)),
    # path('api-token-auth/', obtain_auth_token, name='api_token_auth')
    path('api-token-auth/', CustomAuthToken.as_view())
]
