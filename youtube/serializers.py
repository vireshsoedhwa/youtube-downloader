from .logging.YoutubeIdFilter import YoutubeIdFilter
from logging.config import valid_ident
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import YoutubeResource
from django.db import IntegrityError
import re
import os
from .youtube import YT

import logging
logger = logging.getLogger(__name__)


def get_youtube_id(value):
    regExp = ".*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*"
    x = re.search(regExp, value)
    if x == None:
        raise serializers.ValidationError(
            f"[{value}] is not a valid youtube URL")
    return x.group(2)


class YoutubeResourceSerializer(serializers.ModelSerializer):

    youtube_id = serializers.CharField(
        max_length=20, min_length=None, read_only=True)
    youtube_url = serializers.CharField(
        max_length=100, min_length=None, allow_blank=False, trim_whitespace=True)

    class Meta:
        model = YoutubeResource
        fields = ['youtube_id', 'youtube_url', 'title', 'description', 'status', 'filename',
                  'downloadprogress', 'eta', 'elapsed', 'speed', 'error', 'created_at']

    def validate(self, attrs):
        youtube_url = attrs.get(
            'youtube_url')

        # youtube_process = YT(youtube_url=youtube_url)
        # extracted_info = youtube_process.extract_info()
        # print(extracted_info)
        # print(extracted_info.get('id'))
        # print(extracted_info.get('_type'))
        # print(extracted_info.get('categories'))
        # print(extracted_info.get('display_id'))
        # print(extracted_info.get('tags'))
        # print(extracted_info.get('display_id'))
        # print(extracted_info.get('artist'))
        # print(extracted_info['display_id'])
        # print(extracted_info['tags'])
        # print(extracted_info.get('entries')[0]['id'])

        # if extracted_info.get('_type') == 'playlist':
        #     # get only the selected song:
        #     attrs['youtube_id'] = get_youtube_id(youtube_url)

        attrs['youtube_id'] = get_youtube_id(youtube_url)

        # raise serializers.ValidationError(
        #     " fault")

        return attrs

    def create(self, validated_data):
        print("tesss")
        newrecord, created = YoutubeResource.objects.get_or_create(
            **validated_data)

        print(validated_data['youtube_id'])    
        # loggingfilter = YoutubeIdFilter(youtuberesource=newrecord)
        # logger.addFilter(loggingfilter)
        # if created:
        #     logger.info("New Record Created")
        # else:
        #     logger.info("Existing Record Found")
        #     if newrecord.status == YoutubeResource.Status.FAILED:
        #         newrecord.status = YoutubeResource.Status.NEW
        #         newrecord.save()

        return newrecord

    def update(self, instance, validated_data):

        return instance
