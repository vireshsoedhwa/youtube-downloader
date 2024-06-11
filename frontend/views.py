from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
# from .serializers import YoutubeResourceSerializer
from django.http import HttpResponse, JsonResponse, FileResponse
# from .models import YoutubeResource
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


class BaseView(TemplateView):
    # template_name = 'index.html'
    extra_context = {'version': settings.VERSION}

