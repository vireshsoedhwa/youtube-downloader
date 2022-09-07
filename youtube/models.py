from django.db import models
from django.core.files.storage import FileSystemStorage
from django.utils.translation import gettext_lazy as _
from django.db.models import Deferrable, UniqueConstraint
from django.db.models.signals import post_save
from django.dispatch import receiver
from django_q.tasks import async_task
from .tasks import archive
from pathlib import Path

from django.conf import settings

import re
import logging

logger = logging.getLogger(__name__)
from .logging.YoutubeIdFilter import YoutubeIdFilter
loggingfilter = YoutubeIdFilter()
logger.addFilter(loggingfilter)


def file_directory_path(instance, filename):
    return "/code/dl/{0}/{1}".format(instance.id, filename)


class YoutubeResource(models.Model):
    def __init__(self, *args, **kwargs):
        super(YoutubeResource, self).__init__(*args, **kwargs)
        loggingfilter = YoutubeIdFilter(self)
        logger.addFilter(loggingfilter)
        self.logger = logger

    class Status(models.TextChoices):
        NEW = "NEW", _("New")
        QUEUED = "QUEUED", _("Queued")
        BUSY = "BUSY", _("Busy")
        FAILED = "FAILED", _("Failed")
        DONE = "DONE", _("Done")
        REVIEW = "REVIEW", _("Review")
        ARCHIVE = "ARCHIVE", _("Archive")
        ARCHIVED = "ARCHIVED", _("Archived")

    id = models.AutoField(primary_key=True)
    youtube_id = models.TextField(unique=True, max_length=200)
    youtube_url = models.TextField(max_length=500, null=True, blank=True)
    title = models.TextField(max_length=200, null=True, blank=True, default="")
    description = models.TextField(max_length=5000, null=True, blank=True)
    genre = models.TextField(max_length=100, null=True, blank=True)
    filename = models.TextField(max_length=100, null=True, blank=True)
    # audiofile = models.FileField(upload_to=file_directory_path,
    #                              null=True,
    #                              blank=True)
    is_playlist = models.BooleanField(default=False)
    is_music = models.BooleanField(default=False)
    artist = models.TextField(max_length=100, null=True, blank=True)
    tags = models.JSONField(encoder=None, decoder=None, null=True, blank=True)
    categories = models.JSONField(encoder=None, decoder=None, null=True, blank=True)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.NEW)
    downloadprogress = models.DecimalField(
        max_digits=3, decimal_places=0, blank=True, default=0
    )
    eta = models.DecimalField(max_digits=5, decimal_places=0, blank=True, default=0)
    elapsed = models.DecimalField(max_digits=5, decimal_places=0, blank=True, default=0)
    speed = models.DecimalField(max_digits=10, decimal_places=0, blank=True, default=0)
    error = models.TextField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{str(self.id)} : {self.youtube_id} >>> {self.title[0:40]}..."

    def get_file_path(self):
        try:
            path = Path(settings.MEDIA_ROOT + self.youtube_id + "/" + self.filename)
            if path.is_file():
                self.logger.info("File found for download")
                return path
            else:
                self.logger.info("File missing")
                return None
        except:
            return None


@receiver(post_save, sender=YoutubeResource, dispatch_uid="add_record")
def postsave(sender, instance, created, raw, using, update_fields, **kwargs):
    loggingfilter = YoutubeIdFilter(youtuberesource=instance)
    logger.addFilter(loggingfilter)

    if instance.status == YoutubeResource.Status.QUEUED:
        async_task("youtube.tasks.get_video", instance, sync=False)
        logger.info("task scheduled")


    if instance.status == YoutubeResource.Status.DONE:        
        logger.info("DONE")

    if instance.status == YoutubeResource.Status.FAILED:        
        logger.info("FAILED")
    
    if instance.status == YoutubeResource.Status.BUSY:        
        logger.info("Instance Busy")

    if instance.status == YoutubeResource.Status.REVIEW:        
        logger.info("REVIEW")
    
    if instance.status == YoutubeResource.Status.ARCHIVE:        
        logger.info("ARCHIVE")
        archive(instance)

    if instance.status == YoutubeResource.Status.ARCHIVED:        
        logger.info("ARCHIVED")

