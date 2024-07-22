from django.apps import AppConfig
from django.conf import settings
import sys

import logging
logger = logging.getLogger(__name__)

class AppConfig(AppConfig):
    name = "frontend"

    def ready(self):
        if settings.DEBUG:
            logger.info("started DEV")
        else:
            logger.info("started PRODUCTION")


            
