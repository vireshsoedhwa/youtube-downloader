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

def get_youtube_id(value):
    regExp = ".*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*"
    x = re.search(regExp, value)
    if x == None:
        raise serializers.ValidationError(f"[{value}] is not a valid youtube URL")
    return x.group(2)

class YoutubeResourceSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(max_value=None, min_value=None, read_only=True)
    session = serializers.CharField(
        max_length=500, min_length=None, allow_blank=False, trim_whitespace=True
    )
    youtube_id = serializers.CharField(max_length=20, min_length=None, read_only=True)
    url = serializers.CharField(
        max_length=100, min_length=None, allow_blank=False, trim_whitespace=True
    )

    class Meta:
        model = YoutubeResource
        fields = [
            "id",
            "session",
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
            filterqs = YoutubeResource.objects.filter(
                    session=validated_data["session"])
            
            print("something")
            print(filterqs)
            record = filterqs.get(youtube_id=validated_data["youtube_id"])
            print("record"
            )
            print(record)
            # record = record.get(youtube_id=validated_data["youtube_id"])
            # loggingfilter = YoutubeIdFilter(youtuberesource=record)
            # logger.addFilter(loggingfilter)
            # logger.info("Existing Record Found")
            if record.status == record.Status.FAILED:
                record.status = record.Status.QUEUED
            return record
        except Exception as e:
            print("THIS SHOULD NOT RUN 333")
            print(e)
            record = YoutubeResource.objects.create(**validated_data)
            loggingfilter = YoutubeIdFilter(youtuberesource=record)
            logger.addFilter(loggingfilter)          
            logger.info("Creating New Record")
            record.status = record.Status.QUEUED
            return record
        except:
            print("Something else went wrong") 

    def update(self, instance, validated_data):

        return instance