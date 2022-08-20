from .logging.YoutubeIdFilter import YoutubeIdFilter
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

    youtube_id = serializers.CharField(
        max_length=20, min_length=None, allow_blank=False, trim_whitespace=True)

    class Meta:
        model = YoutubeResource
        fields = ['id', 'youtube_id', 'title', 'description', 'status', 'filename',
                  'downloadprogress', 'eta', 'elapsed', 'speed', 'error', 'archive', 'created_at']

    def create(self, validated_data):
        newrecord, created = YoutubeResource.objects.get_or_create(
            **validated_data)
        loggingfilter = YoutubeIdFilter(youtuberesource=newrecord)
        logger.addFilter(loggingfilter)
        if created:
            logger.info("New Record Created")
        else:
            logger.info("Existing Record Found")
            if newrecord.status == YoutubeResource.Status.FAILED:
                newrecord.status = YoutubeResource.Status.NEW
                newrecord.save()
        return newrecord
