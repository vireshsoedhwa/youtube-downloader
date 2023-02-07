import time
from django.core.files.base import ContentFile
from django.core.files import File
from django.conf import settings
from .youtube import YT
import time
from pathlib import Path
from youtube_dl.utils import ExtractorError, YoutubeDLError

import requests
import re

import logging
newlogger = logging.getLogger(__name__)
from .logging.LoggingAdapter import LoggingAdapter

def get_video(instance):
    logger = LoggingAdapter(newlogger, {'id': instance.id})
    try:
        logger.info("Download Task starting")
        instance.status = instance.Status.BUSY
        instance.save()
        youtube_process = YT(instance)
        logger.info("Extracting Metadata ...")
        youtube_process.extract_info()
        logger.info("Finished extracting metadata ...")
        logger.info("Running download process ...")
        youtube_process.run()
        logger.info("Finished download process ...")
    except YoutubeDLError as ex:
        logger.error("YoutubeDL error")
        instance.error = ex.args
        instance.status = instance.Status.FAILED
        instance.save()
    except Exception as e:
        logger.error("YoutubeDL general error")
        instance.error = str(e)
        instance.status = instance.Status.FAILED
        instance.save()

def archive(instance):
    logger = LoggingAdapter(newlogger, {'id': instance.id})

    # check if Done. Review done or download done
    if not instance.status == instance.Status.ARCHIVE:
        raise ArchiveError("not ready for archive")
    # check if audiofile is there
    path = Path(
        settings.MEDIA_ROOT + str(instance.youtube_id) + "/" + instance.filename
    )
    if not path.is_file():
        raise ArchiveError(instance, "file is missing")

    logger.info("Audio file is present")

    values = {}
    values["title"] = instance.title
    artists = []
    artists.append(instance.artist)
    tags = []
    if not instance.tags == None:
        for tag in instance.tags:
            tags.append(tag)
    values["tags"] = tags
    values["artists"] = artists
    values["description"] = instance.description

    url_create = "http://" + settings.PLAPI_PATH + "/mediaresources/"
    logger.info(f"API: {url_create}")
    try:
        r1 = requests.post(
            url_create, files={"audiofile": path.open(mode="rb")}, data=values
        )
        if r1.status_code == requests.codes.created:
            logger.info("mediaresource created on Archive backend")
            instance.status = instance.Status.ARCHIVED
            instance.save()
            logger.info("Archive finished succesfully")
        else:
            raise Exception("Archive failed on backend. File could be present or backend unavailable")
    except Exception as e:
        logger.error(f"Failed to Archive {e}")
        raise ArchiveError(e)


class ArchiveError(Exception):
    def __init__(self, reason, message="ArchiveError"):
        self.message = message
        self.reason = reason
    def __str__(self):
        return f"{self.message} -> {self.reason}"
