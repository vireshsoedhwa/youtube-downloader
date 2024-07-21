from .logging.YoutubeIdFilter import YoutubeIdFilter
from logging.config import valid_ident
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import YoutubeResource, Session
from django.db import IntegrityError
import re
import os

import logging
logger = logging.getLogger(__name__)

def get_youtube_id(value):
    regExp = ".*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*"
    x = re.search(regExp, value)
    if x == None:
        raise serializers.ValidationError(f"[{value}] is not a valid youtube URL")
    return x.group(2)

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id']

class YoutubeResourceSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(max_value=None, min_value=None, read_only=True)
    # sessions = serializers.CharField(
    #     max_length=500, min_length=None, allow_blank=False, trim_whitespace=True
    # )
    youtube_id = serializers.CharField(max_length=20, min_length=None, read_only=True)
    url = serializers.CharField(
        max_length=100, min_length=None, allow_blank=False, trim_whitespace=True
    )

    class Meta:
        model = YoutubeResource
        fields = [
            "id",
            # "sessions",
            "youtube_id",
            "title",
            "url",
            "status",
            "progress",
            "eta",
            "elapsed",
            "speed",
            "error"
        ]

    def validate(self, attrs):
        url = attrs.get("url")
        attrs["youtube_id"] = get_youtube_id(url)
        return attrs

    def create(self, validated_data):
        try:
            record, record_created = YoutubeResource.objects.get_or_create(youtube_id=validated_data["youtube_id"])
            # loggingfilter = YoutubeIdFilter(youtuberesource=record)
            # logger.addFilter(loggingfilter)
            # logger.info("Existing Record Found")
            return record
        except Exception as e:      
            print(e)
            
    def update(self, instance, validated_data):

        return instance