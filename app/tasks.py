from .logging.LoggingAdapter import LoggingAdapter
import time
from django.core.files.base import ContentFile
from django.core.files import File
from django.conf import settings
# from .youtube import YT
import time
from pathlib import Path
# from youtube_dl.utils import ExtractorError, YoutubeDLError

import json
import yt_dlp
import glob
import re

import logging
newlogger = logging.getLogger(__name__)


def get_video(instance):
    logger = LoggingAdapter(newlogger, {'id': instance.id})
    logger.info("starting download")
    instance.status = instance.Status.BUSY
    instance.save()
    downloader = Downloader(instance)
    downloader.run()

    instance.status = instance.Status.DONE
    instance.save()


class Downloader:
    def __init__(self, obj):
        self.obj = obj

        self.ydl_opts = {
            # 'format': 'bv*+ba/b',
            'outtmpl': settings.MEDIA_ROOT
            + str(self.obj.id) + '/%(title)s.%(ext)s',
            'keepvideo': True,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
            }],
            'logger': MyLogger(self.obj),
            'progress_hooks': [self.progress_hooks],
            'postprocessor_hooks': [self.postprocessor_hooks]
        }

    def run(self):
        logger = LoggingAdapter(newlogger, {'id': self.obj.id})
        with yt_dlp.YoutubeDL(self.ydl_opts) as ydl:
            result = ydl.download(self.obj.url)
            logger.info(result)

    def progress_hooks(self, d):
        logger = LoggingAdapter(newlogger, {'id': self.obj.id})
        if d["status"] == "downloading":
            self.obj.eta = d["eta"]
            self.obj.elapsed = d["elapsed"]
            self.obj.speed = d["speed"]
            self.obj.save()
            # logger.info("eta " + str(d["eta"]))
        if d["status"] == "error":
            self.obj.status = self.obj.Status.FAILED
            self.obj.save()
        if d["status"] == "finished":
            self.obj.eta = 0
            self.obj.save()
            path = Path(d["filename"])
            if path.is_file():
                logger.info("video file finished downloading")
            else:
                logger.error("file not found")

    def postprocessor_hooks(self, d):
        logger = LoggingAdapter(newlogger, {'id': self.obj.id})
        if d["status"] == "started":
            logger.info("start postprocessor")
        if d["status"] == "processing":
            pass
        if d["status"] == "finished":
            logger.info("finished postprocessor")
            video_paths = []
            for name in glob.glob(settings.MEDIA_ROOT
                                  + str(self.obj.id) + '/*'):
                if re.search(r"\.mp3$", name):
                    self.obj.audiofile.name = name
                    self.obj.save()
                else:
                    video_paths.append(name)
            shortest_video_filename = min(video_paths, key=len)
            self.obj.videofile.name = shortest_video_filename
            self.obj.save()


class MyLogger:
    def __init__(self, obj) -> None:
        self.obj = obj

    def debug(self, msg):
        logger = LoggingAdapter(newlogger, {'id': self.obj.id})
        if msg.startswith('[debug] '):
            pass
        else:
            self.info(msg)
            logger.info(msg)

    def info(self, msg):
        logger = LoggingAdapter(newlogger, {'id': self.obj.id})
        logger.info(msg)
        pass

    def warning(self, msg):
        logger = LoggingAdapter(newlogger, {'id': self.obj.id})
        logger.warning(msg)
        pass

    def error(self, msg):
        logger = LoggingAdapter(newlogger, {'id': self.obj.id})
        logger.error(msg)
