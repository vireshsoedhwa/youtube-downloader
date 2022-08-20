from django.urls import path
from . import views


urlpatterns = [
    path('', views.index ),
    path('submit/<youtube_id>', views.SubmitUrl.as_view() ),
    path('retry/<youtube_id>', views.SubmitUrl.as_view() ),
    path('download/<youtube_id>', views.Download.as_view() ),
    path('archive/<youtube_id>', views.archive_add ),
    path('unarchive/<youtube_id>', views.archive_remove ),
    path('recent', views.GetRecent.as_view() ),
]