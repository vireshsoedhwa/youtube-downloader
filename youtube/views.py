from urllib import response
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import YoutubeResourceSerializer
from django.http import HttpResponse, JsonResponse, FileResponse
from django.core.files import File
import json
import requests
from .models import YoutubeResource

from django.conf import settings
from pathlib import Path
import os


@ensure_csrf_cookie
def index(request):

    if request.session.test_cookie_worked():
        print(str(request.headers['Cookie']))

    request.session.set_test_cookie()

    context = {
        'version':  settings.GO_PIPELINE_LABEL,
    }

    return render(request, 'youtube/index.html', context)


class SubmitUrl(APIView):
    def get(self, request, youtube_id):
        serializer = YoutubeResourceSerializer(data={'youtube_id': youtube_id})
        if serializer.is_valid():
            instance = serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)


class Download(APIView):
    def get(self, request, youtube_id):
        youtube = None
        try:
            youtube = YoutubeResource.objects.get(youtube_id=youtube_id)
        except:
            return Response(status=404)
        file_path = settings.MEDIA_ROOT + \
            str(youtube.youtube_id) + '/' + youtube.filename
        if os.path.isfile(file_path):
            file_response = FileResponse(
                open(file_path, 'rb'), as_attachment=True, filename=youtube.filename)
            return file_response
        else:
            return Response(status=404)


class GetRecent(APIView):
    def get(self, format=None):
        recent = YoutubeResource.objects.all().order_by('-created_at')[:100]
        serializer = YoutubeResourceSerializer(recent, many=True)
        return Response(serializer.data, status=200)


# class GetRecent(APIView):
#     def get(self, format=None):
#         url = 'http://playlistenerapi:8000/mediaresources?show=10'
#         # headers = {'Authorization': 'Bearer ' + settings.API_KEY}
#         r = None
#         try:
#             r = requests.get(url, timeout=3.05)
#         except:
#             return Response("request failed", status=503)

#         if str(r.status_code) == '200':
#             print(Response(r.json()))
#             return Response(r.json(), status=200)
#         else:
#             return Response(r.json(), status=r.status_code)
