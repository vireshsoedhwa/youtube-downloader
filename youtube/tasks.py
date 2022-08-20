# import youtube_dl
import time
# from .models import DownloadProgress
from django.core.files.base import ContentFile
from django.core.files import File
from django.conf import settings
from .youtube import YT
import time
import os
from pathlib import Path
from youtube_dl.utils import ExtractorError, YoutubeDLError

from .models import YoutubeResource

import logging
logger = logging.getLogger(__name__)
from .logging.YoutubeIdFilter import YoutubeIdFilter

def get_video(instance):
    loggingfilter = YoutubeIdFilter(youtuberesource=instance)
    logger.addFilter(loggingfilter)

    try:
        youtube_process = YT(instance)
        youtube_process.run()
    except YoutubeDLError as ex:
        logger.error("YoutubeDL error")
        instance.error = ex.args
        instance.status = YoutubeResource.Status.FAILED
        instance.save()
    except:
        logger.error("YoutubeDL general error")
        instance.error = "YoutubeDL general error"
        instance.status = YoutubeResource.Status.FAILED
        instance.save()