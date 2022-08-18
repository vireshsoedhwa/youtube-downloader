from django.urls import path
from . import views


urlpatterns = [
    path('', views.index ),
    path('<youtube_id>/', views.SubmitUrl.as_view() ),
    path('<youtube_id>/download', views.Download.as_view() ),
    # path('recent', views.GetRecent.as_view() ),
    # path('media/<int:id>/', views.GetDetail.as_view() ),
    # path('submit', views.SubmitUrl.as_view() ),
    # path('submit/<id>', views.SubmitUrl.as_view() )
]