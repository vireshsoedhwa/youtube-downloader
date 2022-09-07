import time
from django.core.files.base import ContentFile
from django.core.files import File
from django.conf import settings
from .youtube import YT
import time
from pathlib import Path
from youtube_dl.utils import ExtractorError, YoutubeDLError

from .models import YoutubeResource

import requests
import re

import logging

logger = logging.getLogger(__name__)
from .logging.YoutubeIdFilter import YoutubeIdFilter

logger.addFilter(YoutubeIdFilter())


def get_video(instance):
    loggingfilter = YoutubeIdFilter(youtuberesource=instance)
    logger.addFilter(loggingfilter)
    try:
        logger.info("Download Task starting")
        instance.status = YoutubeResource.Status.BUSY
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
        instance.status = YoutubeResource.Status.FAILED
        instance.save()
    except Exception as e:
        logger.error("YoutubeDL general error")
        instance.error = str(e)
        instance.status = YoutubeResource.Status.FAILED
        instance.save()


def archive(instance):
    loggingfilter = YoutubeIdFilter(youtuberesource=instance)
    logger.addFilter(loggingfilter)
    # check if audiofile is there
    path = Path(
        settings.MEDIA_ROOT + str(instance.youtube_id) + "/" + instance.filename
    )
    if not path.is_file():
        raise ArchiveError(instance, "file is missing")

    # check if Done
    if not instance.status == YoutubeResource.Status.DONE:
        raise ArchiveError(instance, "not finished processing")

    # check if music
    if not instance.is_music:
        raise ArchiveError(instance, "not Music category")

    # check if artist exists
    if instance.artist == None:
        # check if title exists
        if instance.title == None:
            raise ArchiveError(instance, "title is missing")
        else:
            # check if tags
            possible_artist = None
            x = re.search(r"(^.*)-", instance.title)
            if x is None:
                raise ArchiveError(instance, "Could not derive artist from title")
            else:
                possible_artist = x.group(1).strip()
                if not instance.tags == None:
                    if possible_artist in instance.tags:
                        instance.needs_review = False
                        instance.artist = possible_artist
                    else:
                        instance.needs_review = True
                else:
                    instance.needs_review = True
    else:
        # artist already recorded. no analysis needed
        instance.needs_review = False

    values = {}
    if not instance.needs_review:
        values = {"artists": instance.artist}
        tags = []
        if not instance.tags == None:
            for tag in instance.tags:
                tags.append(tag)
        values["tags"] = tags

        url_create = settings.PLAAPI_PATH + "/mediaresources/"
        r1 = requests.post(
            url_create, files={"audiofile": path.open(mode="rb")}, data=values
        )
        if r1.status_code == requests.codes.created:
            logger.info("mediaresource created on Archive backend")
            instance.status = YoutubeResource.Status.ARCHIVED
            instance.save()
        else:
            raise ArchiveError(
                instance, f"request to api failed with code: {r1.status_code}"
            )
    else:
        instance.save()
        raise ArchiveError(instance, "needs review")

    logger.info("Archive finished succesfully")


class ArchiveError(Exception):
    def __init__(self, instance, message="Archive failed"):
        self.message = message
        self.instance_id = instance.id
        super().__init__(self.message)

    def __str__(self):
        logger.error(self.message)
        return f"{str(self.instance_id)} -> {self.message}"
