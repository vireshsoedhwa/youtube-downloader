from django.apps import AppConfig
from django.conf import settings
import sys

import logging

logger = logging.getLogger(__name__)
from .logging.YoutubeIdFilter import YoutubeIdFilter

logger.addFilter(YoutubeIdFilter())
gunicorn_logger = logging.getLogger('gunicorn.error')
logger.handlers = gunicorn_logger.handlers
logger.setLevel(gunicorn_logger.level)

class AppConfig(AppConfig):
    name = "app"

    def ready(self):

        # logger.info(sys.argv)
        # for item in sys.argv:
        #     logger.info("arguments")
        #     logger.info(item)
        if settings.DEBUG:
            logger.info("started DEV")
        else:
            logger.info("started PRODUCTION")

        # from django.contrib.auth.models import User

        # try:
        #     logger.info("testuser")
        #     for user in User.objects.all():
        #         logger.info(user)
                                            
        #     logger.info(User.objects.filter(username=settings.ADMIN_USERNAME).exists())

        #     if User.objects.filter(username=settings.ADMIN_USERNAME).exists():
        #         logger.info("Superuser user already exists")
        #     else:
        #         logger.info("Creating superuser")
        #         User.objects.create_superuser(
        #             settings.ADMIN_USERNAME,
        #             "admin@example.com",
        #             settings.ADMIN_PASSWORD,
        #         )

        # except Exception as e:
        #     logger.error(f"Error creating superuser: {e}")
            
