from celery import shared_task
from celery.utils.log import get_task_logger

from .models import YoutubeResource
from django.conf import settings

from pathlib import Path
import yt_dlp
import glob
import re
import os

loggercelery = get_task_logger(__name__)

@shared_task(name='cleanup')
def cleanup(arg):
    loggercelery.info(f"Cleaning up files older than the last {arg} files")
    # delete anything older than the last 20 items
    selection = YoutubeResource.objects.order_by("-created_at")[arg:]
    for item in selection:
        item.delete()
        loggercelery.info(f"{item} : deleted")


@shared_task()
def download(instance_id):
    youtube_resource = YoutubeResource.objects.get(id=instance_id)
    loggercelery.info(f"Youtube_ID: {youtube_resource.youtube_id}")
    youtube_resource.status = youtube_resource.Status.BUSY
    youtube_resource.save()

    def progress_hooks(d):
        if d["status"] == "downloading":
            youtube_resource.title = Path(Path(os.path.basename(d["filename"])).stem).stem
            youtube_resource.eta = d["eta"]
            youtube_resource.elapsed = d["elapsed"]
            youtube_resource.speed = d["speed"]
            youtube_resource.save()
            # logger.info("eta " + str(d["eta"]))
        if d["status"] == "error":
            youtube_resource.status = youtube_resource.Status.FAILED
            youtube_resource.save()
            loggercelery.error("download failed")
        if d["status"] == "finished":
            youtube_resource.eta = 0
            youtube_resource.save()
            path = Path(d["filename"])
            if path.is_file():
                loggercelery.info("video file finished downloading")
            else:
                loggercelery.error("file not found")

    def postprocessor_hooks(d):
        if d["status"] == "started":
            loggercelery.info("start postprocessor")
        if d["status"] == "processing":
            pass
        if d["status"] == "finished":
            loggercelery.info("finished postprocessor")
            video_paths = []
            for name in glob.glob(settings.MEDIA_ROOT
                                  + str(youtube_resource.id) + '/*'):
                if re.search(r"\.mp3$", name):
                    youtube_resource.audiofile.name = name
                    youtube_resource.save()
                else:
                    video_paths.append(name)
            shortest_video_filename = min(video_paths, key=len)
            youtube_resource.videofile.name = shortest_video_filename
            youtube_resource.save()

    ydl_opts = {
        # 'format': 'bv*+ba/b',
        'outtmpl': settings.MEDIA_ROOT
        + str(instance_id) + '/%(title)s.%(ext)s',
        'keepvideo': True,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }],
        'logger': MyLogger(instance_id),
        'progress_hooks': [progress_hooks],
        'postprocessor_hooks': [postprocessor_hooks]
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            result = ydl.download(youtube_resource.url)
            loggercelery.info(result)
            youtube_resource.status = youtube_resource.Status.DONE
            youtube_resource.save()
        except Exception as e:
            loggercelery.error(e)


class MyLogger:
    def __init__(self, instance_id) -> None:
        self.instance_id = instance_id
    def debug(self, msg):

        if msg.startswith('[debug] '):
            pass
        else:
            loggercelery.info(msg)

    def info(self, msg):
        loggercelery.info(msg)

    def warning(self, msg):
        loggercelery.warn(msg)

    def error(self, msg):
        loggercelery.error(msg)