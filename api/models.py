from .logging.YoutubeIdFilter import YoutubeIdFilter
from django.db import models
from django.core.files.storage import FileSystemStorage
from django.utils.translation import gettext_lazy as _
from django.db.models import Deferrable, UniqueConstraint
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from pathlib import Path

import celery

from django.conf import settings

import os
import shutil
import logging

logger = logging.getLogger(__name__)
loggingfilter = YoutubeIdFilter()
logger.addFilter(loggingfilter)


def file_directory_path(instance, filename):
    return f"{settings.MEDIA_ROOT}/{instance.id}/{filename}"



class YoutubeResource(models.Model):

    class Status(models.TextChoices):
        NEW = "NEW", _("New")
        QUEUED = "QUEUED", _("Queued")
        BUSY = "BUSY", _("Busy")
        FAILED = "FAILED", _("Failed")
        DONE = "DONE", _("Done")

    id = models.AutoField(primary_key=True)
    session = models.TextField(null=True, blank=True, max_length=200)
    youtube_id = models.TextField(unique=True, max_length=200)
    title = models.TextField(unique=False, null=True, blank=True, default="N/A", max_length=200)
    url = models.TextField(max_length=500, null=True, blank=True)
    audiofile = models.FileField(upload_to=file_directory_path,
                                 null=True,
                                 blank=True, max_length=200)
    videofile = models.FileField(upload_to=file_directory_path,
                                 null=True,
                                 blank=True, max_length=200)
    status = models.CharField(
        max_length=15, choices=Status.choices, default=Status.NEW)
    progress = models.DecimalField(
        max_digits=3, decimal_places=0, blank=True, null=True, default=0
    )
    eta = models.DecimalField(
        max_digits=15, decimal_places=0, blank=True, null=True, default=0)
    elapsed = models.DecimalField(
        max_digits=15, decimal_places=0, blank=True, null=True, default=0)
    speed = models.DecimalField(
        max_digits=15, decimal_places=0, blank=True, null=True, default=0)
    error = models.TextField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{str(self.id)} : {self.youtube_id}"

    def audiofile_name(self):
        return os.path.basename(self.audiofile.name)

    def videofile_name(self):
        return os.path.basename(self.videofile.name)

    # def get_file_path(self):
    #     try:
    #         path = Path(settings.MEDIA_ROOT +
    #                     self.youtube_id + "/" + self.filename)
    #         if path.is_file():
    #             logger.info("File found for download")
    #             return path
    #         else:
    #             logger.info("File missing")
    #             return None
    #     except:
    #         return None

# signal for deleting


@receiver(post_delete, sender=YoutubeResource, dispatch_uid="delete_record")
def postdelete(sender, instance, **kwargs):
    logger.info(f"Deleting record id#: {instance.id} - {instance.youtube_id}")
    try:
        shutil.rmtree(settings.MEDIA_ROOT + str(instance.id))
        logger.info(
            f"Files deleted id#: {instance.id} - {instance.youtube_id}")
    except:
        logger.error("Files could not be deleted")


@receiver(post_save, sender=YoutubeResource, dispatch_uid="add_record")
def postsave(sender, instance, created, raw, using, update_fields, **kwargs):
    loggingfilter = YoutubeIdFilter(youtuberesource=instance)
    logger.addFilter(loggingfilter)

    if instance.status == YoutubeResource.Status.QUEUED:
        logger.info("before task scheduled")
        celery.current_app.send_task('app.tasks.download', [instance.id])
        logger.info("task scheduled")
        # logger.info(result.get())

    if instance.status == YoutubeResource.Status.DONE:
        logger.info("DONE")

    if instance.status == YoutubeResource.Status.FAILED:
        logger.info("FAILED")
        try:
            shutil.rmtree(settings.MEDIA_ROOT + str(instance.id))
            logger.info(
                f"Files deleted id#: {instance.id} - {instance.youtube_id}")
        except:
            logger.error("Files could not be deleted")

    if instance.status == YoutubeResource.Status.BUSY:
        # logger.info("Instance Busy")
        logger.info(f"ETA: {instance.eta}")