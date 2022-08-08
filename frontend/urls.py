from django.urls import path
from . import views


urlpatterns = [
    path('', views.index ),
    path('recent', views.ListMedia.as_view() ),
    path('submit', views.SubmitUrl.as_view() ),
]