from .logging.YoutubeIdFilter import YoutubeIdFilter
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from .serializers import YoutubeResourceSerializer
from django.http import HttpResponse, JsonResponse, FileResponse
from .models import YoutubeResource
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.decorators import action

from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
import logging
from pathlib import Path

logger = logging.getLogger(__name__)
logger.addFilter(YoutubeIdFilter())

# decorators = [never_cache]
# @method_decorator(decorators, name='dispatch')

class YoutubeResourceViewset(viewsets.ModelViewSet):
    queryset = YoutubeResource.objects.all()
    serializer_class = YoutubeResourceSerializer
    parser_classes = [JSONParser]
    # authentication_classes = [SessionAuthentication]
    # permission_classes = [IsAuthenticated]

    def list(self, request):
        recent = self.queryset.order_by("-created_at")[:100]
        serializer = self.get_serializer(recent, many=True)
        return Response(serializer.data)

    def create(self, request):

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            # instance.session = request.session["_csrftoken"]
            instance.save()
            # # delete anything older than the last 20 items
            # selection = self.queryset.order_by("-created_at")[20:]
            # for item in selection:
            #     item.delete()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    @action(detail=True)
    def getvideo(self, request, pk=None):
        resource = self.get_object()
        if resource.audiofile:
            file_response = FileResponse(
                resource.videofile, as_attachment=True
            )
            return file_response
        return HttpResponse("File not ready yet", status=400)

    @action(detail=True)
    def getaudio(self, request, pk=None):
        resource = self.get_object()
        if resource.audiofile:
            file_response = FileResponse(
                resource.audiofile, as_attachment=True
            )
            return file_response
        return HttpResponse("File not ready yet", status=400)

    @action(detail=True)
    def getresult(self, request, pk=None):
        resource = self.get_object()
        serializer = self.get_serializer(resource)
        return Response(serializer.data)

    @action(detail=False)
    def get_list_by_session(self, request):
        if '_csrftoken' in request.session:
            recent = self.queryset.filter(session=request.session["_csrftoken"]).order_by("-created_at")
            serializer = self.get_serializer(recent, many=True)
            return Response(serializer.data)
        return Response("no session set")