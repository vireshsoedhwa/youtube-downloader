from .logging.YoutubeIdFilter import YoutubeIdFilter
from logging.config import valid_ident
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import YoutubeResource
from django.db import IntegrityError
import re
import os

# from .youtube import YT
import youtube_dl

import logging

logger = logging.getLogger(__name__)

YDL_OPTIONS = {"noplaylist": "False"}


def extract_info(youtube_url):
    with youtube_dl.YoutubeDL(YDL_OPTIONS) as ydl:
        extracted_info = ydl.extract_info(
            youtube_url,
            download=False,
            ie_key=None,
            extra_info={},
            process=True,
            force_generic_extractor=False,
        )
        return extracted_info


def check_music(youtube_id):
    youtube_target_url = "https://youtube.com/watch?v=" + youtube_id


def get_youtube_id(value):
    regExp = ".*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*"
    x = re.search(regExp, value)
    if x == None:
        raise serializers.ValidationError(f"[{value}] is not a valid youtube URL")
    return x.group(2)


class YoutubeResourceSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(max_value=None, min_value=None, read_only=True)
    youtube_id = serializers.CharField(max_length=20, min_length=None, read_only=True)
    youtube_url = serializers.CharField(
        max_length=100, min_length=None, allow_blank=False, trim_whitespace=True
    )

    class Meta:
        model = YoutubeResource
        fields = [
            "id",
            "youtube_id",
            "youtube_url",
            "title",
            "description",
            "is_playlist",
            "is_music",
            "status",
            "filename",
            "downloadprogress",
            "eta",
            "elapsed",
            "speed",
            "error",
            "created_at",
        ]

    def validate(self, attrs):
        youtube_url = attrs.get("youtube_url")

        attrs["youtube_id"] = get_youtube_id(youtube_url)

        # raise serializers.ValidationError(
        #     " fault")

        return attrs

    def create(self, validated_data):

        print(validated_data["youtube_id"])
        try:
            record = YoutubeResource.objects.get(
                youtube_id=validated_data["youtube_id"]
            )
            loggingfilter = YoutubeIdFilter(youtuberesource=record)
            logger.addFilter(loggingfilter)
            logger.info("Existing Record Found")
            if record.status == YoutubeResource.Status.FAILED:
                record.status = YoutubeResource.Status.NEW
                record.save()
            return record
        except YoutubeResource.DoesNotExist:
            record = YoutubeResource.objects.create(**validated_data)
            loggingfilter = YoutubeIdFilter(youtuberesource=record)
            logger.addFilter(loggingfilter)

            youtube_url = validated_data["youtube_url"]
            extracted_info = extract_info(youtube_url)
            # print(extracted_info.keys())
            record.description = extracted_info.get("description")
            try:
                extracted_info.get("categories").index("Music")
                record.is_music = True
                logger.info("Music Category")
            except Exception as e:
                logger.info("Other Category")
                record.is_music = False
                logger.info("New Record Created")
            record.save()
            return record

    def update(self, instance, validated_data):

        return instance
