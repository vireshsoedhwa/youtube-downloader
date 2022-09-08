from django.apps import AppConfig
from django.conf import settings
import sys

import logging

logger = logging.getLogger(__name__)
from .logging.YoutubeIdFilter import YoutubeIdFilter

logger.addFilter(YoutubeIdFilter())


class YoutubeConfig(AppConfig):
    name = "youtube"

    def ready(self):

        if "runserver" in sys.argv or "playlistenerweb.asgi:application" in sys.argv:
            logger.info("DEBUG: " + str(settings.DEBUG))
            logger.info("PRODUCTION: " + str(settings.PRODUCTION))
            logger.info("GO_PIPELINE_LABEL: " + str(settings.GO_PIPELINE_LABEL))
            logger.info("PLAAPI_PATH: " + str(settings.PLAAPI_PATH))
            logger.info("youtube started")

            from django.contrib.auth.models import User

            if not User.objects.filter(username=settings.ADMIN_USERNAME).exists():
                User.objects.create_superuser(
                    settings.ADMIN_USERNAME,
                    "admin@example.com",
                    settings.ADMIN_PASSWORD,
                )
            
            from django_q.models import Schedule
            if not Schedule.objects.filter(name="archive_schedule").exists():
                logger.info("setting up archive schedule")
                Schedule.objects.create(
                    name="archive_schedule",
                    func="youtube.tasks.archive_oldest",
                    schedule_type=Schedule.MINUTES,
                    minutes=5,
                    repeats=-1,
                )
            else:
                logger.info("schedule already exists")
