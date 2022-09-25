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

logger = logging.getLogger(__name__)
from .logging.YoutubeIdFilter import YoutubeIdFilter

logger.addFilter(YoutubeIdFilter())


def get_video(instance):
    logger.addFilter(YoutubeIdFilter(youtuberesource=instance))
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


def archive_oldest():
    from .models import YoutubeResource

    grab_only_music = YoutubeResource.objects.filter(is_music=True).filter(
        is_playlist=False
    )
    grab_only_done = grab_only_music.filter(status=YoutubeResource.Status.DONE)
    if len(grab_only_done) == 0:
        logger.info(f"Nothing to archive")
    else:
        oldest = grab_only_done.order_by("created_at")[0]
        oldest.status = oldest.Status.ARCHIVE
        oldest.save()
        logger.info(f"Archiving : {oldest.id}")


def archive(instance):
    loggingfilter = YoutubeIdFilter(youtuberesource=instance)
    logger.addFilter(loggingfilter)

    # check if Needs review
    if instance.status == instance.Status.REVIEW:
        raise ArchiveError(instance, "Needs review before archiving")

    # check if Done. Review done or download done
    if not instance.status == instance.Status.ARCHIVE:
        raise ArchiveError(instance, "not ready for archive")

    # check if audiofile is there
    path = Path(
        settings.MEDIA_ROOT + str(instance.youtube_id) + "/" + instance.filename
    )
    if not path.is_file():
        raise ArchiveError(instance, "file is missing")

    # check if music
    if not instance.is_music:
        raise ArchiveError(instance, "not Music category")

    # check if artist exists
    if instance.artist == None or instance.artist == "":
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
                    for tag in instance.tags:
                        if possible_artist.lower() in tag.lower():
                            instance.status = instance.Status.DONE
                            instance.artist = possible_artist
                            break
                        else:
                            instance.status = instance.Status.REVIEW

                else:
                    instance.status = instance.Status.REVIEW
    else:
        # artist already recorded. no analysis needed
        instance.status = instance.Status.DONE

    if instance.status == instance.Status.DONE:
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

        url_create = settings.PLAPI_PATH + "/mediaresources/"
        try:
            r1 = requests.post(
                url_create, files={"audiofile": path.open(mode="rb")}, data=values
            )
        except:
            raise ArchiveError(instance, "request to api failed")

        if r1.status_code == requests.codes.created:
            logger.info("mediaresource created on Archive backend")
            instance.status = instance.Status.ARCHIVED
            instance.save()
        else:
            instance.status = instance.Status.REVIEW
            instance.save()
            raise ArchiveError(
                instance, f"request to api failed with code: {r1.status_code}"
            )
    else:
        instance.status = instance.Status.REVIEW
        instance.save()
        return

    logger.info("Archive finished succesfully")


class ArchiveError(Exception):
    def __init__(self, instance, message="Archive failed"):
        self.message = message
        self.instance_id = instance.id
        super().__init__(self.message)

    def __str__(self):
        logger.error(self.message)
        return f"{str(self.instance_id)} -> {self.message}"
