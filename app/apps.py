from django.apps import AppConfig
from django.conf import settings
import sys

import logging

logger = logging.getLogger(__name__)
from .logging.YoutubeIdFilter import YoutubeIdFilter

logger.addFilter(YoutubeIdFilter())


class AppConfig(AppConfig):
    name = "app"

    def ready(self):

        if "runserver" in sys.argv or "playlistenerweb.wsgi" in sys.argv:
            logger.info("DEBUG: " + str(settings.DEBUG))
            logger.info("VERSION: " + str(settings.VERSION))
            logger.info("youtube started")

            from django.contrib.auth.models import User

            if not User.objects.filter(username=settings.ADMIN_USERNAME).exists():
                User.objects.create_superuser(
                    settings.ADMIN_USERNAME,
                    "admin@example.com",
                    settings.ADMIN_PASSWORD,
                )
            
            # from django_q.models import Schedule
            # if not Schedule.objects.filter(name="archive_schedule").exists():
            #     logger.info("setting up archive schedule")
            #     Schedule.objects.create(
            #         name="archive_schedule",
            #         func="youtube.tasks.archive_oldest",
            #         schedule_type=Schedule.MINUTES,
            #         minutes=5,
            #         repeats=-1,
            #     )
            # else:
            #     logger.info("schedule already exists")
