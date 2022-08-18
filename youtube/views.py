from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import YoutubeResourceSerializer
import json
import requests
from .models import YoutubeResource

from django.conf import settings


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
    def get(self, request, id):
        print(id)
        return Response("download")


class GetRecent(APIView):
    def get(self, format=None):
        return Response("getrecent")

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
