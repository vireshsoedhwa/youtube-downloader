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

logger = logging.getLogger(__name__)
logger.addFilter(YoutubeIdFilter())

decorators = [never_cache, login_required]

@method_decorator(decorators, name='dispatch')
class BaseView(TemplateView):
    template_name = 'home.html'
    extra_context={'version': settings.VERSION}


# @ensure_csrf_cookie
# def index(request):
#     if request.session.test_cookie_worked():
#         print(str(request.headers["Cookie"]))
#     request.session.set_test_cookie()
#     context = {
#         "version": settings.VERSION,
#     }
#     return render(request, "youtube/index.html", context)


class YoutubeResourceViewset(viewsets.ModelViewSet):
    queryset = YoutubeResource.objects.all()
    serializer_class = YoutubeResourceSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        recent = self.queryset.order_by("-created_at")[:100]
        serializer = self.get_serializer(recent, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            instance.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def update(self, request, pk):
        resource = self.get_object()
        if resource.status == YoutubeResource.Status.FAILED:
            resource.status = YoutubeResource.Status.QUEUED
            resource.save()
        return Response(status=204)

    @action(detail=True)
    def download(self, request, pk=None):
        resource = self.get_object()
        file_path = resource.get_file_path()
        if file_path is not None:
            file_response = FileResponse(
                open(file_path, "rb"), as_attachment=True, filename=resource.filename
            )
            return file_response
        return Response("File missing", status=404)
