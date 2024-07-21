from .logging.YoutubeIdFilter import YoutubeIdFilter
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from .serializers import YoutubeResourceSerializer
from django.http import HttpResponse, JsonResponse, FileResponse
from .models import YoutubeResource, Session
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.decorators import action

from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_protect
from rest_framework import permissions
from django.shortcuts import redirect

from django.conf import settings
import logging
from pathlib import Path

logger = logging.getLogger(__name__)
logger.addFilter(YoutubeIdFilter())

# decorators = [never_cache]
# @method_decorator(decorators, name='dispatch')

class IsCSRFTokenSet(permissions.BasePermission):
    """
    Global permission
    """
    def has_permission(self, request, view):
        if '_csrftoken' in request.session:
            return True
        else:
            return False
    
class IsCSRFTokenAndRecordMatching(permissions.BasePermission):
    """
    Object-level permission
    """
    def has_object_permission(self, request, view, obj):
        sessions_by_resource = Session.objects.filter(resources = obj)
        session_by_token_exists = sessions_by_resource.filter(token=request.session["_csrftoken"]).exists()
        if(session_by_token_exists):
            return True
        else:
            return False
        
class YoutubeResourceViewset(viewsets.ModelViewSet):
    queryset = YoutubeResource.objects.all()
    serializer_class = YoutubeResourceSerializer
    parser_classes = [JSONParser]
    authentication_classes = [SessionAuthentication]
    # permission_classes = [AllowAny]

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            permission_classes = [IsCSRFTokenSet]
        else:
            permission_classes = [IsCSRFTokenSet, IsCSRFTokenAndRecordMatching]
        return [permission() for permission in permission_classes]


    def list(self, request):
        recent = self.queryset.filter(session__token=request.session["_csrftoken"])
        serializer = self.get_serializer(recent, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            session, session_created = Session.objects.get_or_create(token=request.session["_csrftoken"])
            session.resources.add(instance)

            # # delete anything older than the last 20 items
            # selection = self.queryset.order_by("-created_at")[20:]
            # for item in selection:
            #     item.delete()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


    def retrieve(self, request, pk=None):
        resource = self.get_object()
        serializer = self.get_serializer(resource)
        return Response(serializer.data)
        
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
    def retry(self, request, pk=None):
        resource = self.get_object()
        if resource.status == YoutubeResource.Status.FAILED:
            resource.status = YoutubeResource.Status.NEW
            resource.save()
        return redirect("/home")

