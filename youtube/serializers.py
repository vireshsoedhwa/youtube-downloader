from logging.config import valid_ident
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import YoutubeResource
from django.db import IntegrityError
import re
import os

import logging
logger = logging.getLogger(__name__)

class YoutubeResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = YoutubeResource
        fields = ['id']   