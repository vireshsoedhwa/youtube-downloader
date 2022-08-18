from django.db import models
from django.core.files.storage import FileSystemStorage
from django.utils.translation import gettext_lazy as _
from django.db.models import Deferrable, UniqueConstraint
from django.db.models.signals import post_save
from django.dispatch import receiver

import re


def file_directory_path(instance, filename):
    return '/code/dl/{0}/{1}'.format(instance.id, filename)


class YoutubeResource(models.Model):
    class Status(models.TextChoices):
        NEW = 'NEW', _('New')
        BUSY = 'BUSY', _('Busy')
        FAILED = 'FAILED', _('Failed')
        DONE = 'DONE', _('Done')
    id = models.AutoField(primary_key=True)
    youtube_id = models.TextField(unique=True, max_length=200)
    title = models.TextField(max_length=200, null=True, blank=True)
    description = models.TextField(max_length=5000, null=True, blank=True)
    audiofile = models.FileField(upload_to=file_directory_path,
                                 null=True,
                                 blank=True)
    status = models.CharField(
        max_length=7, choices=Status.choices, default=Status.NEW)
    downloadprogress = models.DecimalField(
        max_digits=3, decimal_places=0, blank=True, default=0)
    eta = models.DecimalField(
        max_digits=5, decimal_places=0, blank=True, default=0)
    elapsed = models.DecimalField(
        max_digits=5, decimal_places=0, blank=True, default=0)
    speed = models.DecimalField(
        max_digits=10, decimal_places=0, blank=True, default=0)
    error = models.TextField(max_length=500, null=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)
